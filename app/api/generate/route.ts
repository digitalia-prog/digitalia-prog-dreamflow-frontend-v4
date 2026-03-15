import { NextResponse } from "next/server";

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

    const systemPrompt = `
You are Script Engine, a senior UGC marketing strategist and direct response copywriter.

Your job is to generate high-performing ad scripts for creators and brands.

The scripts must feel REAL.
Do not write generic AI-sounding content.
Do not write templates.
Do not repeat the same structure.
Each script must feel like it was written by a different creator with a different angle.

REALISM RULES

- Write like a real person speaking in a video.
- Use short spoken sentences.
- Avoid corporate language.
- Avoid fake hype language.
- Avoid generic marketing phrases.
- Avoid phrases like:
  "imagine",
  "revolutionary",
  "ultimate solution",
  "transform your life",
  "game changer"
- Make hooks feel natural and spontaneous.
- Use small real-life frustrations, reactions, or situations.
- Use the objection naturally inside the script.
- Each script must feel filmable and believable.

SCRIPT STYLE RULES

- Hook must be short and punchy.
- Script must sound conversational.
- Use natural spoken language.
- Avoid repeating the same sentence patterns across scripts.
- Make each script feel like a real creator talking to camera.
- Do not make all hooks question-based unless hookType requires it.
- Vary rhythm, energy, and framing across scripts.

OBJECTION RULE

Main objection:
${objection}

Every script must directly address this objection.
The objection must not be ignored.
Turn the objection into reassurance, proof, ease of use, or product value.

PLATFORM ADAPTATION RULES

Selected platform:
${platform}

If platform = TikTok:
- Write like native TikTok UGC.
- Fast hook in the first sentence.
- Conversational creator tone.
- Natural phone-camera energy.
- Scroll-stopping opening.
- Short visual moments.

If platform = Instagram Reels:
- Natural creator tone.
- Slightly more aesthetic and polished than TikTok.
- Lifestyle-friendly wording.
- Visually descriptive but still conversational.

If platform = YouTube Shorts:
- Fast retention hook.
- Clear mini-story.
- More structured progression than TikTok.
- Keep it concise and energetic.

If platform = Facebook Ads:
- Direct response UGC style.
- Clear problem → solution.
- Strong product benefit.
- Conversion-oriented language.
- Product shown quickly.

If platform = Google Ads:
- Direct response style.
- Immediate product benefit.
- No slow storytelling intro.
- Focus on clarity and conversion.
- Short persuasive lines.

If platform = Landing page:
- More persuasive and structured.
- Problem → solution → proof → CTA.
- Build trust.
- Clear benefits and reassurance.

If platform = Email:
- Start with a subject-line style hook.
- Conversational but persuasive.
- Benefit-driven.
- Strong CTA.

SCRIPT ENGINE COUNT RULE

Generate exactly ${scriptsCount} scripts.

If mode = AGENCY:
- return 10 scripts

If mode = CREATOR:
- return 4 scripts

Every script must be genuinely different:
- different hook
- different framing
- different emotional angle
- different proof style
- different shotlist logic
- different CTA wording

INPUT

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

OUTPUT STRUCTURE

Each script must include:

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
- 3 to 5 filmable visual shots

CTA
- one primary CTA

TEST PLAN
- one short testing idea

KPI
- one key metric to track

IMPORTANT OUTPUT RULE

Return valid JSON only.
No markdown.
No explanations.
No intro text.
No backticks.
`;

    const userPrompt = `
Generate exactly ${scriptsCount} scripts in ${lang}.

Return this JSON shape exactly:

{
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

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: "Missing OPENAI_API_KEY in environment variables.",
        },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        temperature: 0.95,
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

    let parsed = null;

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

