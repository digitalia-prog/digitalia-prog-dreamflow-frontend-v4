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
    return value
      .split("\n")
      .map((line) => line.replace(/^[-•]\s*/, "").trim())
      .filter(Boolean);
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
    temperature: 0.4,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "ugc_audio_analysis",
        strict: true,
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            summary: { type: "string" },
            hook: { type: "string" },
            structure: { type: "string" },
            angle: { type: "string" },
            psychology: {
              type: "array",
              items: { type: "string" },
            },
            strengths: {
              type: "array",
              items: { type: "string" },
            },
            weaknesses: {
              type: "array",
              items: { type: "string" },
            },
            recreateIdeas: {
              type: "array",
              items: { type: "string" },
            },
            similarHooks: {
              type: "array",
              items: { type: "string" },
            },
            similarAngles: {
              type: "array",
              items: { type: "string" },
            },
            scriptPrompt: { type: "string" },
          },
          required: [
            "summary",
            "hook",
            "structure",
            "angle",
            "psychology",
            "strengths",
            "weaknesses",
            "recreateIdeas",
            "similarHooks",
            "similarAngles",
            "scriptPrompt",
          ],
        },
      },
    } as any,
    messages: [
      {
        role: "system",
        content: `
Tu es un expert senior en analyse publicitaire UGC, ads créatives, hooks, structures vidéo courtes et psychologie de conversion.

Tu reçois un transcript audio/vidéo.
Tu dois faire une VRAIE analyse marketing du contenu.

Règles :
- Réponds uniquement avec le JSON demandé.
- N'invente pas des détails non présents.
- Si un point est faible ou absent, dis-le clairement.
- Sois concret, actionnable et orienté performance.
- Les tableaux doivent toujours contenir au moins 3 éléments utiles si possible.
        `.trim(),
      },
      {
        role: "user",
        content: `
Fichier : ${fileName}
Plateforme : ${platform || "-"}
Offre : ${offer || "-"}
Audience : ${audience || "-"}
Notes : ${extraNotes || "-"}

Transcript :
"""
${transcript}
"""

Analyse ce transcript comme une créa UGC / ads et retourne :
- un résumé
- le hook principal
- la structure
- l'angle
- la psychologie utilisée
- les points forts
- les points faibles
- les idées à reproduire
- des hooks similaires
- des angles similaires
- un brief/scriptPrompt pour recréer une vidéo similaire mais meilleure
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
        "Curiosité",
        "Attention",
        "Promesse implicite",
      ]),
      strengths: toBullets(parsed?.strengths, [
        "Message clair",
        "Base exploitable",
        "Format compatible UGC",
      ]),
      weaknesses: toBullets(parsed?.weaknesses, [
        "Preuves à renforcer",
        "Hook à optimiser",
        "CTA à clarifier",
      ]),
      recreateIdeas: toBullets(parsed?.recreateIdeas, [
        "Raccourcir l’intro",
        "Ajouter une preuve",
        "Renforcer le CTA",
      ]),
      similarHooks: toBullets(parsed?.similarHooks, [
        "Stop scrolling",
        "Tu fais peut-être cette erreur",
        "Regarde ça avant d’acheter",
      ]),
      similarAngles: toBullets(parsed?.similarAngles, [
        "Problème / solution",
        "Avant / après",
        "Démo produit",
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
