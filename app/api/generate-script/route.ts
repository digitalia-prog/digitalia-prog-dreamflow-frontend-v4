import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const prompt = `
Tu es un expert TikTok Ads.

À partir de cette analyse, génère un script UGC prêt à tourner.

Analyse:
${JSON.stringify(body.analysis)}

Donne :
- Hook
- Script complet
- CTA
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();

    return NextResponse.json({
      script: data.choices[0].message.content,
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Erreur génération script" },
      { status: 500 }
    );
  }
}
