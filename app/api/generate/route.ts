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
    const scriptsCount = mode === "AGENCY" ? 10 : 4;

    const lang = body.lang || "fr";
    const platform = body.platform || "TikTok";
    const objective = body.objective || "Vente";
    const audience = body.audience || "E-commerçants";
    const offer = body.offer || "Produit";
    const price = body.price || "";
    const angle = body.angle || "";
    const objection = body.objection || "";
    const hookType = body.hookType || "";
    const tone = body.tone || "";
    const duration = body.duration || "30s";
    const context = body.context || "";

    const systemPrompt = `
You are an elite UGC direct response script generator.

Generate SELLABLE short form video ads.

RULES
- Focus only on selling the product.
- Never mention scripts, SaaS, marketing tools.
- Hooks must stop scrolling.
- Scripts must feel natural and credible.

Return exactly ${scriptsCount} variants.

Every variant must contain:

HOOK
SCRIPT (AIDA)
BEATS
PROOF
SHOTLIST
CTA

JSON FORMAT ONLY

{
 "variants":[
  {
   "name":"A",
   "hook":"",
   "script":{
     "aida":{
       "attention":"",
       "interest":"",
       "desire":"",
       "action":""
     }
   },
   "beats":["","",""],
   "proof":["",""],
   "shotlist":["","",""],
   "cta":{"primary":""}
  }
 ]
}
`;

    const userPrompt = `
Generate ${scriptsCount} UGC ad scripts.

MODE: ${mode}
LANGUAGE: ${lang}
PLATFORM: ${platform}
OBJECTIVE: ${objective}

PRODUCT: ${offer}
PRICE: ${price}

AUDIENCE: ${audience}

ANGLE: ${angle}

OBJECTION: ${objection}

HOOK TYPE: ${hookType}

TONE: ${tone}

VIDEO DURATION: ${duration}

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
        temperature: 0.9,
        max_output_tokens: 6000,
        input: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    const openaiData = await openaiRes.json();

    if (!openaiRes.ok) {
      return NextResponse.json(
        {
          error: "OpenAI request failed",
          details: openaiData,
        },
        { status: 500 }
      );
    }

    const raw = extractTextFromResponsesApi(openaiData);

    if (!raw) {
      return NextResponse.json(
        { error: "OpenAI returned empty response" },
        { status: 500 }
      );
    }

    const parsed = extractJson(raw);

    if (!Array.isArray(parsed?.variants)) {
      throw new Error("Invalid AI response");
    }

    const normalized = parsed.variants.slice(0, scriptsCount).map((v: any, i: number) => ({
      name: v?.name || String.fromCharCode(65 + i),
      hook: v?.hook || "Tu veux découvrir ce produit ?",
      script: {
        aida: {
          attention: v?.script?.aida?.attention || "Voici le problème.",
          interest: v?.script?.aida?.interest || "Voici pourquoi ce produit est intéressant.",
          desire: v?.script?.aida?.desire || "Voici pourquoi tu vas le vouloir.",
          action: v?.script?.aida?.action || "Clique pour commander maintenant."
        }
      },
      beats: v?.beats?.length ? v.beats : [
        "Présentation du problème",
        "Démonstration produit",
        "Décision d'achat"
      ],
      proof: v?.proof?.length ? v.proof : [
        "Démonstration produit",
        "Résultat visible"
      ],
      shotlist: v?.shotlist?.length ? v.shotlist : [
        "Plan produit",
        "Plan démonstration",
        "Plan final"
      ],
      cta: {
        primary: v?.cta?.primary || "Clique sur le lien pour commander maintenant."
      }
    }));

    return NextResponse.json({
      ok: true,
      raw,
      parsed: {
        variants: normalized
      }
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
