import { NextResponse } from "next/server";

type AnalyzeBody = {
  url?: string;
  platform?: string;
  notes?: string;
  offer?: string;
  audience?: string;
};

export async function POST(req: Request) {
  try {
    const body: AnalyzeBody = await req.json();

    const url = body.url || "";
    const platform = body.platform || "TikTok";
    const notes = body.notes || "";
    const offer = body.offer || "";
    const audience = body.audience || "";

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: "Missing OPENAI_API_KEY in environment variables.",
        },
        { status: 500 }
      );
    }

    if (!notes.trim()) {
      return NextResponse.json(
        {
          error:
            "Ajoute le transcript, le script parlé ou la description de la vidéo pour une vraie analyse.",
        },
        { status: 400 }
      );
    }

    const systemPrompt = `
You are a senior UGC ads strategist, direct-response creative analyst, and performance marketing expert.

Your role:
Analyze a short-form ad, UGC video, or social ad based on the provided transcript, spoken script, description, and contextual inputs.

IMPORTANT HONESTY RULE
- If only partial information is available, explicitly say that the analysis is based only on the provided transcript/notes.
- Do not pretend you watched the video from the link alone.
- Do not invent visual details unless they are strongly implied by the transcript/notes.

LANGUAGE RULE
- Detect the language of the user's input using notes, offer, and audience.
- Respond ONLY in that same language.
- If the user writes in French, respond 100% in French.
- If the user writes in English, respond 100% in English.
- If the user writes in Spanish, respond 100% in Spanish.
- If the user writes in Arabic, respond 100% in Arabic.
- Never switch language in the same answer.
- Keep field labels and content naturally written in that same language.

YOUR ANALYSIS MUST BE USEFUL FOR:
- TikTok advertisers
- Meta advertisers
- e-commerce founders
- agencies
- UGC creators

ANALYZE:
1. Main hook
2. Video structure
3. Main marketing angle
4. Buyer psychology used
5. Strengths
6. Weaknesses
7. Ideas to improve or recreate the concept
8. Similar hooks to test
9. Similar angles to test
10. A practical creative brief to produce a similar but stronger ad

STYLE RULES
- Be concrete
- Be practical
- Be strategic
- Be concise but useful
- Avoid fluff
- Use marketer language, not academic language
- Make the hook analysis specific, not generic
- Make the psychology analysis precise, not vague
- When possible, explain the mechanism behind why the ad works

OUTPUT RULE
Return valid JSON only.
No markdown.
No code fences.
No intro text.
`;

    const userPrompt = `
Analyze this ad/video using the information below.

Platform: ${platform}
Video URL: ${url}
Product / Offer: ${offer}
Audience: ${audience}

Transcript / script / description:
${notes}

Return this exact JSON shape:
{
  "summary": "",
  "hook": "",
  "structure": "",
  "angle": "",
  "psychology": ["", ""],
  "strengths": ["", ""],
  "weaknesses": ["", ""],
  "recreateIdeas": ["", ""],
  "similarHooks": ["", ""],
  "similarAngles": ["", ""],
  "scriptPrompt": ""
}

RULES
- summary: 2 to 4 lines max
- hook: identify the core opening mechanism in a useful, specific way
- structure: describe the ad flow clearly
- angle: the main selling angle
- psychology: array of buyer/emotional triggers used
- strengths: array of what works well
- weaknesses: array of what is weak or missing
- recreateIdeas: array of practical improvements or recreations
- similarHooks: array of fresh hook ideas inspired by the analysis
- similarAngles: array of new marketing angles to test
- scriptPrompt: a short but practical brief to create a stronger similar ad
- The full answer must be in the detected language of the user's input
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
        temperature: 0.7,
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
      summary: typeof parsed?.summary === "string" ? parsed.summary : "",
      hook: typeof parsed?.hook === "string" ? parsed.hook : "",
      structure: typeof parsed?.structure === "string" ? parsed.structure : "",
      angle: typeof parsed?.angle === "string" ? parsed.angle : "",
      psychology: Array.isArray(parsed?.psychology) ? parsed.psychology : [],
      strengths: Array.isArray(parsed?.strengths) ? parsed.strengths : [],
      weaknesses: Array.isArray(parsed?.weaknesses) ? parsed.weaknesses : [],
      recreateIdeas: Array.isArray(parsed?.recreateIdeas)
        ? parsed.recreateIdeas
        : [],
      similarHooks: Array.isArray(parsed?.similarHooks)
        ? parsed.similarHooks
        : [],
      similarAngles: Array.isArray(parsed?.similarAngles)
        ? parsed.similarAngles
        : [],
      scriptPrompt:
        typeof parsed?.scriptPrompt === "string" ? parsed.scriptPrompt : "",
      raw,
      parsed,
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
