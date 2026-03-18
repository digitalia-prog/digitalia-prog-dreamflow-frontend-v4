import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function toBulletString(value: unknown): string {
  if (!Array.isArray(value)) return "-";
  const items = value
    .filter((item) => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);

  if (!items.length) return "-";
  return items.map((item) => `• ${item}`).join("\n");
}

function toText(value: unknown, fallback = "-"): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: "OPENAI_API_KEY manquante sur Vercel.",
        },
        { status: 500 }
      );
    }

    const formData = await req.formData();

    const file = formData.get("file");
    const platform = String(formData.get("platform") || "TikTok");
    const product = String(formData.get("product") || "");
    const audience = String(formData.get("audience") || "");
    const notes = String(formData.get("notes") || "");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "Aucun fichier valide reçu.",
        },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        {
          error: "Le fichier est vide.",
        },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "audio/mpeg",
      "audio/mp3",
      "audio/mp4",
      "audio/x-m4a",
      "audio/wav",
      "audio/webm",
      "audio/ogg",
      "video/mp4",
      "video/webm",
      "video/quicktime",
      "video/mpeg",
    ];

    if (file.type && !allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Format non supporté: ${file.type}`,
          details: "Utilise mp3, mp4, m4a, wav, ogg, webm ou mov.",
        },
        { status: 400 }
      );
    }

    // 1) Transcription réelle
    const transcriptionForm = new FormData();
    transcriptionForm.append("file", file, file.name || "upload.mp4");
    transcriptionForm.append("model", "gpt-4o-mini-transcribe");

    const transcriptionRes = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: transcriptionForm,
      }
    );

    const transcriptionRaw = await transcriptionRes.text();

    let transcriptionJson: any = null;
    try {
      transcriptionJson = JSON.parse(transcriptionRaw);
    } catch {
      transcriptionJson = null;
    }

    if (!transcriptionRes.ok) {
      console.error("TRANSCRIPTION ERROR:", transcriptionRaw);

      return NextResponse.json(
        {
          error: "Échec de la transcription audio.",
          details:
            transcriptionJson?.error?.message ||
            transcriptionRaw ||
            "Erreur inconnue côté transcription.",
        },
        { status: 500 }
      );
    }

    const transcript = toText(transcriptionJson?.text, "");

    if (!transcript) {
      return NextResponse.json(
        {
          error: "Aucune transcription exploitable n’a été retournée.",
          details:
            "Le fichier a bien été reçu, mais aucun texte n’a pu être extrait.",
        },
        { status: 400 }
      );
    }

    // 2) Analyse marketing réelle
    const systemPrompt = `
Tu es un expert en marketing UGC, TikTok Ads, hooks publicitaires et analyse de contenus courts.

Règles strictes :
- Tu réponds dans la langue du transcript principal.
- Tu n’inventes pas de détails visuels non confirmés par l’audio ou les notes.
- Si le contenu n’est pas vraiment une pub, tu le dis honnêtement.
- Tu produis une analyse utile, concrète et crédible.
- Tu réponds UNIQUEMENT en JSON valide.
`;

    const userPrompt = `
Analyse ce contenu audio / vidéo à partir de sa transcription réelle.

Contexte :
- Plateforme : ${platform}
- Produit / Offre : ${product || "non précisé"}
- Audience : ${audience || "non précisée"}
- Notes utilisateur : ${notes || "aucune"}

Transcript :
${transcript}

Réponds avec EXACTEMENT cette structure JSON :
{
  "summary": "string",
  "hook": "string",
  "structure": "string",
  "angle": "string",
  "psychology": ["string"],
  "strengths": ["string"],
  "weaknesses": ["string"],
  "ideas": ["string"],
  "similarHooks": ["string"],
  "similarAngles": ["string"],
  "recreationBrief": "string"
}

Consignes :
- summary : résumé utile et honnête
- hook : l’accroche réelle ou probable à partir de ce qui est dit
- structure : déroulé du contenu
- angle : angle marketing ou angle narratif
- psychology : mécanismes émotionnels / cognitifs
- strengths : points forts
- weaknesses : points faibles
- ideas : idées à reproduire / améliorer
- similarHooks : 3 à 5 hooks similaires
- similarAngles : 3 angles similaires
- recreationBrief : brief court pour recréer une vidéo similaire
`;

    const analysisRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.6,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    const analysisRaw = await analysisRes.text();

    let analysisOuter: any = null;
    try {
      analysisOuter = JSON.parse(analysisRaw);
    } catch {
      analysisOuter = null;
    }

    if (!analysisRes.ok) {
      console.error("ANALYSIS ERROR:", analysisRaw);

      return NextResponse.json(
        {
          error: "Échec de l’analyse marketing.",
          details:
            analysisOuter?.error?.message ||
            analysisRaw ||
            "Erreur inconnue côté analyse.",
        },
        { status: 500 }
      );
    }

    const content = analysisOuter?.choices?.[0]?.message?.content || "";

    let parsed: any = null;
    try {
      parsed = JSON.parse(content);
    } catch {
      try {
        const cleaned = String(content)
          .replace(/^```json/i, "")
          .replace(/^```/i, "")
          .replace(/```$/i, "")
          .trim();

        parsed = JSON.parse(cleaned);
      } catch {
        console.error("PARSE ANALYSIS CONTENT ERROR:", content);

        return NextResponse.json(
          {
            error: "Impossible de parser la réponse JSON de l’analyse.",
            details: content || "Réponse vide.",
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      transcript,
      summary: toText(parsed?.summary),
      hook: toText(parsed?.hook),
      structure: toText(parsed?.structure),
      angle: toText(parsed?.angle),
      psychology: toBulletString(parsed?.psychology),
      strengths: toBulletString(parsed?.strengths),
      weaknesses: toBulletString(parsed?.weaknesses),
      ideas: toBulletString(parsed?.ideas),
      similarHooks: toBulletString(parsed?.similarHooks),
      similarAngles: toBulletString(parsed?.similarAngles),
      recreationBrief: toText(parsed?.recreationBrief),
    });
  } catch (error: any) {
    console.error("ANALYZE_UPLOAD_FATAL:", error);

    return NextResponse.json(
      {
        error: "Erreur serveur pendant l’analyse du fichier.",
        details: error?.message || "Erreur inconnue.",
      },
      { status: 500 }
    );
  }
}
