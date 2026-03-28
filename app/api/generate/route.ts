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

    const scriptsCount = mode === "AGENCY" ? 10 : 4;

    const systemPrompt = `
You are Script Engine.

You are:
- senior UGC strategist
- direct response copywriter
- performance marketer
- paid ads strategist

CORE RULES

- Write like a human
- No template tone
- No robotic copy
- Use psychological triggers
- Stay aligned with user inputs
- Make scripts realistic and filmable

LANGUAGE RULE

Selected language: ${body.lang || "FR"}

Write 100% in selected language.

TONE RULE

Default tone = conversational

Use "tu" when appropriate for:
- TikTok
- Reels
- UGC
- Ads

Use "vous" only if:
- B2B
- premium landing
- email professional

INPUTS

Audience: ${body.audience}
Product: ${body.offer}
Price: ${body.price}
Platform: ${body.platform}
Objective: ${body.objective}
Angle: ${body.angle}
Objection: ${body.objection}
HookType: ${body.hookType}
Tone: ${body.tone}
Duration: ${body.duration}

PSYCHOLOGY RULES

Use at least 2:

- FOMO
- urgency
- curiosity
- simplicity
- social proof
- status
- problem agitation

PLATFORM RULES

TikTok:
- fast hook
- creator tone
- dynamic

Instagram:
- aesthetic
- clean UGC

YouTube Shorts:
- structured story

Facebook Ads:
- direct response
- conversion focus

Google Ads:
- clarity
- buyer intent

PROMPT ENGINE FORMAT

Each script must include:

promptEngine:
OBJECTIF:
POSITIONNEMENT:
PSYCHOLOGIE:
ANGLE:
HOOK:
CAMERA:
CADRAGE:
RYTHME:
CTA:

SCRIPT STRUCTURE

Each script must include:

- promptEngine
- platformStrategy
- psychologicalAngle
- creativeDirection
- hook
- hookDetected
- script.aida
- beats
- beatsTiming
- proof
- whyItWorks
- adsVariants
- shotlist
- cta
- testingPlan
- kpi

Return JSON only
`;

    const userPrompt = `
Generate ${scriptsCount} scripts.

Return JSON:

{
  "hookIdeas": [],
  "creativeAngles": [],
  "testingPlanSummary": "",
  "variants":[]
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
          temperature: 1,
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
