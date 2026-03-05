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

function normalizeLang(lang?: string) {
  const l = (lang || "fr").toLowerCase();
  return l.startsWith("en") ? "en" : "fr";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
    }

    const mode = safe(body.mode) || "Creator";
    const lang = normalizeLang(body.lang);
    const platform = safe(body.platform) || "TikTok";
    const hookType = safe(body.hookType) || "HAK";
    const duration = safe(body.duration) || "30s";
    const tone = safe(body.tone) || "Hype";

    const offer = safe(body.offer) || "(non précisée)";
    const audience = safe(body.audience) || "(non précisée)";
    const problem = safe(body.problem) || "(non précisé)";
    const solution = safe(body.solution) || "(non précisée)";
    const proof = safe(body.proof) || "(non précisée)";
    const cta = safe(body.cta) || "(non précisé)";
    const hak = safe(body.hak) || "(non précisé)";

    const userPrompt =
      lang === "en"
        ? `
Create a ${platform} short-form script (${duration}), tone: ${tone}.
Mode: ${mode}. Hook type: ${hookType}.

Inputs:
- Offer: ${offer}
- Audience: ${audience}
- Problem: ${problem}
- Solution: ${solution}
- Proof: ${proof}
- CTA: ${cta}
- HAK/Twist: ${hak}
`
        : `
Crée un script ${platform} (${duration}), ton: ${tone}.
Mode: ${mode}. Type de hook: ${hookType}.

Inputs:
- Offre: ${offer}
- Audience: ${audience}
- Problème: ${problem}
- Solution: ${solution}
- Preuve: ${proof}
- CTA: ${cta}
- HAK/Twist: ${hak}
`;

    const systemPrompt =
      lang === "en"
        ? [
            "You are a senior UGC director + performance copywriter.",
            "Write a psychologically persuasive, emotional script ready to film.",
            "Return ONLY in English.",
            "",
            "STRICT OUTPUT FORMAT (no extra text):",
            "",
            "HOOK A:",
            "TEXT:",
            "CAMERA:",
            "EMOTION:",
            "ACTION:",
            "DELIVERY:",
            "",
            "HOOK B:",
            "TEXT:",
            "CAMERA:",
            "EMOTION:",
            "ACTION:",
            "DELIVERY:",
            "",
            "STORY:",
            "TEXT:",
            "CAMERA:",
            "EMOTION:",
            "ACTION:",
            "DELIVERY:",
            "",
            "PROBLEM:",
            "TEXT:",
            "CAMERA:",
            "EMOTION:",
            "ACTION:",
            "DELIVERY:",
            "",
            "SOLUTION:",
            "TEXT:",
            "CAMERA:",
            "EMOTION:",
            "ACTION:",
            "DELIVERY:",
            "",
            "PROOF:",
            "TEXT:",
            "CAMERA:",
            "EMOTION:",
            "ACTION:",
            "DELIVERY:",
            "",
            "CTA:",
            "TEXT:",
            "CAMERA:",
            "EMOTION:",
            "ACTION:",
            "DELIVERY:",
            "",
            "RULES:",
            "- Short spoken lines.",
            "- Concrete camera directions (framing, angle, movement).",
            "- Strong emotions + psychological triggers (curiosity, tension, relief, proof, desire).",
            "- No meta, no templates like 'STRUCTURE (simple)'.",
          ].join("\n")
        : [
            "Tu es un directeur UGC senior + copywriter performance.",
            "Tu écris un script prêt à tourner, émotionnel et psychologique.",
            "Réponds UNIQUEMENT en français.",
            "",
            "FORMAT STRICT (aucun texte en plus) :",
            "",
            "HOOK A:",
            "TEXT:",
            "CAMERA:",
            "EMOTION:",
            "ACTION:",
            "DELIVERY:",
            "",
            "HOOK B:",
            "TEXT:",
            "CAMERA:",
            "EMOTION:",
            "ACTION:",
            "DELIVERY:",
            "",
            "STORY:",
            "TEXT:",
            "CAMERA:",
            "EMOTION:",
            "ACTION:",
            "DELIVERY:",
            "",
            "PROBLÈME:",
            "TEXT:",
            "CAMERA:",
            "EMOTION:",
            "ACTION:",
            "DELIVERY:",
            "",
            "SOLUTION:",
            "TEXT:",
            "CAMERA:",
            "EMOTION:",
            "ACTION:",
            "DELIVERY:",
            "",
            "PREUVE:",
            "TEXT:",
            "CAMERA:",
            "EMOTION:",
            "ACTION:",
            "DELIVERY:",
            "",
            "CTA:",
            "TEXT:",
            "CAMERA:",
            "EMOTION:",
            "ACTION:",
            "DELIVERY:",
            "",
            "RÈGLES :",
            "- Phrases courtes (oral).",
            "- Consignes caméra concrètes (plan, angle, mouvement).",
            "- Émotions fortes + triggers psycho (curiosité, tension, soulagement, preuve, désir).",
            "- Zéro meta, zéro 'STRUCTURE (simple)'.",
          ].join("\n");

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        temperature: 0.7,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.error?.message || "OpenAI error" },
        { status: res.status }
      );
    }

    const text = data?.choices?.[0]?.message?.content ?? "";
    return NextResponse.json({ text });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
