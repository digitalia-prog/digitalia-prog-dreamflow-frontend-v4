import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Body = {
  mode?: string;
  lang?: string;
  platform?: string;
  hookType?: string;
  duration?: string;
  tone?: string;
  offer?: string;
  audience?: string;
  problem?: string;
  solution?: string;
  proof?: string;
  cta?: string;
  hak?: string;
};

function safe(v: unknown) {
  return typeof v === "string" ? v.trim() : "";
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY manquante" },
        { status: 500 }
      );
    }

    const body = (await req.json()) as Body;

    const lang = safe(body.lang) || "fr";
    const mode = safe(body.mode) || "VIRAL";
    const platform = safe(body.platform) || "TikTok";
    const hookType = safe(body.hookType) || "HAK";
    const duration = safe(body.duration) || "30s";
    const tone = safe(body.tone) || "Direct";
    const offer = safe(body.offer);
    const audience = safe(body.audience);
    const problem = safe(body.problem);
    const solution = safe(body.solution);
    const proof = safe(body.proof);
    const cta = safe(body.cta);
    const hak = safe(body.hak);

    const languageDirective =
      lang === "en"
        ? "Write the entire script in English."
        : lang === "ar"
        ? "اكتب النص بالكامل باللغة العربية."
        : lang === "zh"
        ? "请用中文输出完整脚本。"
        : "Écris tout le script en français.";

    const userPrompt = `
${languageDirective}

Tu es un expert en scripts TikTok/Reels/Shorts.
Génère un script structuré et actionnable, prêt à tourner.

Contraintes:
- Plateforme: ${platform}
- Mode: ${mode} (VIRAL = punchy, HAK = twist/hack)
- Hook type: ${hookType}
- Durée: ${duration}
- Ton: ${tone}

Infos (si vides, improvise intelligemment):
- Offre: ${offer || "(non précisée)"}
- Audience: ${audience || "(non précisée)"}
- Problème: ${problem || "(non précisé)"}
- Solution: ${solution || "(non précisée)"}
- Preuve: ${proof || "(non précisée)"}
- CTA: ${cta || "(non précisé)"}
- Hack/Twist: ${hak || "(non précisé)"}

Format STRICT (avec titres):
HOOK:
STORY:
PROBLÈME:
SOLUTION:
PREUVE:
CTA:
${mode === "HAK" ? "HAK/TWIST:" : ""}

Règles:
const prompt = `
You are a professional UGC video director.

Create a TikTok / Reels script.

Structure the output with:

HOOK
STORY
PROBLEM
SOLUTION
PROOF
CTA

For each section include:
TEXT: what the creator says
CAMERA: camera angle or framing
EMOTION: emotion the creator shows
ACTION: gesture or movement
DELIVERY: tone and pace
`;
Rules:
- Short sentences
- Easy to read out loud
- No explanations
- Add two hooks (HOOK A / HOOK B)
`;`;
- Pas de blabla.
- Pas d'explications meta.
- Phrases courtes, faciles à lire à voix haute.
- Ajoute 2 variantes de HOOK au début (HOOK A / HOOK B).
`.trim();

    // Appel OpenAI (format compatible chat/completions)
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.8,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    const data = await res.json();

    const output =
      data?.choices?.[0]?.message?.content ||
      data?.error?.message ||
      "Erreur génération";

    if (!res.ok) {
      return NextResponse.json(
        { error: "OpenAI error", details: output, raw: data },
        { status: res.status }
      );
    }

    return NextResponse.json({ output, raw: output });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Server error", details: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}
