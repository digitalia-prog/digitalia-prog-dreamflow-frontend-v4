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
    messages: [
      {
        role: "system",
        content: `
Tu es un expert senior en analyse de créatives UGC, publicités courtes, hooks, psychologie de conversion et structure de vidéos sociales.

Ta mission :
1. analyser le transcript réel
2. produire une réponse ULTRA CONCRÈTE
3. remplir TOUS les champs
4. ne laisser AUCUN tableau vide
5. éviter les phrases vagues

Règles obligatoires :
- Retourne UNIQUEMENT un JSON valide.
- Aucune explication hors JSON.
- Chaque tableau doit contenir exactement 3 éléments.
- Si une information n'est pas très présente dans le transcript, déduis l'analyse marketing la plus crédible à partir du ton, du message et de la structure.
- "hook" = la promesse ou l’accroche principale.
- "structure" = déroulé du message.
- "angle" = angle marketing principal.
- "psychology" = leviers mentaux / émotionnels.
- "strengths" = vrais points forts de la créa.
- "weaknesses" = vraies faiblesses ou limites.
- "recreateIdeas" = idées concrètes à refaire dans une prochaine vidéo.
- "similarHooks" = 3 hooks alternatifs proches.
- "similarAngles" = 3 angles marketing proches.
- "scriptPrompt" = brief clair pour recréer une meilleure vidéo du même style.

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

Donne une vraie analyse marketing exploitable pour UGC / Ads / contenu court.
        `.trim(),
      },
    ],
    response_format: { type: "json_object" },
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
        "Curiosité déclenchée par le ton ou l’accroche",
        "Connexion émotionnelle avec le spectateur",
        "Stimulation de l’attention par un message direct",
      ]),
      strengths: toBullets(parsed?.strengths, [
        "Message principal facile à comprendre",
        "Base exploitable pour une créa UGC",
        "Format adapté à du contenu court",
      ]),
      weaknesses: toBullets(parsed?.weaknesses, [
        "Manque de preuve ou démonstration concrète",
        "Promesse encore trop générale",
        "CTA pas assez fort ou explicite",
      ]),
      recreateIdeas: toBullets(parsed?.recreateIdeas, [
        "Ajouter une preuve visuelle dès les premières secondes",
        "Raccourcir l’introduction pour capter plus vite",
        "Finir sur un CTA beaucoup plus clair",
      ]),
      similarHooks: toBullets(parsed?.similarHooks, [
        "Stop scrolling, regarde ça",
        "Voilà pourquoi ce message capte l’attention",
        "Tu dois voir ça avant de passer à côté",
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
