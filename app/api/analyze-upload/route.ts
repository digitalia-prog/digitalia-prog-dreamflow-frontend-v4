import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const platform = formData.get("platform")?.toString() || "TikTok";
    const product = formData.get("product")?.toString() || "-";
    const audience = formData.get("audience")?.toString() || "-";
    const notes = formData.get("notes")?.toString() || "-";

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier upload" },
        { status: 400 }
      );
    }

    // 🔥 convertir en buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // 🔥 TRANSCRIPTION AUDIO
    const transcriptRes = await openai.audio.transcriptions.create({
      file: new File([buffer], file.name),
      model: "gpt-4o-transcribe",
    });

    const transcript = transcriptRes.text;

    // 🔥 ANALYSE MARKETING
    const analysisRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `
Analyse cette publicité ${platform}.

Contexte :
Produit: ${product}
Audience: ${audience}
Notes: ${notes}

Transcript:
${transcript}

Donne :
- Résumé
- Hook
- Structure
- Angle
- Psychologie
- Points forts
- Points faibles
- Idées à reproduire
- Hooks similaires
- Angles similaires
- Brief pour recréer une vidéo similaire

Réponds en JSON clair.
          `,
        },
      ],
    });

    let analysisText = analysisRes.choices[0].message.content || "{}";

    let parsed;
    try {
      parsed = JSON.parse(analysisText);
    } catch {
      parsed = {
        summary: analysisText,
      };
    }

    return NextResponse.json({
      success: true,
      transcript,
      ...parsed,
    });
  } catch (error) {
    console.error("Erreur analyze-upload:", error);

    return NextResponse.json(
      { error: "Erreur serveur analyse" },
      { status: 500 }
    );
  }
}
