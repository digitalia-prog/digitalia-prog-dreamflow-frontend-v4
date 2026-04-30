import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const VIDEO_WORKER_URL =
  process.env.VIDEO_WORKER_URL ||
  "https://ugc-growth-video-worker-production.up.railway.app";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ─── Détection plateforme ────────────────────────────────────────────────────

type Platform = "tiktok" | "youtube" | "instagram" | "other";

function detectPlatform(url: string): Platform {
  if (/tiktok\.com/i.test(url)) return "tiktok";
  if (/youtube\.com|youtu\.be/i.test(url)) return "youtube";
  if (/instagram\.com/i.test(url)) return "instagram";
  return "other";
}

// 🔥 ON BLOQUE SEULEMENT INSTAGRAM
const BLOCKED_PLATFORMS: Platform[] = ["instagram"];

function platformLabel(platform: Platform): string {
  if (platform === "youtube") return "YouTube";
  if (platform === "instagram") return "Instagram";
  return platform;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

// ─── Worker Railway ───────────────────────────────────────────────────────────

async function transcribeVideoUrl(url: string): Promise<string> {
  const response = await fetch(`${VIDEO_WORKER_URL}/transcribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const workerError: string =
      data?.detail || data?.error || "Erreur worker transcription vidéo.";

    const isAntiBotError =
      /sign in|bot|login required|authentication|cookies/i.test(workerError);

    if (isAntiBotError) {
      const err = new Error(workerError) as any;
      err.isAntiBot = true;
      throw err;
    }

    throw new Error(workerError);
  }

  return typeof data?.transcript === "string" ? data.transcript : "";
}

// ─── Analyse OpenAI ───────────────────────────────────────────────────────────

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
Analyse cette vidéo comme une agence marketing professionnelle.

Transcript :
${transcript}

Réponds en JSON avec :
hook, angle, strengths, weaknesses, recreateIdeas, adsAngles
`;

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_ANALYSIS_MODEL || "gpt-4.1-mini",
    temperature: 0.5,
    messages: [
      {
        role: "system",
        content: "Tu es un expert UGC marketing. JSON uniquement.",
      },
      { role: "user", content: prompt },
    ],
  });

  const content = completion.choices[0]?.message?.content || "";
  const cleaned = cleanJsonString(content);
  return JSON.parse(cleaned);
}

// ─── Handler principal ────────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url, platform, language, offer, audience, notes } = body ?? {};

    if (!url) {
      return NextResponse.json(
        { error: "Lien vidéo manquant." },
        { status: 400 }
      );
    }

    const detectedPlatform = detectPlatform(url);

    // ❌ BLOQUE INSTAGRAM DIRECT
    if (BLOCKED_PLATFORMS.includes(detectedPlatform)) {
      return NextResponse.json(
        {
          error:
            "Instagram bloque l’accès automatique. Utilise l’upload vidéo.",
          fallback: "upload",
          platform: detectedPlatform,
        },
        { status: 422 }
      );
    }

    let transcript: string;

    try {
      transcript = await transcribeVideoUrl(url);
    } catch (err: any) {
      // 🔥 FALLBACK YOUTUBE
      if (err?.isAntiBot) {
        return NextResponse.json(
          {
            error:
              "Cette vidéo est bloquée par la plateforme. Utilise l’upload vidéo.",
            fallback: "upload",
            platform: detectedPlatform,
          },
          { status: 422 }
        );
      }

      return NextResponse.json(
        { error: "Erreur worker vidéo", details: err.message },
        { status: 500 }
      );
    }

    if (!transcript.trim()) {
      return NextResponse.json(
        { error: "Transcript vide." },
        { status: 200 }
      );
    }

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
    return NextResponse.json(
      { error: "Erreur serveur", details: error.message },
      { status: 500 }
    );
  }
}
