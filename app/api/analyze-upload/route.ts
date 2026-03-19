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

  const originalName = file.name || "upload";
  const ext = originalName.includes(".")
    ? originalName.split(".").pop()?.toLowerCase()
    : "";

  let safeName = originalName;

  if (!ext) {
    if (file.type.includes("mpeg")) safeName = "upload.mp3";
    else if (file.type.includes("mp4")) safeName = "upload.mp4";
    else if (file.type.includes("wav")) safeName = "upload.wav";
    else if (file.type.includes("webm")) safeName = "upload.webm";
    else if (file.type.includes("m4a")) safeName = "upload.m4a";
    else safeName = "upload.mp3";
  }

  const audioFile = new File([buffer], safeName, {
    type: file.type || "application/octet-stream",
  });

  try {
    const transcript = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: "fr",
    });

    return transcript.text || "";
  } catch (error: any) {
    throw new Error(
      "Le fichier audio/vidéo n’a pas pu être décodé. Essaie un fichier .mp3, .wav ou .m4a, ou réexporte ta vidéo en MP4 avec une piste audio AAC."
    );
  }
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
Tu es un expert senior en analyse de créatives UGC / Ads.

Tu analyses un transcript réel de vidéo/audio et tu retournes UNIQUEMENT un JSON valide.

Règles :
- Tous les champs doivent être remplis.
- Toutes les listes doivent contenir exactement 3 éléments.
- Sois concret, précis, actionnable, orienté performance.
- N'invente pas de produit si le transcript n'en mentionne pas.
- Si le contenu est vague, fais une analyse marketing crédible basée sur le ton, la structure, l’émotion et l’intention.

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
          details:
            "Le fichier a été reçu mais aucun texte exploitable n’a été extrait.",
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
        "Curiosité déclenchée par l’ouverture",
        "Connexion émotionnelle avec l’audience",
        "Attention maintenue par l’ambiance ou le ton",
      ]),
      strengths: ensureThree(parsed?.strengths, [
        "Message global facile à comprendre",
        "Base exploitable pour un contenu UGC",
        "Format compatible avec une créa courte",
      ]),
      weaknesses: ensureThree(parsed?.weaknesses, [
        "Produit ou offre pas assez explicite",
        "Preuve ou bénéfice concret insuffisant",
        "CTA pas assez direct",
      ]),
      recreateIdeas: ensureThree(parsed?.recreateIdeas, [
        "Ajouter une preuve visuelle dans les 3 premières secondes",
        "Clarifier le bénéfice utilisateur plus tôt",
        "Finir avec un CTA plus fort et explicite",
      ]),
      similarHooks: ensureThree(parsed?.similarHooks, [
        "Stop scrolling, regarde ça",
        "Tu dois voir ça avant de passer à côté",
        "Voici pourquoi cette vidéo attire l’attention",
      ]),
      similarAngles: ensureThree(parsed?.similarAngles, [
        "Angle émotionnel centré sur l’inclusion",
        "Angle curiosité avec promesse implicite",
        "Angle engagement avec ambiance positive",
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
