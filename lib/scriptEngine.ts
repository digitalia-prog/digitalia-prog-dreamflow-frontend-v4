export type Lang = "fr" | "en" | "es" | "ar";
export type Mode = "CREATOR" | "AGENCY";
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
  | "Landing Page"
  | "Email"
  | "VSL";

export type Objective = "Vente" | "Lead" | "Notoriété" | "Conversion" | "Trafic";

export type HookType =
  | "Question choc"
  | "Stat / preuve"
  | "Story"
  | "Avant / Après"
  | "Erreur fréquente"
  | "Mythe vs réalité"
  | "Démo rapide"
  | "Objection directe";

export type ScriptFramework = "AIDA" | "PAS" | "UGC";

export type EngineInput = {
  mode: Mode;
  lang: Lang;
  platform: Platform;
  objective: Objective;
  audience: string;
  offer: string;
  price?: string;
  angle: string;
  objection: string;
  hookType: HookType;
  tone: string;
  duration: "15s" | "30s" | "45s" | "60s";
  framework: ScriptFramework;
  brand?: string;
  constraints?: string; // ex: halal, pas de promesses, etc
};

export type EngineOutput = {
  title: string;
  meta: {
    mode: Mode;
    lang: Lang;
    platform: Platform;
    framework: ScriptFramework;
    objective: Objective;
  };
  prompt: {
    system: string;
    user: string;
  };
};

const I18N = {
  fr: {
    titleAgency: "Script Engine — Mode Agence (premium)",
    titleCreator: "Script Engine — Mode Créateur",
    rules: [
      "Tu écris en français clair, punchy, naturel.",
      "Zéro blabla : phrases courtes, rythme TikTok.",
      "Pas de promesses mensongères.",
      "CTA adapté à l’objectif.",
      "Tu fournis 2 variantes A/B.",
    ],
    agencyExtras: [
      "Version A = angle performance + preuves + structure clean.",
      "Version B = angle émotion + storytelling + tension.",
      "Donne aussi : 3 hooks alternatifs + 3 CTA alternatifs.",
      "Donne 5 KPI à suivre selon la plateforme.",
    ],
    creatorExtras: [
      "Style UGC : authentique, simple, relatable.",
      "Langage oral, comme un créateur face cam.",
      "Donne 2 hooks alternatifs et 2 CTA alternatifs.",
    ],
  },
  en: {
    titleAgency: "Script Engine — Agency Mode (premium)",
    titleCreator: "Script Engine — Creator Mode",
    rules: [
      "Write in natural, punchy English.",
      "Short sentences, creator-friendly pacing.",
      "No false promises.",
      "CTA aligned with the objective.",
      "Provide 2 A/B variants.",
    ],
    agencyExtras: [
      "Variant A = performance angle + proof + clean structure.",
      "Variant B = emotion angle + storytelling + tension.",
      "Also give: 3 extra hooks + 3 extra CTAs.",
      "Give 5 KPIs to track for this platform.",
    ],
    creatorExtras: [
      "UGC style: authentic, simple, relatable.",
      "Spoken language, like a face-cam creator.",
      "Give 2 extra hooks + 2 extra CTAs.",
    ],
  },
  es: {
    titleAgency: "Script Engine — Modo Agencia (premium)",
    titleCreator: "Script Engine — Modo Creador",
    rules: [
      "Escribe en español natural y directo.",
      "Frases cortas, ritmo tipo TikTok.",
      "Sin promesas falsas.",
      "CTA alineado con el objetivo.",
      "Da 2 variantes A/B.",
    ],
    agencyExtras: [
      "Variante A = performance + pruebas + estructura limpia.",
      "Variante B = emoción + storytelling + tensión.",
      "También: 3 hooks extra + 3 CTA extra.",
      "Da 5 KPIs para esta plataforma.",
    ],
    creatorExtras: [
      "Estilo UGC: auténtico y cercano.",
      "Lenguaje hablado, como creador face-cam.",
      "Da 2 hooks extra + 2 CTA extra.",
    ],
  },
  ar: {
    titleAgency: "محرك السكربت — وضع الوكالة (احترافي)",
    titleCreator: "محرك السكربت — وضع المبدع",
    rules: [
      "اكتب بالعربية بشكل طبيعي وسريع الإيقاع.",
      "جمل قصيرة مثل فيديوهات تيك توك.",
      "بدون وعود كاذبة.",
      "CTA مناسب لهدف الحملة.",
      "قدّم نسختين A/B.",
    ],
    agencyExtras: [
      "النسخة A = أداء + دليل + هيكلة واضحة.",
      "النسخة B = عاطفة + قصة + توتر.",
      "قدّم أيضاً: 3 Hooks إضافية + 3 CTA إضافية.",
      "قدّم 5 مؤشرات KPI لمتابعتها حسب المنصة.",
    ],
    creatorExtras: [
      "أسلوب UGC: طبيعي وقريب.",
      "لغة محكية كأنها face-cam.",
      "قدّم 2 Hooks إضافية و2 CTA إضافية.",
    ],
  },
} as const;

