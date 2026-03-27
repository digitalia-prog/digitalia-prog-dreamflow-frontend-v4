import { NextResponse } from "next/server";

type Mode = "CREATOR" | "AGENCY";

const RATE_LIMIT = 20;
const rateLimitMap = new Map();

export async function POST(req: Request) {
  try {
    // RATE LIMIT
    const ip =
      req.headers.get("x-forwarded-for") ||
      "unknown";

    const now = Date.now();
    const windowMs = 60 * 1000;

    const requests = rateLimitMap.get(ip) || [];

    const recent = requests.filter(
      (timestamp: number) =>
        now - timestamp < windowMs
    );

    if (recent.length >= RATE_LIMIT) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    recent.push(now);
    rateLimitMap.set(ip, recent);

    const body = await req.json();

    // BETA KEY SECURITY
    const betaKey =
      req.headers.get("x-beta-key");

    if (
      process.env.BETA_KEY &&
      betaKey !== process.env.BETA_KEY
    ) {
      return NextResponse.json(
        { error: "Unauthorized beta access" },
        { status: 401 }
      );
    }

    const {
      mode,
      lang,
      platform,
      objective,
      audience,
      offer,
      price,
      angle,
      objection,
      hookType,
      tone,
      duration,
      context,
    } = body;

    // INPUT VALIDATION
    if (!offer || !audience) {
      return NextResponse.json(
        {
          error:
            "Missing required fields",
        },
        { status: 400 }
      );
    }

    const scriptsCount =
      mode === "AGENCY" ? 10 : 4;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error:
            "Missing OPENAI_API_KEY",
        },
        { status: 500 }
      );
    }

    const systemPrompt = `
You are a professional UGC ads strategist.

You generate realistic short-form ad scripts.

Rules:

- Natural spoken language
- No corporate tone
- No templates
- Each script must be different
- Each script must feel human
- Must be realistic and filmable
- Must adapt to platform

Each script must include:

HOOK
SCRIPT (AIDA)
BEATS
PROOF
SHOTLIST
CTA
TESTING PLAN
KPI

PREMIUM ANALYSIS:

HOOK DETECTED
BEATS TIMING
WHY IT WORKS
ADS VARIANTS
CTA OPTIMIZED

Return ONLY valid JSON.
No markdown.
No explanations.
`;

    const userPrompt = `
Generate ${scriptsCount} scripts.

Language: ${lang}
Platform: ${platform}
Objective: ${objective}

Product: ${offer}
Price: ${price}

Audience: ${audience}

Angle: ${angle}

Objection: ${objection}

Hook type: ${hookType}

Tone: ${tone}

Duration: ${duration}

Context: ${context}

Return JSON format:

{
  "variants":[
    {
      "hook":"",
      "hookDetected":"",
      "script":{
        "aida":{
          "attention":"",
          "interest":"",
          "desire":"",
          "action":""
        }
      },
      "beats":[],
      "beatsTiming":[],
      "proof":[],
      "whyItWorks":[],
      "adsVariants":[],
      "shotlist":[],
      "cta":{
        "primary":"",
        "optimized":""
      },
      "testingPlan":[],
      "kpi":[]
    }
  ]
}
`;

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
          Authorization:
            "Bearer " +
            process.env.OPENAI_API_KEY,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          temperature: 0.9,
          response_format: {
            type: "json_object",
          },
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: userPrompt,
            },
          ],
        }),
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            "OpenAI request failed",
          details:
            data?.error?.message ||
            "Unknown error",
        },
        { status: 500 }
      );
    }

    const raw =
      data?.choices?.[0]?.message
        ?.content || "";

    let parsed = null;

    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      return NextResponse.json(
        {
          error:
            "JSON parse failed",
          raw,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      raw,
      parsed,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error:
          "Script generation failed",
        details:
          error?.message ||
          "unknown error",
      },
      { status: 500 }
    );
  }
}
