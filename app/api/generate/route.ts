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
      context
    } = body;

    const scriptsCount = mode === "AGENCY" ? 10 : 4;

    const systemPrompt = `
You are a senior UGC marketing strategist and direct response copywriter.

Your task is to generate high performing marketing scripts used for social ads and UGC creators.

The scripts must be realistic, creative and natural.

Never generate template content.
Never repeat structures.
Every script must feel like it was written by a different creator.

Each script must follow this structure:

HOOK
SCRIPT (AIDA framework)
BEATS
PROOF
SHOTLIST
CTA
TEST PLAN
KPI

Important rules:

Avoid generic marketing phrases.
Avoid repetitive patterns.
Avoid corporate tone.
Write like real creators speaking to camera.
Use natural spoken language.

Each script must feel authentic and different.

The main objection must appear in the script and be answered.

Main objection:
${objection}

Platform adaptation rules:

If platform = TikTok or Instagram Reels or YouTube Shorts:
- Write like a creator speaking to camera
- Natural UGC tone
- Fast hook
- Authentic storytelling

If platform = Facebook Ads:
- UGC + product demo
- Problem → solution
- Clear benefits

If platform = Google Ads:
- Direct response style
- Immediate product benefit
- No slow storytelling
- Focus on conversion

If platform = Landing Page:
- Story driven
- Explain problem then solution
- Build trust

If platform = Email:
- Curiosity hook
- Persuasive copy
- Strong CTA

Agency mode → generate 10 completely different scripts
Creator mode → generate 4 scripts

Each script must include:

HOOK
SCRIPT (AIDA)
BEATS (3 scenes)
PROOF
SHOTLIST
CTA
TEST PLAN
KPI

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

Make the scripts realistic and usable by creators filming ads.
`;

    const userPrompt = `
Generate ${scriptsCount} scripts.

Language: ${lang}

Return JSON format:

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

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        temperature: 0.9,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ]
      })
    });

    const data = await response.json();

    const raw = data?.choices?.[0]?.message?.content || "";

    let parsed = null;

    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = null;
    }

    return NextResponse.json({
      raw,
      parsed
    });

  } catch (error: any) {

    return NextResponse.json(
      {
        error: "Script generation failed",
        details: error?.message || "unknown error"
      },
      { status: 500 }
    );
  }
}

