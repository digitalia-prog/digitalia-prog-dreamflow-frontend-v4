import { NextResponse } from "next/server";

type Mode = "AGENCY" | "CREATOR";

type GenerateBody = {
  mode?: Mode;
  lang?: string;
  platform?: string;
  objective?: string;
  audience?: string;
  offer?: string;
  product?: string;
  price?: string;
  angle?: string;
  objection?: string;
  hookType?: string;
  tone?: string;
  duration?: string;
  context?: string;
  brief?: string;
};

export async function POST(req: Request) {
  try {
    const body: GenerateBody = await req.json();

    const mode: Mode = body.mode === "AGENCY" ? "AGENCY" : "CREATOR";
    const lang = body.lang || "FR";
    const platform = body.platform || "TikTok";
    const objective = body.objective || "Vente";
    const audience = body.audience || "";
    const offer = body.offer || body.product || "";
    const price = body.price || "";
    const angle = body.angle || "";
    const objection = body.objection || "";
    const hookType = body.hookType || "";
    const tone = body.tone || "";
    const duration = body.duration || "";
    const context = body.context || body.brief || "";

    const scriptsCount = mode === "AGENCY" ? 10 : 4;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY in environment variables." },
        { status: 500 }
      );
    }

    const systemPrompt = `
You are Script Engine, a senior UGC strategist, paid ads strategist, direct-response copywriter, performance marketer, and creative director.

Generate highly specific scripts based on user inputs.

Selected language: ${lang}
`;

    const userPrompt = `
Generate exactly ${scriptsCount} scripts

Inputs:
Product: ${offer}
Audience: ${audience}
Platform: ${platform}
Objective: ${objective}
Context: ${context}
Price: ${price}
Angle: ${angle}
Objection: ${objection}
Hook Type: ${hookType}
Tone: ${tone}
Duration: ${duration}
Mode: ${mode}

Return valid JSON only.
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        temperature: 1,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "OpenAI request failed",
          details: data?.error?.message || "Unknown OpenAI error",
        },
        { status: 500 }
      );
    }

    const raw = data?.choices?.[0]?.message?.content || "";

    let parsed: any;

    try {
      parsed = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        {
          error: "Failed to parse AI JSON response",
          raw,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ...parsed,
      raw,
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Unexpected server error",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
