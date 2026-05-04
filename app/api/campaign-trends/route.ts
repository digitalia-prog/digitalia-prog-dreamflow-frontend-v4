import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const DATAFORSEO_LOGIN = process.env.DATAFORSEO_LOGIN || "";
const DATAFORSEO_PASSWORD = process.env.DATAFORSEO_PASSWORD || "";

type TrendPoint = {
  label: string;
  value: number;
};

function cleanJsonString(value: string) {
  return value
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function countryToLocation(country: string) {
  const map: Record<string, number> = {
    US: 2840,
    FR: 2250,
    GB: 2826,
    CA: 2124,
    DE: 2276,
    ES: 2724,
    IT: 2380,
    NL: 2528,
    SE: 2752,
    BR: 2076,
    MX: 2484,
    DZ: 2012,
  };

  return map[country] || 2840;
}

function countryToLanguage(country: string) {
  const map: Record<string, string> = {
    US: "en",
    GB: "en",
    CA: "en",
    FR: "fr",
    DZ: "fr",
    DE: "de",
    ES: "es",
    MX: "es",
    IT: "it",
    NL: "nl",
    SE: "sv",
    BR: "pt",
  };

  return map[country] || "en";
}

function normalizeTimeline(rawItems: any[]): TrendPoint[] {
  const items = Array.isArray(rawItems) ? rawItems : [];

  const points = items
    .map((item: any) => {
      const date =
        item?.date_from ||
        item?.date_to ||
        item?.date ||
        item?.time ||
        item?.timestamp ||
        "";

      const value =
        item?.values?.[0] ??
        item?.value?.[0] ??
        item?.value ??
        item?.items?.[0]?.value ??
        0;

      return {
        label: String(date).slice(5, 10) || "—",
        value: Number(value) || 0,
      };
    })
    .filter((p) => p.value >= 0);

  if (points.length > 0) return points.slice(-12);

  return [
    { label: "Jan", value: 8 },
    { label: "Fév", value: 14 },
    { label: "Mar", value: 28 },
    { label: "Avr", value: 52 },
    { label: "Mai", value: 78 },
  ];
}

function calculateGrowth(points: TrendPoint[]) {
  if (points.length < 2) {
    return { weeklyGrowth: 0, monthlyGrowth: 0, yearlyGrowth: 0 };
  }

  const first = points[0]?.value || 1;
  const last = points[points.length - 1]?.value || 0;
  const previous = points[points.length - 2]?.value || first;

  const weeklyGrowth = Math.round(((last - previous) / Math.max(previous, 1)) * 100);
  const monthlyGrowth = Math.round(((last - first) / Math.max(first, 1)) * 100);
  const yearlyGrowth = Math.max(monthlyGrowth * 4, monthlyGrowth);

  return { weeklyGrowth, monthlyGrowth, yearlyGrowth };
}

function opportunityScore(volume: number, monthlyGrowth: number) {
  return Math.max(
    1,
    Math.min(99, Math.round(volume * 0.55 + Math.max(monthlyGrowth, 0) * 0.18))
  );
}

async function enrichWithAI(keyword: string, platform: string, niche: string, goal: string) {
  if (!process.env.OPENAI_API_KEY) {
    return {
      angle: "Angle opportunité marché",
      hooks: [
        `Pourquoi ${keyword} commence à exploser maintenant ?`,
        `La tendance ${keyword} que les marques doivent tester`,
      ],
      script: `Hook : ${keyword} attire l’attention. Montre le problème, la transformation, la preuve puis termine avec un CTA clair.`,
    };
  }

  const prompt = `
Tu es un expert senior en UGC ads, e-commerce et performance marketing.

Mot-clé tendance : "${keyword}"

Contexte :
- Plateforme cible : ${platform}
- Niche : ${niche}
- Objectif : ${goal}

Retourne uniquement un JSON valide :
{
  "angle": "",
  "hooks": ["", ""],
  "script": ""
}
`;

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_ANALYSIS_MODEL || "gpt-4.1-mini",
    temperature: 0.7,
    messages: [
      { role: "system", content: "Réponds uniquement en JSON valide." },
      { role: "user", content: prompt },
    ],
  });

  try {
    return JSON.parse(cleanJsonString(completion.choices[0]?.message?.content || "{}"));
  } catch {
    return {
      angle: "Angle opportunité marché",
      hooks: [
        `Pourquoi ${keyword} commence à exploser maintenant ?`,
        `La tendance ${keyword} que les marques doivent tester`,
      ],
      script: `Hook : ${keyword} attire l’attention. Montre le problème, la transformation, la preuve puis termine avec un CTA clair.`,
    };
  }
}

