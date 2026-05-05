import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const VIDEO_WORKER_URL =
  process.env.VIDEO_WORKER_URL ||
  "https://ugc-growth-video-worker-production.up.railway.app";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type Platform = "tiktok" | "youtube" | "instagram" | "facebook" | "other";

function detectPlatform(url: string): Platform {
  if (/tiktok\.com/i.test(url)) return "tiktok";
  if (/youtube\.com|youtu\.be/i.test(url)) return "youtube";
  if (/instagram\.com/i.test(url)) return "instagram";
  if (/facebook\.com/i.test(url)) return "facebook";
  return "other";
}

function extractYoutubeVideoId(url: string) {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.replace("/", "").split("?")[0];
    }

    if (parsed.searchParams.get("v")) {
      return parsed.searchParams.get("v");
    }

    const shortsMatch = parsed.pathname.match(/\/shorts\/([^/?]+)/);
    if (shortsMatch?.[1]) return shortsMatch[1];

    const embedMatch = parsed.pathname.match(/\/embed\/([^/?]+)/);
    if (embedMatch?.[1]) return embedMatch[1];

    return null;
  } catch {
    return null;
  }
}

function cleanJsonString(value: string) {
  return value
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

async function transcribeVideoUrl(url: string): Promise<string> {
  const res = await fetch(`${VIDEO_WORKER_URL}/transcribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const error = data?.detail || data?.error || "Erreur transcription worker";
    const isAntiBot = /sign in|bot|login required|cookies/i.test(error);

    if (isAntiBot) {
      const err: any = new Error(error);
      err.isAntiBot = true;
      throw err;
    }

    throw new Error(error);
  }

  return data?.transcript || "";
}

async function transcribeYoutubeWithSupadata(url: string): Promise<string> {
  if (!process.env.SUPADATA_API_KEY) {
    throw new Error("SUPADATA_API_KEY manquante");
  }

  const videoId = extractYoutubeVideoId(url);

  if (!videoId) {
    throw new Error("Lien YouTube invalide");
  }

  const res = await fetch(
    `https://api.supadata.ai/v1/youtube/transcript?videoId=${encodeURIComponent(
      videoId
    )}&text=true`,
    {
      method: "GET",
      headers: {
        "x-api-key": process.env.SUPADATA_API_KEY,
      },
    }
  );

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      data?.error ||
        data?.message ||
        data?.detail ||
        "Erreur Supadata transcript"
    );
  }

  if (typeof data?.content === "string") return data.content;
  if (typeof data?.text === "string") return data.text;
  if (typeof data?.transcript === "string") return data.transcript;

  if (Array.isArray(data?.content)) {
    return data.content
      .map((item: any) => item?.text || item?.content || "")
      .filter(Boolean)
      .join(" ");
  }

  if (Array.isArray(data?.transcript)) {
    return data.transcript
      .map((item: any) => item?.text || item?.content || "")
      .filter(Boolean)
      .join(" ");
  }

  return "";
}

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

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "Lien manquant" }, { status: 400 });
    }

    const platform = detectPlatform(url);

    if (platform === "instagram" || platform === "facebook") {
      return NextResponse.json(
        {
          error: "Instagram non supporté via lien. Upload la vidéo.",
          fallback: "upload",
        },
        { status: 422 }
      );
    }

    let transcript = "";

    try {
      transcript =
        platform === "youtube"
          ? await transcribeYoutubeWithSupadata(url)
          : await transcribeVideoUrl(url);
    } catch (err: any) {
      if (err.isAntiBot) {
        return NextResponse.json(
          {
            error: "Vidéo bloquée par la plateforme. Utilise l'upload.",
            fallback: "upload",
          },
          { status: 422 }
        );
      }

      return NextResponse.json(
        {
          error: err.message || "Erreur analyse vidéo",
          fallback: platform === "youtube" ? "youtube_error" : "upload",
        },
        { status: 500 }
      );
    }

    if (!transcript) {
      return NextResponse.json(
        {
          error: "Transcript vide. Upload la vidéo.",
          fallback: platform === "youtube" ? "youtube_error" : "upload",
        },
        { status: 422 }
      );
    }

    const analysis = await analyzeTranscript(transcript);

    return NextResponse.json({
      platform,
      transcript,
      ...analysis,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
