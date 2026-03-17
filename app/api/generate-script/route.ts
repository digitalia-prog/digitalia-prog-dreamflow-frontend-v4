import { NextResponse } from "next/server";

type Body = {
  analysis?: any;
  platform?: string;
  offer?: string;
  audience?: string;
  notes?: string;
  url?: string;
};

export async function POST(req: Request) {
  try {
    const body: Body = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY in environment variables." },
        { status: 500 }
      );
    }

    if (!body.analysis) {
      return NextResponse.json(
        { error: "Missing analysis payload." },
        { status: 400 }
      );
    }

    const prompt = `
Tu es un expert TikTok Ads / UGC / direct response.

À partir de cette analyse, génère un script UGC prêt à tourner, concret, naturel, vendeur et fluide.

Contexte :
Plateforme: ${body.platform || ""}
Produit / Offre: ${body.offer || ""}
Audience: ${body.audience || ""}
Lien: ${body.url || ""}
Transcript d'origine: ${body.notes || ""}

Analyse:
${JSON.stringify(body.analysis, null, 2)}

Donne une réponse en français avec cette structure :
1. Hook
2. Script complet
3. Beats
4. CTA

Le script doit être naturel, humain, tournable, pas robotique.
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.8,
        messages: [{ role: "user", content: prompt }],
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

    return NextResponse.json({
      script: data?.choices?.[0]?.message?.content || "",
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
}=
