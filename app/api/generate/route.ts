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

Write realistic short-form scripts for creators.

Rules:
- Natural spoken language
- No corporate marketing tone
- Short sentences
- Sounds like a creator speaking to camera

Each script must contain:

HOOK
SCRIPT (AIDA)
BEATS
PROOF
SHOTLIST
CTA

Generate ${scriptsCount} scripts.

Hooks must be scroll stopping.
Scripts must be realistic and filmable.
`;

    const userPrompt = `
Create ${scriptsCount} scripts.

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

Language: ${lang}
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
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      }
    );

    const data = await response.json();

    const raw =
      data?.choices?.[0]?.message?.content ||
      "Script generation failed";

    return NextResponse.json({
      raw,
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
