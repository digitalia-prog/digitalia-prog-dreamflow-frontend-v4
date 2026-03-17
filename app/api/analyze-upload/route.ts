import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY in environment variables." },
        { status: 500 }
      );
    }

    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const platform = String(formData.get("platform") || "TikTok");
    const offer = String(formData.get("offer") || "");
    const audience = String(formData.get("audience") || "");
    const extraNotes = String(formData.get("extraNotes") || "");

    if (!file) {
      return NextResponse.json(
        { error: "Missing file." },
        { status: 400 }
      );
    }

    const transcriptionForm = new FormData();
    transcriptionForm.append("file", file);
    transcriptionForm.append("model", "gpt-4o-mini-transcribe");

    const transcriptionResponse = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: transcriptionForm,
      }
    );

    const transcriptionData = await transcriptionResponse.json();

    if (!transcriptionResponse.ok) {
      return NextResponse.json(
        {
          error: "OpenAI transcription failed",
          details:
            transcriptionData?.error?.message || "Unknown transcription error",
        },
        { status: 500 }
      );
    }

    const transcript = transcriptionData?.text || "";

    if (!transcript.trim()) {
      return NextResponse.json(
        {
          error: "Transcript is empty.",
        },
        { status: 400 }
      );
    }

    const systemPrompt = `
You are a senior UGC ads strategist, direct-response creative analyst, and performance marketing expert.

LANGUAGE RULE
- Detect the language of the transcript and extra notes.
- Respond ONLY in that same language.
- Never switch language.

HONESTY RULE
- You are analyzing the content based on the real transcript plus optional notes.
- Do not invent visual details unless strongly implied by the words.
- If some parts are unclear, say so honestly.

YOUR JOB
Analyze the content like a real agency strategist.

Return useful, practical, marketer-grade analysis.

Return valid JSON only.
No markdown.
No code fences.
No intro text.
`;

    const userPrompt = `
Analyze this video/audio content.

Platform: ${platform}
Product / Offer: ${offer}
Audience: ${audience}

Transcript:
${transcript}

Extra notes:
${extraNotes}

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
- summary: concise but useful
- hook: specific and directly usable
- structure: explain the flow clearly
- angle: real marketing promise
- psychology: precise emotional / persuasive mechanisms
- strengths: what works
- weaknesses: what is missing or weak
- recreateIdeas: practical ways to remake or improve
- similarHooks: 3 to 5 hooks
- similarAngles: 3 angles
- scriptPrompt: short but actionable creative brief
- respond in the same language as the user content
- JSON only
`;

    const analysisResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
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
      }
    );

    const analysisData = await analysisResponse.json();

    if (!analysisResponse.ok) {
      return NextResponse.json(
        {
          error: "OpenAI analysis failed",
          details: analysisData?.error?.message || "Unknown analysis error",
        },
        { status: 500 }
      );
    }

    const raw = analysisData?.choices?.[0]?.message?.content || "";

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
      transcript,
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
