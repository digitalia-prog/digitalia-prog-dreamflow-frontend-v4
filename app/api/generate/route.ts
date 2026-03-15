import { NextResponse } from "next/server";

type Mode = "AGENCY" | "CREATOR";

type GenerateBody = {
  mode?: Mode;
  lang?: string;
  platform?: string;
  objective?: string;
  audience?: string;
  offer?: string;
  price?: string;
  angle?: string;
  objection?: string;
  hookType?: string;
  tone?: string;
  duration?: string;
  context?: string;
};

export async function POST(req: Request) {
  try {
    const body: GenerateBody = await req.json();

    const mode: Mode = body.mode === "AGENCY" ? "AGENCY" : "CREATOR";
    const lang = body.lang || "fr";
    const platform = body.platform || "TikTok";
    const objective = body.objective || "Vente";
    const audience = body.audience || "";
    const offer = body.offer || "";
    const price = body.price || "";
    const angle = body.angle || "";
    const objection = body.objection || "";
    const hookType = body.hookType || "";
    const tone = body.tone || "";
    const duration = body.duration || "";
    const context = body.context || "";

    const scriptsCount = mode === "AGENCY" ? 10 : 4;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY in environment variables." },
        { status: 500 }
      );
    }

    const systemPrompt = `
You are Script Engine, a senior UGC marketing strategist and direct-response copywriter.

Your mission:
Generate ad scripts that feel human, emotional, believable, filmable, and native to the selected platform.

IMPORTANT RULES
- Natural spoken language only.
- No robotic or corporate tone.
- No generic AI phrasing.
- Every script must feel like a real creator speaking to camera.
- Sell the actual product only.

PRODUCT
${offer}

MAIN INPUTS
Audience: ${audience}
Product: ${offer}
Price: ${price}
Angle: ${angle}
Platform: ${platform}
Objective: ${objective}
Tone: ${tone}
Hook type: ${hookType}
Duration: ${duration}
Context: ${context}
Main objection: ${objection}
Language: ${lang}

OBJECTION RULE
Every script must address the main objection directly or indirectly.

SCRIPT COUNT RULE
Generate exactly ${scriptsCount} scripts.

OUTPUT RULE
Return valid JSON only.
No markdown.
No explanation.
No backticks.
`;

    const userPrompt = `
Generate exactly ${scriptsCount} emotionally strong ad scripts in ${lang}.

Return this exact JSON shape:
{
  "hookIdeas": ["", ""],
  "creativeAngles": ["", "", ""],
  "testingPlanSummary": "",
  "variants": [
    {
      "hook": "",
      "script": {
        "aida": {
          "attention": "",
          "interest": "",
          "desire": "",
          "action": ""
        }
      },
      "beats": ["", "", ""],
      "proof": ["", ""],
      "shotlist": ["", "", ""],
      "cta": {
        "primary": ""
      },
      "testingPlan": "",
      "kpi": ""
    }
  ]
}

STRICT RULES
- variants must contain exactly ${scriptsCount} items
- beats must be an array
- proof must be an array
- shotlist must be an array
- cta must be an object with "primary"
- JSON only
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

    const hookIdeas = Array.isArray(parsed?.hookIdeas) ? parsed.hookIdeas : [];
    const creativeAngles = Array.isArray(parsed?.creativeAngles)
      ? parsed.creativeAngles
      : [];
    const testingPlanSummary =
      typeof parsed?.testingPlanSummary === "string"
        ? parsed.testingPlanSummary
        : "";
    const variants = Array.isArray(parsed?.variants) ? parsed.variants : [];

    return NextResponse.json({
      hookIdeas,
      creativeAngles,
      testingPlanSummary,
      variants,
      parsed,
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