async function fetchDataForSeoTrend(keyword: string, country: string) {
  if (!DATAFORSEO_LOGIN || !DATAFORSEO_PASSWORD) {
    throw new Error("DATAFORSEO credentials missing");
  }

  const auth = Buffer.from(`${DATAFORSEO_LOGIN}:${DATAFORSEO_PASSWORD}`).toString("base64");

  const response = await fetch(
    "https://api.dataforseo.com/v3/keywords_data/google_trends/explore/live",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        {
          keywords: [keyword],
          location_code: countryToLocation(country),
          language_code: countryToLanguage(country),
          type: "web",
          date_from: "2025-01-01",
        },
      ]),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.status_message || "Erreur DataForSEO");
  }

  const items =
    data?.tasks?.[0]?.result?.[0]?.items?.[0]?.data ||
    data?.tasks?.[0]?.result?.[0]?.items?.[0]?.values ||
    data?.tasks?.[0]?.result?.[0]?.items ||
    [];

  return normalizeTimeline(items);
}

function mockTimeline(seed = 1): TrendPoint[] {
  const labels = ["Jan", "Fév", "Mar", "Avr", "Mai"];
  return labels.map((label, index) => ({
    label,
    value: Math.min(100, Math.round(8 + index * (12 + seed) + Math.random() * 18)),
  }));
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const keyword = String(body?.keyword || "").trim();
    const country = String(body?.country || "US");
    const platform = String(body?.platform || "Global Ads");
    const niche = String(body?.niche || "E-commerce");
    const goal = String(body?.goal || "Conversion");

    if (!keyword) {
      return NextResponse.json({ error: "Mot-clé manquant." }, { status: 400 });
    }

    const relatedKeywords = [
      keyword,
      `${keyword} tendance`,
      `${keyword} avis`,
      `${keyword} viral`,
      `${keyword} 2026`,
    ];

    const trends = [];

    for (let i = 0; i < relatedKeywords.length; i++) {
      const currentKeyword = relatedKeywords[i];

      let timeline: TrendPoint[] = [];

      try {
        timeline = await fetchDataForSeoTrend(currentKeyword, country);
      } catch {
        timeline = mockTimeline(i + 1);
      }

      const maxValue = Math.max(...timeline.map((p) => p.value), 1);
      const volume = Math.min(100, Math.max(1, Math.round(maxValue)));
      const growth = calculateGrowth(timeline);
      const ai = await enrichWithAI(currentKeyword, platform, niche, goal);

      trends.push({
        keyword: currentKeyword,
        volume,
        weeklyGrowth: growth.weeklyGrowth,
        monthlyGrowth: growth.monthlyGrowth,
        yearlyGrowth: growth.yearlyGrowth,
        opportunityScore: opportunityScore(volume, growth.monthlyGrowth),
        timeline,
        angle: ai?.angle || "Angle opportunité marché",
        hooks: Array.isArray(ai?.hooks) ? ai.hooks : [],
        script: ai?.script || "",
      });
    }

    return NextResponse.json({
      success: true,
      source:
        DATAFORSEO_LOGIN && DATAFORSEO_PASSWORD
          ? "DataForSEO Google Trends + OpenAI"
          : "Mock + OpenAI",
      country,
      platform,
      trends,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Erreur API campaign-trends",
        details: error?.message || "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}
