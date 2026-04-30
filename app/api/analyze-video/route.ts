import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const VIDEO_WORKER_URL =
  process.env.VIDEO_WORKER_URL ||
  "https://ugc-growth-video-worker-production.up.railway.app";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ───────────── Detect platform ─────────────
type Platform = "tiktok" | "youtube" | "instagram" | "facebook" | "other";

function detectPlatform(url: string): Platform {
  if (/tiktok\.com/i.test(url)) return "tiktok";
  if (/youtube\.com|youtu\.be/i.test(url)) return "youtube";
  if (/instagram\.com/i.test(url)) return "instagram";
  if (/facebook\.com/i.test(url)) return "facebook";
  return "other";
}

// ❌ Block only Instagram & Facebook
const BLOCKED_PLATFORMS: Platform[] = ["instagram", "facebook"];

// ───────────── Clean JSON ─────────────
function cleanJsonString(value: string) {
  return value
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

// ───────────── Worker call ─────────────
async function transcribeVideoUrl(url: string): Promise<string> {
  const res = await fetch(`${VIDEO_WORKER_URL}/transcribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const error =
      data?.detail || data?.error || "Erreur transcription worker";

    const isAntiBot =
      /sign in|bot|login required|cookies/i.test(error);

    if (isAntiBot) {
      const err: any = new Error(error);
      err.isAntiBot = true;
      throw err;
    }

    throw new Error(error);
  }

  return data?.transcript || "";
}

// ───────────── OpenAI analysis ─────────────
async function analyzeTranscript(transcript: string) {
  const prompt = `
Analyse cette vidéo marketing UGC.

Transcript :
${transcript}

IMPORTANT :
- Remplis TOUS les champs
- Aucun champ vide
- JSON uniquement

{
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
    model: "gpt-4.1-mini",
    temperature: 0.7,
    messages: [
      { role: "system", content: "Expert UGC marketing. JSON complet." },
      { role: "user", content: prompt },
    ],
  });

  const raw = completion.choices[0]?.message?.content || "";

  let parsed: any;

  try {
    parsed = JSON.parse(cleanJsonString(raw));
  } catch {
    parsed = {};
  }

  // 🔥 fallback auto (plus jamais vide)
  return {
    summary: parsed.summary || "Résumé indisponible",
    hook: parsed.hook || "Hook non détecté",
    structure: parsed.structure || "Structure non détectée",
    angle: parsed.angle || "Angle non détecté",
    psychology: parsed.psychology?.length ? parsed.psychology : ["Curiosité"],
    strengths: parsed.strengths?.length ? parsed.strengths : ["Engagement"],
    weaknesses: parsed.weaknesses?.length ? parsed.weaknesses : ["Manque clarté"],
    recreateIdeas: parsed.recreateIdeas?.length ? parsed.recreateIdeas : ["Améliorer structure"],
    similarHooks: parsed.similarHooks?.length ? parsed.similarHooks : ["Hook alternatif"],
    similarAngles: parsed.similarAngles?.length ? parsed.similarAngles : ["Angle alternatif"],
    scriptPrompt: parsed.scriptPrompt || "Script optimisé",
    viralScore: parsed.viralScore || "6/10",
    whyItWorks: parsed.whyItWorks?.length ? parsed.whyItWorks : ["Contenu relatable"],
    howToBeat: parsed.howToBeat?.length ? parsed.howToBeat : ["Meilleur hook"],
    adsAngles: parsed.adsAngles?.length ? parsed.adsAngles : ["Direct response"],
    creativeType: parsed.creativeType || "UGC",
  };
}

// ───────────── MAIN ─────────────
export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json(
        { error: "Lien manquant" },
        { status: 400 }
      );
    }

    const platform = detectPlatform(url);

    // ❌ block IG & FB
    if (BLOCKED_PLATFORMS.includes(platform)) {
      return NextResponse.json(
        {
          error:
            "Cette plateforme limite l'accès. Utilise l'upload vidéo.",
          fallback: "upload",
        },
        { status: 422 }
      );
    }

    let transcript = "";

    try {
      transcript = await transcribeVideoUrl(url);
    } catch (err: any) {
      if (err.isAntiBot) {
        return NextResponse.json(
          {
            error:
              "Vidéo bloquée par la plateforme. Utilise l'upload.",
            fallback: "upload",
          },
          { status: 422 }
        );
      }

      return NextResponse.json(
        { error: err.message },
        { status: 500 }
      );
    }

    if (!transcript) {
      return NextResponse.json(
        { error: "Transcript vide" },
        { status: 200 }
      );
    }

    const analysis = await analyzeTranscript(transcript);

    return NextResponse.json({
      transcript,
      ...analysis,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
