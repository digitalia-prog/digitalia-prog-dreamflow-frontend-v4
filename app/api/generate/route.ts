import { NextResponse } from "next/server";

type Body = {
  mode?: "AGENCY" | "CREATOR";
  lang?: "fr" | "en-GB" | "en-US" | "es" | "ar";
  platform?: string;
  objective?: string;
  audience?: string;
  offer?: string;
  price?: string;
  angle?: string;
  objection?: string;
  hookType?: string;
  tone?: string;
  duration?: string;
  context?: string;
  scriptsCount?: number;
};

function extractTextFromResponsesApi(data: any): string {
  const directText = data?.output_text;
  if (typeof directText === "string" && directText.trim()) return directText;

  const output = data?.output ?? [];
  for (const item of output) {
    const content = item?.content ?? [];
    for (const c of content) {
      if (c?.type === "output_text" && typeof c?.text === "string") {
        return c.text;
      }
    }
  }

  return "";
}

function extractJson(text: string) {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {}

  const match = trimmed.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("Impossible de parser le JSON renvoyé par l'IA.");
  }

  return JSON.parse(match[0]);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY in environment variables." },
        { status: 500 }
      );
    }

    const mode = body.mode === "CREATOR" ? "CREATOR" : "AGENCY";
    const scriptsCount =
      typeof body.scriptsCount === "number"
        ? body.scriptsCount
        : mode === "AGENCY"
        ? 10
        : 4;

    const lang = body.lang || "fr";
    const platform = body.platform || "TikTok";
    const objective = body.objective || "Vente";
    const audience = body.audience || "E-commerçants sur TikTok";
    const offer = body.offer || "Produit / offre";
    const price = body.price || "";
    const angle = body.angle || "";
    const objection = body.objection || "";
    const hookType = body.hookType || "";
    const tone = body.tone || "";
    const duration = body.duration || "30s";
    const context = body.context || "";

    const systemPrompt = `
You are an elite UGC direct-response script engine for short-form ads.

Your goal is to generate SELLABLE product scripts.

COUNT RULES
- Return exactly ${scriptsCount} variants.

QUALITY RULES
- Focus ONLY on selling the product.
- Never mention scripts, SaaS, tools, or marketing engines.
- Hooks must stop scrolling.
- Scripts must sound like a real creator talking.
- Every section must contain real content.
- Never leave beats empty.
- Never leave proof empty.
- Always generate a CTA.
- Beats must describe the video progression.
- Proof must include credibility (reviews, results, comparison).
- CTA must push to click, buy, or order now.

RETURN FORMAT (JSON ONLY):

{
 "variants":[
  {
   "name":"A",
   "hook":"string",
   "script":{
     "aida":{
       "attention":"string",
       "interest":"string",
       "desire":"string",
       "action":"string"
     }
   },
   "beats":["string","string","string"],
   "proof":["string","string"],
   "shotlist":["string","string","string"],
   "cta":{"primary":"string"}
  }
 ]
}
`;

    const userPrompt = `
Generate ${scriptsCount} high-converting UGC ad variants.

MODE: ${mode}
LANGUAGE: ${lang}
PLATFORM: ${platform}
OBJECTIVE: ${objective}
AUDIENCE: ${audience}
PRODUCT: ${offer}
PRICE: ${price}
ANGLE: ${angle}
OBJECTION: ${objection}
HOOK TYPE: ${hookType}
TONE: ${tone}
DURATION: ${duration}
CONTEXT: ${context}
`;

    const openaiRes = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: \`Bearer \${apiKey}\`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.9,
      }),
    });

    const openaiData = await openaiRes.json();

    if (!openaiRes.ok) {
      return NextResponse.json(
        {
          error: "OpenAI request failed.",
          details:
            openaiData?.error?.message ||
            JSON.stringify(openaiData) ||
            "Unknown OpenAI error",
        },
        { status: 500 }
      );
    }

    const raw = extractTextFromResponsesApi(openaiData);

    if (!raw) {
      return NextResponse.json(
        { error: "OpenAI returned an empty response." },
        { status: 500 }
      );
    }

    let parsed = extractJson(raw);

    if (!Array.isArray(parsed?.variants)) {
      throw new Error("Réponse IA invalide: variants manquant.");
    }

    parsed.variants = parsed.variants.slice(0, scriptsCount);

    return NextResponse.json({
      ok: true,
      raw,
      parsed,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Server error",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
