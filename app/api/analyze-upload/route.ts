import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

function toText(value: FormDataEntryValue | null, fallback = "-") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: "OPENAI_API_KEY manquante",
          details:
            "Ajoute OPENAI_API_KEY dans .env.local et dans les variables d’environnement Vercel.",
        },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const platform = toText(formData.get("platform"), "TikTok");
    const product = toText(formData.get("product"), "-");
    const audience = toText(formData.get("audience"), "-");
    const notes = toText(formData.get("notes"), "-");

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier upload." },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "video/mp4",
      "video/quicktime",
      "video/webm",
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/x-wav",
      "audio/mp4",
      "audio/x-m4a",
      "audio/m4a",
      "video/mpeg",
    ];

    if (file.type && !allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Format non supporté.",
          details: `Type reçu: ${file.type}`,
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!buffer.length) {
      return NextResponse.json(
        { error: "Le fichier est vide." },
        { status: 400 }
      );
    }

    const uploadFile = new File([buffer], file.name, {
      type: file.type || "application/octet-stream",
    });

    const transcription = await openai.audio.transcriptions.create({
      file: uploadFile,
      model: "gpt-4o-transcribe",
    });

    const transcript = transcription.text?.trim();

    if (!transcript) {
      return NextResponse.json(
        {
          error: "Transcript vide.",
          details: "La transcription n’a retourné aucun texte.",
        },
        { status: 500 }
      );
    }

    const prompt = `
Tu analyses une publicité ${platform}.

Contexte :
- Produit / Offre : ${product}
- Audience : ${audience}
- Notes : ${notes}

Transcript :
${transcript}

Réponds UNIQUEMENT en JSON valide avec cette structure exacte :
{
  "summary": "string",
  "hook": "string",
  "structure": "string",
  "angle": "string",
  "psychology": "string",
  "strengths": ["string", "string", "string"],
  "weaknesses": ["string", "string", "string"],
  "ideasToReplicate": ["string", "string", "string"],
  "similarHooks": ["string", "string", "string"],
  "similarAngles": ["string", "string", "string"],
  "recreationBrief": "string"
}
`;

    const analysisResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content:
            "Tu es un expert en analyse de publicités UGC/TikTok Ads. Tu réponds toujours en JSON valide strict.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = analysisResponse.choices?.[0]?.message?.content?.trim();

    if (!content) {
      return NextResponse.json(
        {
          error: "Réponse IA vide.",
          details: "Le modèle n’a renvoyé aucun contenu.",
        },
        { status: 500 }
      );
    }

    const parsed = safeJsonParse(content);

    if (!parsed) {
      return NextResponse.json(
        {
          error: "JSON IA invalide.",
          details: content,
          transcript,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      transcript,
      summary: parsed.summary ?? "-",
      hook: parsed.hook ?? "-",
      structure: parsed.structure ?? "-",
      angle: parsed.angle ?? "-",
      psychology: parsed.psychology ?? "-",
      strengths: parsed.strengths ?? [],
      weaknesses: parsed.weaknesses ?? [],
      ideasToReplicate: parsed.ideasToReplicate ?? [],
      similarHooks: parsed.similarHooks ?? [],
      similarAngles: parsed.similarAngles ?? [],
      recreationBrief: parsed.recreationBrief ?? "-",
    });
  } catch (error: any) {
    console.error("Erreur analyze-upload:", error);

    return NextResponse.json(
      {
        error: "Erreur serveur analyse",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
