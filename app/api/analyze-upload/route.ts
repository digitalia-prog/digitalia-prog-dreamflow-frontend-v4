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

function toBullets(value: unknown, fallback: string[] = ["-"]): string[] {
  if (Array.isArray(value)) {
    const cleaned = value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);
    return cleaned.length ? cleaned : fallback;
  }

  if (typeof value === "string" && value.trim()) {
    const cleaned = value
      .split("\n")
      .map((line) => line.replace(/^[-•]\s*/, "").trim())
      .filter(Boolean);

    return cleaned.length ? cleaned : fallback;
  }

  return fallback;
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
Tu es un expert senior en analyse de créatives UGC, publicités courtes, hooks, psychologie de conversion et structure de vidéos sociales.

Tu dois analyser le transcript réel d'une vidéo/audio et produire une analyse marketing exploitable.

Règles obligatoires :
- Retourne UNIQUEMENT un JSON valide.
- Remplis TOUS les champs.
- Chaque tableau doit contenir exactement 3 éléments.
- Sois concret, précis, orienté performance.
- N'écris aucune explication hors JSON.

Format JSON exact :
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
Analyse cette vidéo/audio uploadée.

Fichier : ${fileName}
Plateforme : ${platform}
Offre : ${offer}
Audience : ${audience}
Notes complémentaires : ${extraNotes}

Transcript réel :
"""
${transcript}
"""

Fais une vraie analyse marketing UGC / Ads / contenu court.
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
      psychology: toBullets(parsed?.psychology, [
        "Curiosité déclenchée par le message",
        "Connexion émotionnelle avec l’audience",
        "Attention captée par le ton et l’intention",
      ]),
      strengths: toBullets(parsed?.strengths, [
        "Message principal compréhensible",
        "Base exploitable pour une créa UGC",
        "Format compatible avec du contenu court",
      ]),
      weaknesses: toBullets(parsed?.weaknesses, [
        "Preuve ou démonstration insuffisante",
        "Promesse trop générale",
        "CTA pas assez explicite",
      ]),
      recreateIdeas: toBullets(parsed?.recreateIdeas, [
        "Ajouter une preuve visuelle plus tôt",
        "Raccourcir l’intro pour accrocher plus vite",
        "Terminer sur un CTA beaucoup plus direct",
      ]),
      similarHooks: toBullets(parsed?.similarHooks, [
        "Stop scrolling, regarde ça",
        "Tu dois voir ça avant de passer à côté",
        "Voilà pourquoi ce message capte l’attention",
      ]),
      similarAngles: toBullets(parsed?.similarAngles, [
        "Angle émotionnel centré sur la connexion",
        "Angle curiosité avec promesse implicite",
        "Angle démonstratif orienté engagement",
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
