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
  if (typeof data?.output_text === "string" && data.output_text.trim()) {
    return data.output_text;
  }

  const output = Array.isArray(data?.output) ? data.output : [];
  for (const item of output) {
    const content = Array.isArray(item?.content) ? item.content : [];
    for (const part of content) {
      if (part?.type === "output_text" && typeof part?.text === "string") {
        return part.text;
      }
    }
  }

  return "";
}

function extractJson(text: string) {
  const trimmed = text.trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("Impossible de parser le JSON renvoyé par l'IA.");
    }
    return JSON.parse(match[0]);
  }
}

function cleanArray(value: any, fallback: string[]) {
  if (!Array.isArray(value)) return fallback;
  const cleaned = value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);

  return cleaned.length > 0 ? cleaned : fallback;
}

function cleanString(value: any, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function normalizeVariants(parsed: any, scriptsCount: number) {
  if (!Array.isArray(parsed?.variants)) {
    throw new Error("Réponse IA invalide: variants manquant.");
  }

  return parsed.variants.slice(0, scriptsCount).map((v: any, i: number) => {
    return {
      name: cleanString(v?.name, String.fromCharCode(65 + i)),
      hook: cleanString(
        v?.hook,
        "Tu veux découvrir un produit qui change vraiment le quotidien ?"
      ),
      script: {
        aida: {
          attention: cleanString(
            v?.script?.aida?.attention,
            "Voici le problème que ce produit résout immédiatement."
          ),
          interest: cleanString(
            v?.script?.aida?.interest,
            "Ce produit apporte un avantage concret, simple et utile."
          ),
          desire: cleanString(
            v?.script?.aida?.desire,
            "Tu gagnes en confort, en praticité et en tranquillité d'esprit."
          ),
          action: cleanString(
            v?.script?.aida?.action,
            "Clique maintenant pour le commander avant qu'il n'y en ait plus."
          ),
        },
      },
      beats: cleanArray(v?.beats, [
        "Ouverture sur le problème ou la frustration du client",
        "Démonstration du produit en situation réelle",
        "Moment de persuasion juste avant l'appel à l'action",
      ]),
      proof: cleanArray(v?.proof, [
        "Démonstration concrète du produit en action",
        "Élément de réassurance ou bénéfice visible immédiatement",
      ]),
      shotlist: cleanArray(v?.shotlist, [
        "Gros plan sur le produit en main",
        "Plan montrant le produit utilisé en situation réelle",
        "Plan final lifestyle ou réaction utilisateur",
      ]),
      cta: {
        primary: cleanString(
          v?.cta?.primary,
          "Clique sur le lien pour commander maintenant avant la rupture de stock."
        ),
      },
    };
  });
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
Tu es un scriptwriter UGC senior spécialisé en publicité direct-response.

MISSION
Tu génères des scripts UGC qui donnent envie d'acheter le PRODUIT.
Tu ne vends jamais un SaaS, jamais un outil, jamais un script engine.

RÈGLES CRITIQUES
- Réponds en JSON UNIQUEMENT.
- Aucun texte avant ou après le JSON.
- Toutes les variantes doivent être différentes.
- Toutes les sections doivent être remplies.
- Aucun champ vide autorisé.
- Le ton doit être naturel, crédible, filmable, orienté conversion.
- Le hook doit arrêter le scroll.
- Le script doit parler du PRODUIT uniquement.
- Ne mentionne jamais "scripts", "SaaS", "dashboard", "outil marketing", "IA".

NOMBRE DE VARIANTES
- Si mode = AGENCY : exactement 10 variantes.
- Si mode = CREATOR : exactement 4 variantes.
- Ici, tu dois renvoyer exactement ${scriptsCount} variantes.

FORMAT JSON EXACT À RESPECTER
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

DÉFINITION DES CHAMPS
- hook : phrase d'accroche qui stoppe le scroll
- script.aida.attention : problème, tension, douleur, prise de conscience
- script.aida.interest : pourquoi ce produit est intéressant / différent
- script.aida.desire : bénéfices concrets, émotion, envie, projection
- script.aida.action : pousser à agir maintenant
- beats : progression de la vidéo en 3 étapes
- proof : 2 éléments de crédibilité / réassurance / démonstration / preuve
- shotlist : 3 plans précis à filmer
- cta.primary : appel à l'action clair et direct

IMPORTANT
Même si certaines infos utilisateur sont vagues, tu remplis TOUS les champs avec des contenus crédibles.
`;

    const userPrompt = `
Génère ${scriptsCount} scripts UGC.

BRIEF
MODE: ${mode}
LANGUE: ${lang}
PLATEFORME: ${platform}
OBJECTIF: ${objective}
AUDIENCE: ${audience}
OFFRE / PRODUIT: ${offer}
PRIX: ${price}
ANGLE MARKETING: ${angle}
OBJECTION PRINCIPALE: ${objection}
TYPE DE HOOK: ${hookType}
TON: ${tone}
DURÉE: ${duration}
CONTEXTE: ${context}

CONSIGNES
- Vends uniquement le produit.
- Les scripts doivent être tournables immédiatement.
- Les preuves doivent être crédibles.
- Les beats doivent être concrets.
- Le CTA doit pousser à cliquer, commander, acheter, découvrir maintenant.
- Renvoie uniquement le JSON final.
`;

    const openaiRes = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.9,
        max_output_tokens: 6000,
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

    const parsed = extractJson(raw);
    const normalizedVariants = normalizeVariants(parsed, scriptsCount);

    return NextResponse.json({
      ok: true,
      raw,
      parsed: {
        variants: normalizedVariants,
      },
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

