import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY" },
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
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 🔒 Sécurité taille (important pour Vercel)
    if (file.size > 4_000_000) {
      return NextResponse.json(
        { error: "Fichier trop lourd (max 4MB sur Vercel)" },
        { status: 400 }
      );
    }

    // 🎧 TRANSCRIPTION AUDIO / VIDEO
    const audioForm = new FormData();
    audioForm.append("file", file);
    audioForm.append("model", "gpt-4o-mini-transcribe");

    const transcriptionRes = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: audioForm,
      }
    );

    const transcriptionData = await transcriptionRes.json();

    if (!transcriptionRes.ok) {
      return NextResponse.json(
        {
          error: "Transcription failed",
          details: transcriptionData?.error?.message,
        },
        { status: 500 }
      );
    }

    const transcript = transcriptionData?.text || "";

    if (!transcript) {
      return NextResponse.json(
        { error: "Transcript vide" },
        { status: 400 }
      );
    }

    // 🧠 ANALYSE MARKETING PRO
    const analysisRes = await fetch(
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
            {
              role: "system",
              content: `
Tu es un expert en marketing UGC.

RÈGLES :
- Tu n'inventes rien
- Tu analyses uniquement ce qui est dit dans l'audio
- Si c'est flou → tu le dis
- Tu donnes une analyse exploitable pour vendre
- Réponse en FRANÇAIS
- JSON uniquement
              `,
            },
            {
              role: "user",
              content: `
Plateforme: ${platform}
Produit: ${offer}
Audience: ${audience}

Transcript:
${transcript}

Notes:
${extraNotes}

Donne une analyse :

{
  "summary": "",
  "hook": "",
  "structure": "",
  "angle": "",
  "psychology": [],
  "strengths": [],
  "weaknesses": [],
  "recreateIdeas": [],
  "similarHooks": [],
  "similarAngles": [],
  "scriptPrompt": ""
}
              `,
            },
          ],
        }),
      }
    );

    const analysisData = await analysisRes.json();

    if (!analysisRes.ok) {
      return NextResponse.json(
        {
          error: "Analyse failed",
          details: analysisData?.error?.message,
        },
        { status: 500 }
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(
        analysisData?.choices?.[0]?.message?.content || "{}"
      );
    } catch (err) {
      return NextResponse.json(
        {
          error: "JSON parsing error",
          raw: analysisData,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      transcript,
      ...parsed,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Server error",
        details: error?.message,
      },
      { status: 500 }
    );
  }
}
