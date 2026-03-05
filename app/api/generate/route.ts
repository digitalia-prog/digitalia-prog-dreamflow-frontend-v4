import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Body = {
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

    const offer = safe(body.offer);
    const audience = safe(body.audience);
    const problem = safe(body.problem);
    const solution = safe(body.solution);
    const proof = safe(body.proof);
    const cta = safe(body.cta);
    const hak = safe(body.hak);

    const prompt = `
You are a professional UGC video director and viral strategist.

Create a TikTok / Reels script.

Offer: ${offer}
Audience: ${audience}
Problem: ${problem}
Solution: ${solution}
Proof: ${proof}
CTA: ${cta}
Hook idea (HAK): ${hak}

Return ONLY the following structure:

HOOK A
TEXT:
CAMERA:
EMOTION:
ACTION:
DELIVERY:

HOOK B
TEXT:
CAMERA:
EMOTION:
ACTION:
DELIVERY:

STORY
TEXT:
CAMERA:
EMOTION:
ACTION:
DELIVERY:

PROBLEM
TEXT:
CAMERA:
EMOTION:
ACTION:
DELIVERY:

SOLUTION
TEXT:
CAMERA:
EMOTION:
ACTION:
DELIVERY:

PROOF
TEXT:
CAMERA:
EMOTION:
ACTION:
DELIVERY:

CTA
TEXT:
CAMERA:
EMOTION:
ACTION:
DELIVERY:

Rules:
- Short sentences
- Creator speaking style
- Strong emotional hooks
- Clear camera directions
- No explanations
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
        messages: [
          {
            role: "system",
            content:
              "You are an expert UGC script writer specialised in viral short-form video. Do not output 'STRUCTURE (simple)' or any notes. Follow the exact format requested.",
          },
          { role: "user", content: prompt },
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
    return NextResponse.json(
      { error: e?.message || "Server error" },
      { status: 500 }
    );
  }
}
