import { NextResponse } from "next/server";
import OpenAI from "openai";
import { PSYCHOLOGY_ANALYSIS_CORE } from "@/lib/psychologyCore";

export const runtime = "nodejs";
export const maxDuration = 120;

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

function normalizeOutputLanguage(value: string) {
  const lang = value.toLowerCase().trim();

  if (["en", "english", "anglais", "anglais us", "english us", "us english"].includes(lang)) return "English";
  if (["fr", "french", "français", "francais", "français fr", "french fr"].includes(lang)) return "French";
  if (["es", "spanish", "espagnol", "español"].includes(lang)) return "Spanish";
  if (["ar", "arabic", "arabe", "العربية"].includes(lang)) return "Arabic";
  if (["zh", "chinese", "中文", "chinois", "mandarin"].includes(lang)) return "Chinese";
  if (["de", "german", "allemand"].includes(lang)) return "German";
  if (["it", "italian", "italien"].includes(lang)) return "Italian";
  if (["pt", "portuguese", "portugais"].includes(lang)) return "Portuguese";

  return value || "French";
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

function asStringArray(value: any): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeAnalysis(parsed: any) {
  return {
    summary: parsed?.summary || "Analyse non disponible avec les éléments reçus.",
    hook: parsed?.hook || "Hook non déterminable avec les éléments reçus.",
    structure: parsed?.structure || "Structure non déterminable avec les éléments reçus.",
    angle: parsed?.angle || "Angle non déterminable avec les éléments reçus.",
    psychology: asStringArray(parsed?.psychology),
    strengths: asStringArray(parsed?.strengths),
    weaknesses: asStringArray(parsed?.weaknesses),
    recreateIdeas: asStringArray(parsed?.recreateIdeas),
    similarHooks: asStringArray(parsed?.similarHooks),
    similarAngles: asStringArray(parsed?.similarAngles),
    scriptPrompt: parsed?.scriptPrompt || "",
    // Conservé pour compatibilité avec les anciennes analyses, mais jamais inventé.
    viralScore: typeof parsed?.viralScore === "string" ? parsed.viralScore.trim() : "",
    whyItWorks: asStringArray(parsed?.whyItWorks),
    howToBeat: asStringArray(parsed?.howToBeat),
    adsAngles: asStringArray(parsed?.adsAngles),
    creativeType: parsed?.creativeType || "Créatif non déterminé",
  };
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
    `https://api.supadata.ai/v1/transcript?url=${encodeURIComponent(url)}&mode=generate&text=true`,
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

type AnalysisContext = {
  sourcePlatform?: string;
  advertiserName?: string;
  adText?: string;
  callToAction?: string;
  landingPage?: string;
  libraryId?: string;
  creativeType?: string;
};

type VisualAnalysisPayload = {
  visualAnalysisAvailable: boolean;
  visualAnalysisNote?: string;
  durationSeconds?: number;
  frameCount?: number;
  visualTimeline?: Array<{
    frameIndex: number;
    timestampSeconds: number;
    timecode: string;
    label: string;
    observation: string;
    assessment: "strong" | "medium" | "weak" | "neutral";
    attentionRisk: "low" | "medium" | "high" | "unknown";
    evidence: "observed" | "estimated";
  }>;
  visualHook?: {
    observation?: string;
    assessment?: string;
    evidence?: string;
  };
  pacing?: {
    observation?: string;
    assessment?: string;
    evidence?: string;
  };
  proofAnalysis?: {
    status?: "observed" | "not_observed" | "unknown";
    observation?: string;
    evidenceSource?: "visual" | "audio" | "imported" | "none";
  };
  ctaAnalysis?: {
    status?: "explicit" | "implicit" | "absent" | "unknown";
    text?: string;
    frameIndex?: number | null;
    timestampSeconds?: number | null;
    timecode?: string;
    evidenceSource?: "visual" | "audio" | "imported" | "none";
    explanation?: string;
  };
  onScreenText?: string[];
  priorityFixes?: Array<{
    priority: number;
    diagnosis: string;
    evidence: string;
    action: string;
    test: string;
  }>;
  dataIntegrity?: {
    observed?: string[];
    estimated?: string[];
    imported?: string[];
    unavailableMetrics?: string[];
  };
};

async function analyzeVideoVisuallySafe(
  url: string,
  transcript: string,
  language: string,
  context: AnalysisContext
): Promise<VisualAnalysisPayload> {
  try {
    const response = await fetch(`${VIDEO_WORKER_URL}/visual-analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, transcript, language, context }),
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.visualAnalysisAvailable) {
      return {
        visualAnalysisAvailable: false,
        visualAnalysisNote:
          data?.detail ||
          data?.visualAnalysisNote ||
          "Analyse visuelle indisponible pour cette source. L’analyse textuelle reste disponible.",
      };
    }

    return data as VisualAnalysisPayload;
  } catch (error: any) {
    return {
      visualAnalysisAvailable: false,
      visualAnalysisNote:
        error?.message ||
        "Analyse visuelle indisponible pour cette source. L’analyse textuelle reste disponible.",
    };
  }
}

async function analyzeTranscript(
  transcript: string,
  language: string,
  context: AnalysisContext = {}
) {
  const outputLanguage = normalizeOutputLanguage(language);

  const prompt = `
Analyse cette vidéo marketing UGC.

RÈGLE LANGUE OBLIGATOIRE :
- La vidéo peut être dans n'importe quelle langue.
- Tu dois retourner toute l'analyse finale en ${outputLanguage}.
- Si le transcript est dans une autre langue, traduis le sens avant d'écrire l'analyse.
- IMPORTANT : ne traduis, ne réécris et ne corriges jamais le transcript source. La langue choisie concerne uniquement l’analyse, pas la transcription.
- Tous les champs JSON doivent être rédigés en ${outputLanguage}.
- Ne mélange pas les langues.
- Si la langue demandée est English, aucun champ ne doit rester en français sauf noms propres ou citations nécessaires.

Transcript :
${transcript}

CONTEXTE PUBLICITAIRE CAPTURÉ :
- Plateforme : ${context.sourcePlatform || "Non détectée"}
- Annonceur : ${context.advertiserName || "Non détecté"}
- Texte publicitaire : ${context.adText || "Non détecté"}
- Appel à l’action : ${context.callToAction || "Non détecté"}
- Landing page : ${context.landingPage || "Non détectée"}
- ID publicitaire : ${context.libraryId || "Non détecté"}
- Type de créatif : ${context.creativeType || "Non détecté"}

RÈGLE D’ANALYSE :
- À cette étape, tu analyses UNIQUEMENT le transcript et les métadonnées capturées. Tu ne dois jamais prétendre avoir vu les images de la vidéo.
- Si la transcription contient seulement de la musique, des silences ou très peu de paroles, utilise uniquement les métadonnées réellement fournies.
- Ne conclus jamais qu’un CTA, une preuve visuelle, un produit, un texte à l’écran ou un élément de montage existe si cette information n’est pas explicitement présente dans le transcript ou les métadonnées.
- Distingue clairement ce qui vient de l’audio et ce qui vient des métadonnées.
- N’invente aucune métrique de performance : CTR, rétention, ROAS, conversion, vues ou benchmark.

${PSYCHOLOGY_ANALYSIS_CORE}

IMPORTANT :
- Ne remplis un champ que si les éléments disponibles permettent de le justifier. Sinon indique qu’il n’est pas déterminable.
- N’invente jamais de score, CTA, preuve, texte à l’écran, métrique ou comportement visuel.
- Le champ viralScore doit rester vide : aucune donnée de performance réelle ne permet de calculer un score viral.
- psychology doit contenir les mécanismes psychologiques réellement détectés et leur effet concret
- whyItWorks doit expliquer la logique de performance, pas répéter psychology
- JSON uniquement
- Tous les textes doivent être en ${outputLanguage}

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
    model: process.env.OPENAI_ANALYSIS_MODEL || "gpt-4.1-mini",
    temperature: 0.5,
    messages: [
      {
        role: "system",
        content: `${PSYCHOLOGY_ANALYSIS_CORE}
JSON complet uniquement. Toute la réponse doit être en ${outputLanguage}.`,
      },
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

  return normalizeAnalysis(parsed);
}


async function downloadImageAsDataUrl(imageUrl: string): Promise<string> {
  const response = await fetch(imageUrl, {
    method: "GET",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/138 Safari/537.36",
      Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      Referer: "https://www.facebook.com/",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Impossible de télécharger l’image Meta (${response.status})`
    );
  }

  const contentType =
    response.headers.get("content-type")?.split(";")[0] || "image/jpeg";

  if (!contentType.startsWith("image/")) {
    throw new Error(
      `Le fichier Meta reçu n’est pas une image (${contentType})`
    );
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (!buffer.length) {
    throw new Error("L’image Meta téléchargée est vide");
  }

  const maxBytes = 15 * 1024 * 1024;

  if (buffer.length > maxBytes) {
    throw new Error("L’image Meta dépasse la taille maximale autorisée");
  }

  return `data:${contentType};base64,${buffer.toString("base64")}`;
}

async function analyzeImageAd(body: any, language: string) {
  const outputLanguage = normalizeOutputLanguage(language);
  const imageUrl = body?.creativeUrl || body?.url;

  if (!imageUrl) {
    throw new Error("URL image manquante");
  }

  const imageDataUrl = await downloadImageAsDataUrl(imageUrl);

  const prompt = `
Analyse cette publicité statique importée depuis Meta Ads Library.

Toute l'analyse doit être en ${outputLanguage}.
Retourne uniquement un JSON valide.

Métadonnées :
- Annonceur : ${body?.advertiserName || "Non détecté"}
- Texte publicitaire : ${body?.adText || "Non détecté"}
- CTA : ${body?.callToAction || "Non détecté"}
- Landing page : ${body?.landingPage || "Non détectée"}
- ID Meta : ${body?.libraryId || "Non détecté"}

${PSYCHOLOGY_ANALYSIS_CORE}

Analyse :
- hook visuel et textuel
- structure
- angle marketing
- psychologie profonde, reliée aux éléments réellement visibles et au texte publicitaire
- forces
- faiblesses
- idées à reproduire
- hooks similaires
- angles similaires
- prompt de script
- score viral sur 10
- pourquoi cela fonctionne
- comment faire mieux
- angles publicitaires
- type de créatif

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
    model:
      process.env.OPENAI_VISION_MODEL ||
      process.env.OPENAI_ANALYSIS_MODEL ||
      "gpt-4.1-mini",
    temperature: 0.5,
    messages: [
      {
        role: "system",
        content: `${PSYCHOLOGY_ANALYSIS_CORE}
Tu analyses aussi les éléments visuels réellement présents dans l’image. JSON uniquement. Toute la réponse doit être en ${outputLanguage}.`,
      },
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          {
            type: "image_url",
            image_url: {
              url: imageDataUrl,
              detail: "high",
            },
          },
        ],
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content || "";

  let parsed: any;

  try {
    parsed = JSON.parse(cleanJsonString(raw));
  } catch {
    parsed = {};
  }

  return normalizeAnalysis(parsed);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url } = body;
    const language = body?.language || body?.lang || "French";

    if (!url) {
      return NextResponse.json({ error: "Lien manquant" }, { status: 400 });
    }

    if (
      body?.creativeType === "image" &&
      (body?.creativeUrl || body?.url)
    ) {
      const analysis = await analyzeImageAd(body, language);

      return NextResponse.json({
        platform: body?.sourcePlatform || body?.platform || "meta",
        language: normalizeOutputLanguage(language),
        transcript: body?.adText || "",
        ...analysis,
      creativeType: "image",
  });
    }

    const platform = detectPlatform(url);

    if (platform === "facebook") {
      return NextResponse.json(
        {
          error: "Facebook non supporté via lien. Upload la vidéo.",
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

    const analysisContext: AnalysisContext = {
      sourcePlatform: body?.sourcePlatform || body?.platform || platform,
      advertiserName: body?.advertiserName || "",
      adText: body?.adText || "",
      callToAction: body?.callToAction || "",
      landingPage: body?.landingPage || "",
      libraryId: body?.libraryId || "",
      creativeType: body?.creativeType || "video",
    };

    const analysis = await analyzeTranscript(
      transcript,
      language,
      analysisContext
    );

    const visualAnalysis = await analyzeVideoVisuallySafe(
      url,
      transcript,
      language,
      analysisContext
    );

    return NextResponse.json({
      platform,
      language: normalizeOutputLanguage(language),
      ...analysis,
      ...visualAnalysis,
      transcript,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
