import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Body = {
  mode?: string;       // "Viral IA" | "Creator" | etc.
  lang?: string;       // "fr" | "en"
  platform?: string;   // "TikTok" | "Reels" | "Shorts"
  hookType?: string;   // "Question" | "Shock" | "Story" | "Contrarian" | "HAK"
  duration?: string;   // "15s" | "30s" | "45s" | "60s"
  tone?: string;       // "Hype" | "Luxury" | etc.
  offer?: string;
  audience?: string;
  problem?: string;
  solution?: string;
  proof?: string;
  cta?: string;
  hak?: string;
};

function safe(v: unknown) {
  if (typeof v === "string") return v.trim();
  return "";
}

function normalizeLang(lang?: string) {
  const l = (lang || "fr").toLowerCase();
  return l.startsWith("en") ? "en" : "fr";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;

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

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY manquante" },
        { status: 500 }
      );
    }

    // IMPORTANT: prompt uniquement. Ne touche pas à la partie API/fetch en dessous.
    const prompt =
      lang === "en"
        ? `
You are a professional UGC video director and conversion strategist.
Goal: write a psychologically persuasive, emotional short-form script for ${platform} in ${duration}, tone: ${tone}.
Mode: ${mode}. Hook type requested: ${hookType}.

Inputs:
- Offer: ${offer}
- Audience: ${audience}
- Problem: ${problem}
- Solution: ${solution}
- Proof: ${proof}
- CTA: ${cta}
- HAK/TWIST (if any): ${hak}

OUTPUT FORMAT (STRICT, no extra text, no meta):
HOOK A:
TEXT:
CAMERA:
EMOTION:
ACTION:
DELIVERY:

HOOK B:
TEXT:
CAMERA:
EMOTION:
ACTION:
DELIVERY:

STORY:
TEXT:
CAMERA:
EMOTION:
ACTION:
DELIVERY:

PROBLEM:
TEXT:
CAMERA:
EMOTION:
ACTION:
DELIVERY:

SOLUTION:
TEXT:
CAMERA:
EMOTION:
ACTION:
DELIVERY:

PROOF:
TEXT:
CAMERA:
EMOTION:
ACTION:
DELIVERY:

CTA:
TEXT:
CAMERA:
EMOTION:
ACTION:
DELIVERY:
${hookType.toUpperCase() === "HAK" ? "\nHAK/TWIST:\nTEXT:\nCAMERA:\nEMOTION:\nACTION:\nDELIVERY:\n" : ""}

PSYCHOLOGY RULES:
- Use emotion + tension (fear of missing out, frustration, hope, relief, curiosity).
- Use a clear villain (the mistake/bad habit) + a simple win (the solution).
- Use concrete sensory cues: what we see/hear, micro-actions, facial expressions.
- Keep sentences short, spoken language, easy to perform.
- Add pattern interrupts and micro-pauses for retention.
- Show the viewer a believable transformation or “before/after” moment.
- No generic fluff. No explanations about what you are doing.
`
        : `
Tu es un réalisateur UGC professionnel + stratège conversion.
Objectif : écrire un script court ${platform} en ${duration}, ton: ${tone}, ULTRA actionnable, avec psychologie + émotion.
Mode: ${mode}. Type de hook demandé: ${hookType}.

Inputs:
- Offre: ${offer}
- Audience: ${audience}
- Problème: ${problem}
- Solution: ${solution}
- Preuve: ${proof}
- CTA: ${cta}
- HAK/TWIST (si présent): ${hak}

FORMAT DE SORTIE (STRICT, aucune phrase en plus, pas de blabla, pas de meta):
HOOK A:
TEXT:
CAMERA:
EMOTION:
ACTION:
DELIVERY:

HOOK B:
TEXT:
CAMERA:
EMOTION:
ACTION:
DELIVERY:

STORY:
TEXT:
CAMERA:
EMOTION:
ACTION:
DELIVERY:

PROBLÈME:
TEXT:
CAMERA:
EMOTION:
ACTION:
DELIVERY:

SOLUTION:
TEXT:
CAMERA:
EMOTION:
ACTION:
DELIVERY:

PREUVE:
TEXT:
CAMERA:
EMOTION:
ACTION:
DELIVERY:

CTA:
TEXT:
CAMERA:
EMOTION:
ACTION:
DELIVERY:
${hookType.toUpperCase() === "HAK" ? "\nHAK/TWIST:\nTEXT:\nCAMERA:\nEMOTION:\nACTION:\nDELIVERY:\n" : ""}

RÈGLES PSYCHOLOGIE / ÉMOTION:
- Crée tension + émotion (frustration, peur de rater, espoir, soulagement, curiosité).
- Désigne un “méchant” clair (l’erreur / l’habitude) + un “win” simple (ta solution).
- Donne des détails concrets: cadrage, gestes, visage, rythme, sons, micro-pauses.
- Langage oral, phrases courtes, faciles à jouer.
- Pattern interrupt au début + 1 relance au milieu (cut / zoom / geste).
- Montre un mini avant/après crédible (même en 1 phrase).
- Zéro blabla. Zéro explication sur le prompt.
`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
  {
    role: "system",
    content:messages: [
{
  role: "system",
  content:
  "Tu es un directeur UGC senior + copywriter performance.\n" +
  "Écris un script TikTok prêt à tourner.\n\n" +
  "FORMAT STRICT :\n\n" +
  "HOOK A:\nTEXT:\nCAMERA:\nEMOTION:\nACTION:\nDELIVERY:\n\n" +
  "HOOK B:\nTEXT:\nCAMERA:\nEMOTION:\nACTION:\nDELIVERY:\n\n" +
  "PROBLÈME:\nTEXT:\nCAMERA:\nEMOTION:\nACTION:\nDELIVERY:\n\n" +
  "SOLUTION:\nTEXT:\nCAMERA:\nEMOTION:\nACTION:\nDELIVERY:\n\n" +
  "CTA:\nTEXT:\nCAMERA:\nEMOTION:\nACTION:\nDELIVERY:\n"
},
{ role: "user", content: prompt }
],
      "Tu es un directeur UGC senior + copywriter performance. Tu dois produire un script prêt à tourner, émotionnel et psychologique. Réponds UNIQUEMENT en français. Format STRICT (titres obligatoires) :\n\nHOOK A:\nTEXT:\nCAMERA:\nEMOTION:\nACTION:\nDELIVERY:\n\nHOOK B:\nTEXT:\nCAMERA:\nEMOTION:\nACTION:\nDELIVERY:\n\nSTORY:\nTEXT:\nCAMERA:\nEMOTION:\nACTION:\nDELIVERY:\n\nPROBLÈME:\nTEXT:\nCAMERA:\nEMOTION:\nACTION:\nDELIVERY:\n\nSOLUTION:\nTEXT:\nCAMERA:\nEMOTION:\nACTION:\nDELIVERY:\n\nPREUVE:\nTEXT:\nCAMERA:\nEMOTION:\nACTION:\nDELIVERY:\n\nCTA:\nTEXT:\nCAMERA:\nEMOTION:\nACTION:\nDELIVERY:\n\nRègles : phrases courtes, punchy, aucun blabla, pas de meta, pas de 'STRUCTURE (simple)'. Le script doit inclure des éléments concrets : placement caméra, gestes, micro-expressions, rythme, et triggers psycho (curiosité, tension, soulagement, preuve, désir)."
  },
  { role: "user", content: prompt }
],
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      return NextResponse.json({ error: txt }, { status: 500 });
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content ?? "";

    return NextResponse.json({ content });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
