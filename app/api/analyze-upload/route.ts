import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const VIDEO_WORKER_URL =
  process.env.VIDEO_WORKER_URL ||
  "https://ugc-growth-video-worker-production.up.railway.app";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function toText(value: FormDataEntryValue | null, fallback = "-") {
  if (typeof value === "string" && value.trim()) return value.trim();
  return fallback;
}

function cleanJsonString(value: string) {
  return value
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

async function checkBetaQuotaSafe(key: string, limit: number) {
  const hasRedisConfig =
    !!process.env.UPSTASH_REDIS_REST_URL &&
    !!process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!hasRedisConfig) return true;

  try {
    const { checkQuota } = await import("@/lib/security");
    return await checkQuota(key, limit);
  } catch {
    return true;
  }
}

async function transcribeUploadWithWorker(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${VIDEO_WORKER_URL}/upload-transcribe`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.detail || data?.error || "Erreur worker upload transcription"
    );
  }

  return typeof data?.transcript === "string" ? data.transcript : "";
}

async function analyzeTranscript({
  transcript,
  platform,
  product,
  audience,
  notes,
}: {
  transcript: string;
  platform: string;
  product: string;
  audience: string;
  notes: string;
}) {
  const prompt = `
Tu es un expert senior en UGC ads, creative strategy et performance marketing.

Analyse cette vidéo/fichier audio comme une agence marketing professionnelle.

Contexte :
- Plateforme : ${platform}
- Produit / Offre : ${product}
- Audience : ${audience}
- Notes : ${notes}

Transcript réel :
"""
${transcript}
"""

Réponds uniquement en JSON valide, sans markdown.
Ne laisse aucun champ vide.

Format :
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
  "scriptPrompt": "",
  "viralScore": "",
  "whyItWorks": ["", ""],
  "howToBeat": ["", ""],
  "adsAngles": ["", ""],
  "creativeType": ""
}
`;

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_ANALYSIS_MODEL || "gpt-4.1-mini",
    temperature: 0.5,
    messages: [
      {
        role: "system",
        content:
          "Tu es un expert marketing UGC. Tu réponds uniquement en JSON valide complet.",
      },
      { role: "user", content: prompt },
    ],
  });

  const raw = completion.choices[0]?.message?.content || "";

  let parsed: any = {};
  try {
    parsed = JSON.parse(cleanJsonString(raw));
  } catch {
    parsed = {};
  }

  return {
    transcript: parsed.transcript || transcript,
    summary: parsed.summary || "Résumé non détecté.",
    hook: parsed.hook || "Hook non détecté.",
    structure: parsed.structure || "Structure non détectée.",
    angle: parsed.angle || "Angle marketing non détecté.",
    psychology: Array.isArray(parsed.psychology)
      ? parsed.psychology
      : ["Curiosité", "Identification"],
    strengths: Array.isArray(parsed.strengths)
      ? parsed.strengths
      : ["Contenu engageant", "Sujet clair"],
    weaknesses: Array.isArray(parsed.weaknesses)
      ? parsed.weaknesses
      : ["Hook à renforcer", "CTA à clarifier"],
    recreateIdeas: Array.isArray(parsed.recreateIdeas)
      ? parsed.recreateIdeas
      : ["Recréer la vidéo avec une structure plus claire"],
    similarHooks: Array.isArray(parsed.similarHooks)
      ? parsed.similarHooks
      : ["Tu ne vas pas croire ce qui se passe ici"],
    similarAngles: Array.isArray(parsed.similarAngles)
      ? parsed.similarAngles
      : ["Angle curiosité", "Angle preuve sociale"],
    scriptPrompt:
      parsed.scriptPrompt ||
      "Créer une vidéo UGC courte avec hook fort, preuve, démonstration et CTA.",
    viralScore: parsed.viralScore || "6/10 — potentiel correct à optimiser.",
    whyItWorks: Array.isArray(parsed.whyItWorks)
      ? parsed.whyItWorks
      : ["Le format peut créer de la curiosité", "Le sujet est facile à comprendre"],
    howToBeat: Array.isArray(parsed.howToBeat)
      ? parsed.howToBeat
      : ["Ajouter un hook plus direct", "Renforcer le CTA final"],
    adsAngles: Array.isArray(parsed.adsAngles)
      ? parsed.adsAngles
      : ["Angle problème/solution", "Angle curiosité", "Angle preuve"],
    creativeType: parsed.creativeType || "UGC / contenu social",
  };
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY manquante" },
        { status: 500 }
      );
    }

    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const platform = toText(formData.get("platform"), "TikTok");
    const product =
      toText(formData.get("product"), "") ||
      toText(formData.get("offer"), "-");
    const audience = toText(formData.get("audience"), "-");
    const notes =
      toText(formData.get("notes"), "") ||
      toText(formData.get("extraNotes"), "-");
    const mode = toText(formData.get("mode"), "CREATOR");

    const requestMode = mode === "AGENCY" ? "AGENCY" : "CREATOR";
    const forwardedFor = req.headers.get("x-forwarded-for") || "";
    const ip = forwardedFor.split(",")[0]?.trim() || "unknown";
    const betaLimit = requestMode === "AGENCY" ? 10 : 5;

    const allowed = await checkBetaQuotaSafe(
      `beta:analyze-upload:${ip}:${requestMode}`,
      betaLimit
    );

    if (!allowed) {
      return NextResponse.json(
        { error: "Quota bêta dépassé pour l’analyse upload." },
        { status: 403 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier uploadé" },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "video/mp4",
      "video/webm",
      "video/mpeg",
      "video/quicktime",
      "video/x-m4v",
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/x-wav",
      "audio/mp4",
      "audio/m4a",
      "audio/x-m4a",
      "audio/webm",
      "audio/ogg",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Format non supporté",
          details:
            "Utilise MP4, MOV, WEBM, MP3, WAV ou M4A. La vidéo n’est pas stockée.",
          type: file.type,
        },
        { status: 400 }
      );
    }

    const transcript = await transcribeUploadWithWorker(file);

    if (!transcript.trim()) {
      return NextResponse.json(
        { error: "Transcript vide" },
        { status: 200 }
      );
    }

    const result = await analyzeTranscript({
      transcript,
      platform,
      product,
      audience,
      notes,
    });

    return NextResponse.json({
      success: true,
      noStorage: true,
      ...result,
    });
  } catch (err: any) {
    console.error("Erreur API analyze-upload:", err);

    return NextResponse.json(
      {
        error: "Erreur serveur analyse upload",
        details: err?.message || "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}
