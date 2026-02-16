export type Lang = "fr" | "en" | "es" | "ar";
export type Audience = "creator" | "agency";
export type Platform =
  | "TikTok"
  | "Instagram Reels"
  | "YouTube Shorts"
  | "Facebook Ads"
  | "Snapchat"
  | "Pinterest"
  | "LinkedIn"
  | "X (Twitter)"
  | "Google Ads"
  | "Landing page"
  | "Email"
  | "VSL";

export type Objective = "Vente" | "Lead" | "Notoriété" | "Conversion";
export type Mode = "UGC" | "HOOK" | "SCRIPT" | "ADS";

export type EngineInput = {
  audience: Audience;
  lang: Lang;
  platform: Platform;
  objective: Objective;
  offer: string;
  price?: string;
  angle: string;
  objection: string;
  hookType: string;
  duration: string;
  tone: string;
  context?: string;
};

export type EngineOutput = {
  system: string;
  prompt: string;
};

const FRAMEWORKS = {
  UGC: (i: EngineInput) => `
Tu es un expert UGC + performance ads.
Objectif: ${i.objective}
Plateforme: ${i.platform}
Audience: ${i.audience}
Langue: ${i.lang}

Contraintes:
- Style UGC naturel, phrases courtes, rythme rapide.
- CTA optimisé pour ${i.objective}.
- Intègre une objection: "${i.objection}".
- Angle principal: "${i.angle}".
- Offre: "${i.offer}" (${i.price ?? "prix non indiqué"}).
- Durée: ${i.duration}. Ton: ${i.tone}.
- Contexte: ${i.context ?? "n/a"}.

Structure obligatoire:
1) Hook (1-2 lignes) basé sur type: ${i.hookType}
2) Problème / douleur
3) Preuve / crédibilité / démonstration
4) Solution (produit/offre)
5) CTA clair

Génère:
- 1 script principal
- 2 variantes A/B (hook différent + angle secondaire)
- 5 hooks supplémentaires listés.
`.trim(),

  HOOK: (i: EngineInput) => `
Génère 20 hooks ultra-courts pour ${i.platform} en ${i.lang}.
Objectif: ${i.objective}. Audience: ${i.audience}.
Angle: ${i.angle}. Objection: ${i.objection}. Offre: ${i.offer}.
Formats: question, choc, preuve, avant/après, mythe vs réalité.
Retourne une liste numérotée.
`.trim(),

  SCRIPT: (i: EngineInput) => `
Génère un script complet (format voix-off + indications plan) pour ${i.platform} (${i.duration}).
Langue: ${i.lang}. Ton: ${i.tone}.
Angle: ${i.angle}. Objection: ${i.objection}. Objectif: ${i.objective}.
Inclure: texte à l’écran, B-roll suggéré, CTA final.
Offre: ${i.offer} (${i.price ?? "prix non indiqué"}).
`.trim(),

  ADS: (i: EngineInput) => `
Tu es media buyer senior.
Crée:
- 5 primary texts
- 5 headlines
- 5 descriptions
Pour ${i.platform} en ${i.lang}.
Objectif: ${i.objective}. Angle: ${i.angle}. Objection: ${i.objection}.
Offre: ${i.offer} (${i.price ?? "prix non indiqué"}).
CTA adapté.
`.trim(),
};

export function buildEnginePrompt(input: EngineInput): EngineOutput {
  const system =
    input.audience === "agency"
      ? "Tu travailles pour une agence. Priorité: scalabilité, multi-clients, angles testables, conformité."
      : "Tu travailles pour un créateur. Priorité: naturel, simplicité, conversion rapide, langage UGC.";

  const builder = FRAMEWORKS[inputModeToKey(input)];
  const prompt = builder(input);

  return { system, prompt };
}

function inputModeToKey(i: EngineInput): keyof typeof FRAMEWORKS {
  // Petite logique "propriétaire": certains réseaux + objectifs basculent en ADS
  if (i.platform.includes("Ads") || i.platform === "Google Ads") return "ADS";
  // Hook si l'utilisateur choisit un hookType très précis et durée très courte
  if (i.duration.toLowerCase().includes("5") || i.duration.toLowerCase().includes("6")) return "HOOK";
  return "UGC";
}

