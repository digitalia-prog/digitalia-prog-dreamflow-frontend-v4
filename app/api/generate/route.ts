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
    } = body as {
      mode: Mode;
      lang: string;
      platform: string;
      objective: string;
      audience: string;
      offer: string;
      price: string;
      angle: string;
      objection: string;
      hookType: string;
      tone: string;
      duration: string;
      context: string;
    };

    const scriptsCount = mode === "AGENCY" ? 10 : 4;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: "Missing OPENAI_API_KEY in environment variables.",
        },
        { status: 500 }
      );
    }

    const systemPrompt = `
You are Script Engine, a senior UGC marketing strategist, direct response copywriter, and creative testing strategist.

Your role is to generate REAL, usable, filmable scripts for creators and brands.

IMPORTANT CORE RULES

- Write like a real person speaking on camera.
- Use natural spoken language.
- Avoid corporate tone.
- Avoid generic AI-sounding ad copy.
- Avoid template phrases.
- Avoid repetitive structures.
- Each script must feel like it was written by a different creator.
- Each script must feel realistic, filmable, and platform-native.

DO NOT USE OVERUSED GENERIC PHRASES SUCH AS:
- "imagine"
- "revolutionary"
- "ultimate solution"
- "transform your life"
- "game changer"

REALISM RULES

- Hooks must feel natural and scroll-stopping.
- Sentences should feel spoken, not written like a brochure.
- Use real-life frustrations, reactions, objections, or observations.
- The product must stay the product. Do not confuse the product with the SaaS or the script engine.
- The script must directly sell the user's actual product.

PRODUCT GUARDRAIL

The product being sold is:
${offer}

Do not sell "scripts", "marketing help", "the platform", or "the SaaS" unless the product itself is a SaaS.
Sell only the actual offer/product provided by the user.

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

OBJECTION RULE

Every script must directly address the objection.
The objection must not be ignored.
Turn the objection into reassurance, ease of use, proof, or product value.

PLATFORM ADAPTATION RULES

Selected platform: ${platform}

If platform = TikTok:
- Native TikTok UGC style
- Fast hook in the first line
- Conversational creator tone
- Feels filmed on phone
- Quick visual momentum

If platform = Instagram Reels:
- UGC creator style
- Slightly more polished and aesthetic than TikTok
- Still conversational and natural
- Short impactful lines

If platform = YouTube Shorts:
- Fast retention hook
- Clear mini-story progression
- Strong flow from first line to CTA

If platform = Facebook Ads:
- Direct response UGC style
- Problem → solution → proof → CTA
- Product shown quickly
- Conversion-oriented wording

If platform = Google Ads:
- Direct response style
- Benefit first
- Immediate clarity
- No slow intro
- Strong conversion focus

If platform = Landing page:
- More persuasive and explanatory
- Problem → solution → benefits → proof → CTA
- Build trust clearly

If platform = Email:
- Subject-line energy at the start
- Persuasive but conversational
- Benefit-driven copy
- Clear CTA

HOOK ENGINE RULES

Generate 10 hook ideas.
These hooks must be:
- short
- scroll-stopping
- realistic
- varied
- not repetitive

CREATIVE ANGLE ENGINE RULES

Generate 3 distinct creative angles.
Each angle should describe a different way to position the product.

SCRIPT ENGINE COUNT RULE

Generate exactly ${scriptsCount} scripts.

If mode = AGENCY:
- return 10 scripts

If mode = CREATOR:
- return 4 scripts

Each script must be genuinely different:
- different hook
- different framing
- different emotional angle
- different proof style
- different CTA wording
- different beats
- different shotlist logic

SCRIPT STRUCTURE RULE

Each script must contain:

HOOK

SCRIPT using AIDA:
- attention
- interest
- desire
- action

BEATS
- 3 to 5 short story beats

PROOF
- 2 to 3 proof points

SHOTLIST
- 3 to 5 concrete visual shots that can be filmed

CTA
- one short primary CTA

TEST PLAN
- one simple idea on how to test this creative

KPI
- one metric to track

GLOBAL TESTING PLAN

Also generate one overall testing plan for the full batch of scripts:
- what to test first
- what to compare
- which KPI to prioritize

OUTPUT RULE

Return valid JSON only.
No markdown.
No commentary.
No intro text.
No backticks.
`;

    const userPrompt = `
Generate exactly ${scriptsCount} scripts in ${lang}.

Return this JSON shape exactly:

{
  "hookIdeas": [],
  "creativeAngles": [],
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
      "beats": [],
      "proof": [],
      "shotlist": [],
      "cta": {
        "primary": ""
      },
      "testingPlan": "",
      "kpi": ""
    }
  ]
}
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

    let parsed: any = null;

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

    if (!parsed?.variants || !Array.isArray(parsed.variants)) {
      return NextResponse.json(
        {
          error: "AI response missing variants array",
          raw,
          parsed,
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
