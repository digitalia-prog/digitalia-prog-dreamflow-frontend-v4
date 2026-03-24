import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

function toText(value: unknown, fallback = "-"): string {
  if (typeof value === "string" && value.trim()) return value.trim();
  return fallback;
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
    // 🔑 Vérif API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY manquante" },
        { status: 500 }
      );
    }

    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const platform = toText(formData.get("platform"), "TikTok");
    const product = toText(formData.get("product"), "-");
    const audience = toText(formData.get("audience"), "-");
    const notes = toText(formData.get("notes"), "-");

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier upload" },
        { status: 400 }
      );
    }

    // ✅ AUDIO ONLY (pour éviter les erreurs)
    const allowedTypes = [
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/x-wav",
      "audio/mp4",
      "audio/x-m4a",
      "audio/m4a",
      "audio/webm",
      "audio/ogg",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Format non supporté",
          details:
            "Upload uniquement un fichier audio (.mp3, .wav, .m4a)",
          type: file.type,
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const audioFile = new File([buffer], file.name, {
      type: file.type,
    });

    // 🎧 TRANSCRIPTION
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "gpt-4o-transcribe",
    });

    const transcript = transcription.text;

    if (!transcript) {
      return NextResponse.json(
        { error: "Transcript vide" },
        { status: 500 }
      );
    }

    // 🧠 PROMPT ANALYSE
    const prompt = `
Tu es un expert en publicité UGC TikTok Ads.

Analyse cette vidéo :

Produit : ${product}
Audience : ${audience}
Plateforme : ${platform}
Notes : ${notes}

Transcript :
${transcript}

Réponds en JSON strict :

{
  "summary": "",
  "hook": "",
  "structure": "",
  "angle": "",
  "psychology": "",
  "strengths": ["", "", ""],
  "weaknesses": ["", "", ""],
  "ideasToReplicate": ["", "", ""],
  "similarHooks": ["", "", ""],
  "similarAngles": ["", "", ""],
  "recreationBrief": ""
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content:
            "Tu réponds uniquement en JSON valide. Pas de texte hors JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = completion.choices[0]?.message?.content || "";

    const parsed = safeJsonParse(content);

    if (!parsed) {
      return NextResponse.json(
        {
          error: "JSON invalide",
          raw: content,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      transcript,
      ...parsed,
    });
  } catch (err: any) {
    console.error("Erreur API:", err);

    return NextResponse.json(
      {
        error: "Erreur serveur analyse",
        details: err.message,
      },
      { status: 500 }
    );
  }
}
