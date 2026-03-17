import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { url, transcript, product, audience } = body;

    // 👉 Ton prompt amélioré
    const systemPrompt = `
You are a senior direct-response creative strategist working in a high-performance TikTok Ads agency.

Respond ONLY in the user's language.

Analyze deeply and return JSON with:
summary, hook, structure, angle, psychology, strengths, weaknesses, recreateIdeas, similarHooks, similarAngles, scriptPrompt
`;

    // 👉 appel OpenAI (simplifié pour éviter crash)
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `
Analyse cette vidéo:

URL: ${url}
Transcript: ${transcript}
Produit: ${product}
Audience: ${audience}
            `,
          },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    return NextResponse.json({
      result: JSON.parse(data.choices[0].message.content),
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
