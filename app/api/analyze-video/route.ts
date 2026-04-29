import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const VIDEO_WORKER_URL =
  process.env.VIDEO_WORKER_URL ||
  "https://ugc-growth-video-worker-production.up.railway.app";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

  if (!hasRedisConfig) {
    console.warn("Quota bêta ignoré : Upstash Redis non configuré.");
    return true;
  }

  try {
    const { checkQuota } = await import("@/lib/security");
    return await checkQuota(key, limit);
  } catch (error) {
    console.warn("Quota bêta ignoré : erreur sécurité/quota.", error);
    return true;
  }
}

async function transcribeVideoUrl(url: string) {
  const response = await fetch(`${VIDEO_WORKER_URL}/transcribe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.detail || data?.error || "Erreur worker transcription vidéo."
    );
  }

  return typeof data?.transcript === "string" ? data.transcript : "";
}

async function analyzeTranscript({
  url,
  platform,
  language,
  offer,
  audience,
  notes,
  transcript,
}: {
  url: string;
  platform?: string;
  language?: string;
  offer?: string;
  audience?: string;
  notes?: string;
  transcript: string;
}) {
  const prompt = `
Tu es un expert senior en creative strategy, UGC ads et performance marketing.

Analyse cette vidéo comme une agence marketing professionnelle.

Contexte :
- URL : ${url || ""}
- Plateforme : ${platform || ""}
- Langue : ${language || ""}
- Produit / Offre : ${offer || ""}
- Audience : ${audience || ""}
- Notes : ${notes || ""}

Transcript réel :
"""
${transcript}
"""

Consignes :
- Base-toi d'abord sur le transcript réel.
- Réponds en français.
- Sois concret.
- Ne laisse aucun champ vide.
- Retourne uniquement un JSON valide, sans markdown.

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
          "Tu es un expert en analyse marketing UGC. Tu réponds uniquement en JSON valide.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const content = completion.choices[0]?.message?.content || "";
  const cleaned = cleanJsonString(content);
  const parsed = JSON.parse(cleaned);

  return {
    transcript:
      typeof parsed?.transcript === "string" ? parsed.transcript : transcript,
    summary: typeof parsed?.summary === "string" ? parsed.summary : "",
    hook: typeof parsed?.hook === "string" ? parsed.hook : "",
    structure: typeof parsed?.structure === "string" ? parsed.structure : "",
    angle: typeof parsed?.angle === "string" ? parsed.angle : "",
    psychology: Array.isArray(parsed?.psychology) ? parsed.psychology : [],
    strengths: Array.isArray(parsed?.strengths) ? parsed.strengths : [],
    weaknesses: Array.isArray(parsed?.weaknesses) ? parsed.weaknesses : [],
    recreateIdeas: Array.isArray(parsed?.recreateIdeas)
      ? parsed.recreateIdeas
      : [],
    similarHooks: Array.isArray(parsed?.similarHooks)
      ? parsed.similarHooks
      : [],
    similarAngles: Array.isArray(parsed?.similarAngles)
      ? parsed.similarAngles
      : [],
    scriptPrompt:
      typeof parsed?.scriptPrompt === "string" ? parsed.scriptPrompt : "",
    viralScore: typeof parsed?.viralScore === "string" ? parsed.viralScore : "",
    whyItWorks: Array.isArray(parsed?.whyItWorks) ? parsed.whyItWorks : [],
    howToBeat: Array.isArray(parsed?.howToBeat) ? parsed.howToBeat : [],
    adsAngles: Array.isArray(parsed?.adsAngles) ? parsed.adsAngles : [],
    creativeType:
      typeof parsed?.creativeType === "string" ? parsed.creativeType : "",
  };
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY manquante" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { url, platform, language, offer, audience, notes, mode } = body ?? {};

    const requestMode = mode === "AGENCY" ? "AGENCY" : "CREATOR";
    const forwardedFor = req.headers.get("x-forwarded-for") || "";
    const ip = forwardedFor.split(",")[0]?.trim() || "unknown";
    const betaLimit = requestMode === "AGENCY" ? 10 : 5;

    const allowed = await checkBetaQuotaSafe(
      `beta:analyze-video:${ip}:${requestMode}`,
      betaLimit
    );

    if (!allowed) {
      return NextResponse.json(
        { error: "Quota bêta dépassé pour l’analyse vidéo." },
        { status: 403 }
      );
    }

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Lien vidéo manquant." },
        { status: 400 }
      );
    }

    console.log("Transcribe video URL with Railway worker...");
    const transcript = await transcribeVideoUrl(url);

    if (!transcript.trim()) {
      return NextResponse.json(
        { error: "Transcript vide." },
        { status: 200 }
      );
    }

    console.log("Analyze transcript...");
    const result = await analyzeTranscript({
      url,
      platform,
      language,
      offer,
      audience,
      notes,
      transcript,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("ANALYZE VIDEO ERROR:", error);

    return NextResponse.json(
      {
        error: "Erreur serveur",
        details: error?.message || "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}
