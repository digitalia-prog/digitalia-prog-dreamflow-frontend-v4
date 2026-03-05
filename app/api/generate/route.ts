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
    const body = (await req.json()) as Body;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
    }

    const mode = safe(body.mode) || "Creator";
    const platform = safe(body.platform) || "TikTok";
    const hookType = safe(body.hookType) || "Shock";
    const duration = safe(body.duration) || "30s";
    const tone = safe(body.tone) || "Hype";

    const offer = safe(body.offer) || "(non précisée)";
    const audience = safe(body.audience) || "(non précisée)";
    const problem = safe(body.problem) || "(non précisé)";
    const solution = safe(body.solution) || "(non précisée)";
    const proof = safe(body.proof) || "(non précisée)";
    const cta = safe(body.cta) || "(non précisé)";
    const hak = safe(body.hak) || "(non précisé)";

    const prompt = `
You are a professional UGC video director.

Create a ${platform} short-form script.
Mode: ${mode}
Hook type: ${hookType}
Tone: ${tone}
Duration: ${duration}

Context:
- Offer: ${offer}
- Audience: ${audience}
- Problem: ${problem}
- Solution: ${solution}
- Proof: ${proof}
- CTA: ${cta}
${mode === "HAK" ? `- HAK/TWIST: ${hak}` : ""}

Output format (STRICT, with titles):
HOOK A:
HOOK B:
STORY:
PROBLEM:
SOLUTION:
PROOF:
CTA:

For each section include:
TEXT: what the creator says
CAMERA: camera angle or framing
EMOTION: emotion the creator shows
ACTION: gesture or movement
DELIVERY: tone and pace

Rules:
- Short sentences
- Easy to read out loud
- No explanations
- Keep it concrete and actionable
`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        temperature: 0.7,
        messages: [{ role: "user", content: prompt }],
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
