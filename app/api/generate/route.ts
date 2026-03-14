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

CRITICAL RULES
- Focus ONLY on selling the product.
- NEVER mention scripts.
- NEVER mention SaaS.
- NEVER mention dashboard, AI tools, or marketing tools.
- Hooks must stop scrolling.
- Scripts must sound like a real creator talking naturally.
- Use the user's language.
- Every variant must be genuinely different.

COUNT RULES
- Return exactly ${scriptsCount} variants.
- If mode = AGENCY, return 10 variants.
- If mode = CREATOR, return 4 variants.

SECTION RULES
- Never leave beats empty.
- Never leave proof empty.
- Never leave CTA empty.
- Beats must describe the progression of the video.
- Proof must include credibility, comparison, trust, demo, result, or buyer reassurance.
- Shotlist must contain concrete visual shots.
- CTA must clearly push to click, buy, order, or try now.

RETURN FORMAT
Return valid JSON only.
No markdown.
No explanation.

Use exactly this schema:

{
  "variants": [
    {
      "name": "A",
      "hook": "string",
      "script": {
        "aida": {
          "attention": "string",
          "interest": "string",
          "desire": "string",
          "action": "string"
        }
      },
      "beats": ["string", "string", "string"],
      "proof": ["string", "string"],
      "shotlist": ["string", "string", "string"],
      "cta": {
        "primary": "string"
      }
    }
  ]
}
`;

    const userPrompt = `
Generate ${scriptsCount} high-converting UGC ad variants for this product.

MODE: ${mode}
LANGUAGE: ${lang}
PLATFORM: ${platform}
OBJECTIVE: ${objective}
AUDIENCE: ${audience}
PRODUCT: ${offer}
PRICE: ${price}
ANGLE MARKETING: ${angle}
MAIN OBJECTION: ${objection}
HOOK TYPE: ${hookType}
TONE: ${tone}
DURATION: ${duration}
CONTEXT: ${context}

STRICT INSTRUCTIONS
- Sell the product only.
- Make the scripts feel natural, filmable, emotional, and credible.
- Fill all AIDA sections with real content.
- Beats must explain the story progression of the video.
- Proof must include believable trust elements.
- Shotlist must be concrete and visual.
- CTA must be direct and purchase-oriented.
`;

    const openaiRes = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
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

    parsed.variants = parsed.variants
      .slice(0, scriptsCount)
      .map((v: any, index: number) => ({
        name: v?.name || String.fromCharCode(65 + index),
        hook: v?.hook || "Tu veux un produit qui fait vraiment la différence ?",
        script: {
          aida: {
            attention:
              v?.script?.aida?.attention ||
              "Voici le problème que ce produit résout immédiatement.",
            interest:
              v?.script?.aida?.interest ||
              "Ce produit apporte un vrai avantage concret au quotidien.",
            desire:
              v?.script?.aida?.desire ||
              "Tu gagnes en confort, en style et en simplicité d'utilisation.",
            action:
              v?.script?.aida?.action ||
              "Clique maintenant pour le commander avant qu'il n'y en ait plus.",
          },
        },
        beats:
          Array.isArray(v?.beats) && v.beats.filter(Boolean).length > 0
            ? v.beats.filter(Boolean)
            : [
                "Ouverture sur le problème ou la frustration du client",
                "Démonstration du produit en situation réelle",
                "Moment de persuasion juste avant l'appel à l'action",
              ],
        proof:
          Array.isArray(v?.proof) && v.proof.filter(Boolean).length > 0
            ? v.proof.filter(Boolean)
            : [
                "Démonstration concrète du produit en action",
                "Élément de réassurance ou bénéfice visible immédiatement",
              ],
        shotlist:
          Array.isArray(v?.shotlist) && v.shotlist.filter(Boolean).length > 0
            ? v.shotlist.filter(Boolean)
            : [
                "Gros plan sur le produit en main",
                "Démonstration du produit en usage réel",
                "Plan final lifestyle ou réaction utilisateur",
              ],
        cta: {
          primary:
            v?.cta?.primary ||
            "Clique sur le lien pour commander maintenant avant la rupture de stock.",
        },
      }));

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
