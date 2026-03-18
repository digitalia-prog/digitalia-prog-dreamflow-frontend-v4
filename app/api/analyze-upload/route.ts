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

    const file = formData.get("file");
    const platform = String(formData.get("platform") || "TikTok");
    const offer = String(formData.get("offer") || "");
    const audience = String(formData.get("audience") || "");
    const extraNotes = String(formData.get("extraNotes") || "");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No valid file uploaded." },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { error: "Uploaded file is empty." },
        { status: 400 }
      );
    }

    const allowedMime = [
      "audio/mpeg",
      "audio/mp3",
      "audio/mp4",
      "audio/x-m4a",
      "audio/wav",
      "audio/webm",
      "audio/ogg",
      "video/mp4",
      "video/webm",
      "video/quicktime",
      "video/mpeg",
    ];

    if (file.type && !allowedMime.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Unsupported file type: ${file.type}`,
          details:
            "Use mp3, mp4, m4a, wav, ogg, webm or a compatible audio/video file.",
        },
        { status: 400 }
      );
    }

    const transcriptionForm = new FormData();
    transcriptionForm.append("file", file, file.name || "upload.mp4");
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

    const transcriptionText = await transcriptionResponse.text();

    let transcriptionData: any = null;
    try {
      transcriptionData = JSON.parse(transcriptionText);
    } catch {
      transcriptionData = null;
    }

    if (!transcriptionResponse.ok) {
      return NextResponse.json(
        {
          error: "Audio transcription failed",
          details:
            transcriptionData?.error?.message ||
            transcriptionText ||
            "Unknown transcription error",
          openai_status: transcriptionResponse.status,
        },
        { status: 500 }
      );
    }

    const transcript = transcriptionData?.text || "";

    if (!transcript.trim()) {
      return NextResponse.json(
        {
          error: "Transcript is empty",
          details:
            "The file was received, but no usable speech transcript was returned.",
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
- Analyze only what is supported by the transcript and notes.
- Do not invent fake visual details.
- If the content is not clearly promotional, say so honestly.

OUTPUT
Return valid JSON only.
No markdown.
No code fences.
No intro text.
`;

    const userPrompt = `
Analyze this audio/video transcript like a real marketing strategist.

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

Rules:
- If the content is not really an ad, say it clearly.
- Be useful and concrete.
- hook: explain the opening mechanism precisely
- structure: describe the content flow
- angle: explain the content angle honestly
- psychology: real emotional/cognitive mechanisms
- strengths: what works
- weaknesses: what is missing
- recreateIdeas: practical ideas only
- similarHooks: 3 to 5 ideas
- similarAngles: 3 ideas
- scriptPrompt: useful short brief
- Same language as the user/transcript
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
          temperature: 0.6,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      }
    );

    const analysisText = await analysisResponse.text();

    let analysisData: any = null;
    try {
      analysisData = JSON.parse(analysisText);
    } catch {
      analysisData = null;
    }

    if (!analysisResponse.ok) {
      return NextResponse.json(
        {
          error: "Marketing analysis failed",
          details:
            analysisData?.error?.message ||
            analysisText ||
            "Unknown analysis error",
          openai_status: analysisResponse.status,
        },
        { status: 500 }
      );
    }

    const raw = analysisData?.choices?.[0]?.message?.content || "";

    let parsed: any = {};
    try {
      parsed = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        {
          error: "Failed to parse AI JSON response",
          details: raw || "Empty model response",
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
