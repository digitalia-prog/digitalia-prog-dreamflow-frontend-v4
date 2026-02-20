import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Body = {
  mode: string;
  lang: string;
  platform: string;
  hookType: string;
  duration: string;
  tone: string;
  offer?: string;
  audience?: string;
  problem?: string;
  solution?: string;
  proof?: string;
  cta?: string;
  hak?: string;
};

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY manquante" },
        { status: 500 }
      );
    }

    const body = (await req.json()) as Body;

    const prompt = `
Tu es un expert script TikTok/Reels.

Crée un script viral structuré :

HOOK:
STORY:
PROBLÈME:
TWIST:
SOLUTION:
PREUVE:
CTA:

Infos:
Mode: ${body.mode}
Plateforme: ${body.platform}
Hook: ${body.hookType}
Durée: ${body.duration}
Ton: ${body.tone}
Offre: ${body.offer}
Audience: ${body.audience}
Problème: ${body.problem}
Solution: ${body.solution}
Preuve: ${body.proof}
CTA: ${body.cta}
HAK: ${body.hak}
`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();

    const output =
      data?.choices?.[0]?.message?.content || "Erreur génération";

    return NextResponse.json({ output });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Server error", details: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}
