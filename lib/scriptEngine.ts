export type Lang = "fr" | "en-GB" | "en-US" | "es" | "ar";
export type Mode = "CREATOR" | "AGENCY";

export type EngineInput = {
  mode: Mode;
  lang: Lang;
  platform: string;      // TikTok, Reels, YT Shorts, Ads...
  objective: string;     // Vente, Lead, Notoriété...
  audience: string;      // Avatar
  offer: string;         // Offre / produit
  price?: string;        // Prix si utile
  angle: string;         // Angle marketing
  objection: string;     // Objection principale
  hookType: string;      // Question choc, Stat, Avant/Après...
  tone: string;          // UGC naturel, premium, agressif...
  duration: string;      // 15s, 30s, 45s...
  context?: string;      // détails optionnels
};

function langLabel(l: Lang) {
  if (l === "fr") return "Français";
  if (l === "en-GB") return "English (UK)";
  if (l === "en-US") return "English (US)";
  if (l === "es") return "Español";
  return "العربية";
}

export function buildEnginePrompts(input: EngineInput) {
  // Différenciation AGENCY vs CREATOR
  const modeRules =
    input.mode === "AGENCY"
      ? `
MODE = AGENCY (premium / stratégique).
Tu écris comme une agence performance: précis, orienté résultats, frameworks marketing, options de tests A/B.
Tu proposes: KPI à suivre, variantes hook, variantes CTA, et un mini plan de test.
`
      : `
MODE = CREATOR (simple / tournable).
Tu écris comme un créateur UGC: naturel, oral, phrases courtes, facile à filmer.
Tu proposes: script prêt à dire, indications visuelles, et 2 variantes faciles.
`;

  const system = `
Tu es "UGC Script Engine", un moteur propriétaire.
Tu ne renvoies JAMAIS du blabla.
Tu renvoies STRICTEMENT un JSON valide, sans texte autour.

Contraintes de qualité:
- Adapte le script à la plateforme: ${input.platform}
- Objectif: ${input.objective}
- Intègre l'objection: ${input.objection}
- Utilise un framework (AIDA + PAS combinés selon besoin)
- 2 variantes A/B (diff hooks + diff CTA)
- Inclure: Hook, Body (beats), Proof, CTA
- Ajoute: "shotlist" (plans à filmer) + "broll"
- Ajoute: "testingPlan" (quoi tester en 3 jours)
- Langue de sortie: ${langLabel(input.lang)}
- Durée cible: ${input.duration}

Sécurité JSON:
- Aucune virgule en trop
- Pas de markdown
- Pas de backticks
`;

  const user = `
INPUT:
mode=${input.mode}
lang=${input.lang}
platform=${input.platform}
objective=${input.objective}
audience=${input.audience}
offer=${input.offer}
price=${input.price ?? ""}
angle=${input.angle}
objection=${input.objection}
hookType=${input.hookType}
tone=${input.tone}
duration=${input.duration}
context=${input.context ?? ""}

FORMAT JSON EXACT:
{
  "mode": "AGENCY|CREATOR",
  "lang": "fr|en-GB|en-US|es|ar",
  "platform": "string",
  "objective": "string",
  "audience": "string",
  "offer": "string",
  "angle": "string",
  "objection": "string",
  "variants": [
    {
      "name": "A",
      "hook": "string",
      "script": {
        "aida": { "attention": "string", "interest": "string", "desire": "string", "action": "string" },
        "beats": ["string","string","string","string"],
        "proof": ["string","string"],
        "cta": ["string","string"]
      },
      "shotlist": ["string","string","string"],
      "broll": ["string","string","string"]
    },
    {
      "name": "B",
      "hook": "string",
      "script": {
        "aida": { "attention": "string", "interest": "string", "desire": "string", "action": "string" },
        "beats": ["string","string","string","string"],
        "proof": ["string","string"],
        "cta": ["string","string"]
      },
      "shotlist": ["string","string","string"],
      "broll": ["string","string","string"]
    }
  ],
  "testingPlan": {
    "day1": ["string","string"],
    "day2": ["string","string"],
    "day3": ["string","string"]
  },
  "kpi": ["string","string","string"]
}

RÈGLE: JSON ONLY.
`;

  // On injecte les règles de mode dans le system prompt
  return {
    system: system + "\n" + modeRules,
    user,
  };
}
