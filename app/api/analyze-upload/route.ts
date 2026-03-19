import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function toText(value: unknown, fallback = "-"): string {
  if (typeof value === "string" && value.trim()) return value.trim();
  return fallback;
}

function ensureThree(value: unknown, fallback: string[]): string[] {
  let arr: string[] = [];

  if (Array.isArray(value)) {
    arr = value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);
  } else if (typeof value === "string" && value.trim()) {
    arr = value
      .split("\n")
      .map((line) => line.replace(/^[-•]\s*/, "").trim())
      .filter(Boolean);
  }

  if (arr.length >= 3) return arr.slice(0, 3);

  const merged = [...arr];
  for (const item of fallback) {
    if (merged.length >= 3) break;
    merged.push(item);
  }

  return merged.slice(0, 3);
}

async function transcribeAudio(file: File) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const audioFile = new File([buffer], file.name || "upload.mp4", {
    type: file.type || "application/octet-stream",
  });

  const transcript = await openai.audio.transcriptions.create({
    file: audioFile,
    model: "gpt-4o-mini-transcribe",
    language: "fr",
  });

  return transcript.text || "";
}

async function analyzeTranscript({
  transcript,
  platform,
  offer,
  audience,
  extraNotes,
  fileName,
}: {
  transcript: string;
  platform: string;
  offer: string;
  audience: string;
  extraNotes: string;
  fileName: string;
}) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `
Tu es un expert senior en analyse de vidéos UGC / Ads.

Tu dois analyser un transcript réel et répondre UNIQUEMENT en JSON.

IMPORTANT :
- Tu dois toujours remplir tous les champs.
- Tous les tableaux doivent contenir exactement 3 éléments.
- Sois concret, précis, actionnable.
- N'écris rien hors JSON.

Format exact :
{
  "summary": "string",
  "hook": "string",
  "structure": "string",
  "angle": "string",
  "psychology": ["string", "string", "string"],
  "strengths": ["string", "string", "string"],
  "weaknesses": ["string", "string", "string"],
  "recreateIdeas": ["string", "string", "string"],
  "similarHooks": ["string", "string", "string"],
  "similarAngles": ["string", "string", "string"],
  "scriptPrompt": "string"
}
        `.trim(),
      },
      {
        role: "user",
        content: `
Fichier : ${fileName}
Plateforme : ${platform}
Offre : ${offer}
Audience : ${audience}
Notes : ${extraNotes}

Transcript :
"""
${transcript}
"""
        `.trim(),
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content || "{}";
  return JSON.parse(raw);
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: "OPENAI_API_KEY manquante",
          details: "Ajoute ta clé OpenAI dans les variables d’environnement.",
        },
        { status: 500 }
      );
    }

    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const platform = toText(formData.get("platform"), "TikTok");
    const offer = toText(formData.get("offer"), "-");
    const audience = toText(formData.get("audience"), "-");
    const extraNotes = toText(formData.get("extraNotes"), "-");

    if (!file) {
      return NextResponse.json(
        { error: "Ajoute une vidéo ou un fichier audio." },
        { status: 400 }
      );
    }

    const transcriptText = await transcribeAudio(file);

    if (!transcriptText.trim()) {
      return NextResponse.json(
        {
          error: "Transcription vide",
          details: "Le fichier a été reçu mais aucun texte exploitable n’a été extrait.",
        },
        { status: 400 }
      );
    }

    const parsed = await analyzeTranscript({
      transcript: transcriptText,
      platform,
      offer,
      audience,
      extraNotes,
      fileName: file.name || "upload",
    });

    return NextResponse.json({
      transcript: transcriptText,
      summary: toText(parsed?.summary),
      hook: toText(parsed?.hook),
      structure: toText(parsed?.structure),
      angle: toText(parsed?.angle),
      psychology: ensureThree(parsed?.psychology, [
        "Curiosité déclenchée par le message d’ouverture",
        "Connexion émotionnelle avec l’audience",
        "Atmosphère positive qui favorise l’attention",
      ]),
      strengths: ensureThree(parsed?.strengths, [
        "Ambiance claire et positive",
        "Message simple à comprendre",
        "Format exploitable pour une créa courte",
      ]),
      weaknesses: ensureThree(parsed?.weaknesses, [
        "Pas de produit clairement mis en avant",
        "CTA peu explicite",
        "Preuve ou bénéfice concret insuffisant",
      ]),
      recreateIdeas: ensureThree(parsed?.recreateIdeas, [
        "Ajouter une preuve visuelle dès les 3 premières secondes",
        "Rendre le message plus orienté bénéfice utilisateur",
        "Finir avec un CTA beaucoup plus clair",
      ]),
      similarHooks: ensureThree(parsed?.similarHooks, [
        "Stop scrolling, regarde ça",
        "Tu dois voir ça avant de passer à côté",
        "Voici pourquoi cette vidéo capte l’attention",
      ]),
      similarAngles: ensureThree(parsed?.similarAngles, [
        "Angle émotionnel centré sur l’inclusion",
        "Angle curiosité avec ambiance positive",
        "Angle engagement communautaire",
      ]),
      scriptPrompt: toText(parsed?.scriptPrompt),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Erreur serveur",
        details: String(error?.message || error),
      },
      { status: 500 }
    );
  }
}
=
