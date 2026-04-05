import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function cleanJsonString(value: string) {
  return value
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url, platform, offer, audience, notes } = body ?? {};

    if (!url) {
      return NextResponse.json(
        { error: "Lien vidéo manquant." },
        { status: 400 }
      );
    }

    const prompt = `
Tu es un expert en marketing créatif UGC et performance ads.

Analyse cette vidéo à partir de son lien :
${url}

Contexte :
- Plateforme : ${platform || "Non précisée"}
- Produit / Offre : ${offer || "Non précisé"}
- Audience : ${audience || "Non précisée"}
- Notes : ${notes || "Aucune"}

Retourne UNIQUEMENT un JSON valide, sans texte autour, sans markdown, sans balises \`\`\`.

Format attendu :
{
  "transcript": "",
  "summary": "",
  "hook": "",
  "structure": "",
  "angle": "",
  "psychology": ["", ""],
  "strengths": ["", ""],
  "weaknesses": ["", ""],
  "recreateIdeas": ["", ""],
  "similarHooks": ["", ""],
  "similarAngles": ["", ""],
  "scriptPrompt": ""
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content:
            "Tu es un expert en analyse marketing UGC et ads. Tu réponds uniquement en JSON valide.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = completion.choices[0]?.message?.content || "";
    const cleaned = cleanJsonString(content);

    let parsed: any;

    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        {
          error: "Réponse IA invalide",
          details: content,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      transcript:
        typeof parsed?.transcript === "string" ? parsed.transcript : "",
      summary: typeof parsed?.summary === "string" ? parsed.summary : "",
      hook: typeof parsed?.hook === "string" ? parsed.hook : "",
      structure: typeof parsed?.structure === "string" ? parsed.structure : "",
      angle: typeof parsed?.angle === "string" ? parsed.angle : "",
      psychology: Array.isArray(parsed?.psychology) ? parsed.psychology : [],
      strengths: Array.isArray(parsed?.strengths) ? parsed.strengths : [],
      weaknesses: Array.isArray(parsed?.weaknesses) ? parsed.weaknesses : [],
      recreateIdeas: Array.isArray(parsed?.recreateIdeas)
        ? parsed.recreateIdeas
        : [],
      similarHooks: Array.isArray(parsed?.similarHooks)
        ? parsed.similarHooks
        : [],
      similarAngles: Array.isArray(parsed?.similarAngles)
        ? parsed.similarAngles
        : [],
      scriptPrompt:
        typeof parsed?.scriptPrompt === "string" ? parsed.scriptPrompt : "",
    });
  } catch (error: any) {
    console.error("ANALYZE VIDEO ERROR:", error);

    return NextResponse.json(
      {
        error: "Erreur serveur",
        details: error?.message || "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}