function platformGuidelines(p: Platform) {
  switch (p) {
    case "TikTok":
    case "Instagram Reels":
    case "YouTube Shorts":
      return [
        "Hook dans les 1-2 premières secondes.",
        "Pattern interrupt, tension, puis payoff rapide.",
        "Parle caméra, dynamique.",
      ];
    case "Facebook Ads":
    case "Google Ads":
      return [
        "Clarté, bénéfice, preuve, puis CTA.",
        "Évite le jargon, va droit au but.",
      ];
    case "Email":
      return ["Sujet implicite, promesse claire, structure simple, CTA unique."];
    case "VSL":
      return ["Story + preuve + offre + urgence soft, en sections."];
    default:
      return ["Adaptation standard à la plateforme."];
  }
}

function frameworkRules(f: ScriptFramework) {
  switch (f) {
    case "AIDA":
      return ["Structure AIDA: Hook / Attention / Interest / Desire / Action."];
    case "PAS":
      return ["Structure PAS: Problème / Agitation / Solution + CTA."];
    case "UGC":
      return [
        "Structure UGC: Hook / Contexte perso / Problème / Découverte / Résultats / CTA.",
      ];
  }
}

export function buildEnginePrompt(input: EngineInput): EngineOutput {
  const t = I18N[input.lang];

  const title =
    input.mode === "AGENCY" ? t.titleAgency : t.titleCreator;

  const baseRules = [
    ...t.rules,
    ...platformGuidelines(input.platform),
    ...frameworkRules(input.framework),
  ];

  const extras =
    input.mode === "AGENCY" ? t.agencyExtras : t.creatorExtras;

  const system = [
    "Tu es un expert en copywriting performance (UGC + Ads) et en scripts short-form.",
    "Tu produis un contenu prêt à tourner par un créateur ou une agence.",
    "Tu respectes strictement les contraintes et la plateforme.",
    "",
    "Règles:",
    ...baseRules.map((r) => `- ${r}`),
    "",
    "Bonus:",
    ...extras.map((r) => `- ${r}`),
  ].join("\n");

  const user = [
    "CONTEXT",
    `Mode: ${input.mode}`,
    `Langue: ${input.lang}`,
    `Plateforme: ${input.platform}`,
    `Objectif: ${input.objective}`,
    `Durée: ${input.duration}`,
    `Framework: ${input.framework}`,
    input.brand ? `Brand: ${input.brand}` : "",
    "",
    "CIBLE / AVATAR",
    input.audience,
    "",
    "OFFRE",
    input.offer,
    input.price ? `Prix: ${input.price}` : "",
    "",
    "ANGLE (obligatoire)",
    input.angle,
    "",
    "OBJECTION PRINCIPALE (obligatoire)",
    input.objection,
    "",
    "TYPE DE HOOK (obligatoire)",
    input.hookType,
    "",
    "TON",
    input.tone,
    input.constraints ? `Contraintes: ${input.constraints}` : "",
    "",
    "OUTPUT DEMANDÉ",
    "1) Variante A (script complet).",
    "2) Variante B (script complet).",
    "3) Hooks alternatifs.",
    "4) CTA alternatifs.",
    "5) Notes d’exécution (gestuelle, rythme, montage).",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    title,
    meta: {
      mode: input.mode,
      lang: input.lang,
      platform: input.platform,
      framework: input.framework,
      objective: input.objective,
    },
    prompt: { system, user },
  };
}
