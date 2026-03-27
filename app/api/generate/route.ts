import { NextResponse } from "next/server";

type Mode = "CREATOR" | "AGENCY";

export async function POST(req: Request) {
  try {
    const body = await req.json();

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

    const scriptsCount = mode === "AGENCY" ? 10 : 4;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    const systemPrompt = `
You are a professional UGC ads strategist.

You generate realistic short-form ad scripts.

MULTI LANGUAGE SUPPORT

Supported languages:
- Français
- Arabic
- Spanish
- Chinese
- English US
- English UK

IMPORTANT:
Output must be in selected language only.

PSYCHOLOGICAL MARKETING RULES

Use psychological persuasion:
- fear of missing out
- social proof
- urgency
- curiosity
- problem agitation
- status desire
- simplicity bias
- loss aversion

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
HOOK DETECTED
SCRIPT (AIDA)
BEATS
BEATS TIMING
PROOF
WHY IT WORKS
ADS VARIANTS
SHOTLIST
CTA
CTA OPTIMIZED
TESTING PLAN
KPI

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
          "Content-Type": "application/json",
          Authorization: "Bearer " + process.env.OPENAI_API_KEY,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          temperature: 0.9,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "OpenAI request failed",
          details: data?.error?.message || "Unknown error",
        },
        { status: 500 }
      );
    }

    const raw =
      data?.choices?.[0]?.message?.content || "";

    let parsed = null;

    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      return NextResponse.json(
        {
          error: "JSON parse failed",
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
        error: "Script generation failed",
        details: error?.message || "unknown error",
      },
      { status: 500 }
    );
  }
}
