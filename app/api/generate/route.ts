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
      context
    } = body;

    const scriptsCount = mode === "AGENCY" ? 10 : 4;

    const systemPrompt = `
You are a professional UGC script strategist.

You generate short-form video scripts for creators and marketing agencies.

The scripts must sound like REAL PEOPLE speaking to camera.

IMPORTANT RULES

• No corporate tone
• No generic ad language
• Use short spoken sentences
• Sound like a creator filming a reel
• Every script must be different

Each script must contain:

HOOK
SCRIPT (spoken AIDA style)
BEATS
PROOF
SHOTLIST
CTA

Also generate:

HOOK IDEAS
CREATIVE ANGLES
TESTING PLAN

HOOK IDEAS
Generate 10 scroll-stopping hooks.

CREATIVE ANGLES
Generate 3 different marketing angles.

SCRIPT
Natural spoken style.
UGC creator style.

BEATS
Key moments of the video.

PROOF
Credibility or social proof.

SHOTLIST
What the creator films.

CTA
Short natural call to action.

TESTING PLAN
Explain how to test hooks in ads or organic posts.

Return everything in clear readable text.
`;

    const userPrompt = `
Create ${scriptsCount} different UGC scripts.

PLATFORM
${platform}

OBJECTIVE
${objective}

PRODUCT
${offer}

PRICE
${price}

TARGET AUDIENCE
${audience}

MARKETING ANGLE
${angle}

MAIN OBJECTION
${objection}

HOOK TYPE
${hookType}

TONE
${tone}

VIDEO LENGTH
${duration}

LANGUAGE
${lang}

CONTEXT
${context}

IMPORTANT

Scripts must be realistic and filmable.

Adapt everything to the selected platform.

Example:
TikTok / Reels → casual creator tone
Google Ads → persuasive
Landing page → explanatory
Email → storytelling
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
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userPrompt
          }
        ]
      })
    });

    const data = await response.json();

    const raw =
      data?.choices?.[0]?.message?.content ||
      "Script generation failed";

    return NextResponse.json({
      raw
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

