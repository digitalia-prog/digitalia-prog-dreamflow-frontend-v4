export type UserType = "agency" | "creator"

export type EngineInput = {
  userType: UserType
  platform: string
  objective: string
  offer: string
  audience: string
  angle: string
  hookType: string
  tone: string
}

function buildHook(input: EngineInput) {
  return `[${input.hookType}] Pour ${input.audience} sur ${input.platform}`
}

function buildAIDA(input: EngineInput) {
  return `
HOOK:
${buildHook(input)}

ATTENTION:
Si tu veux ${input.objective}, écoute bien.

INTEREST:
Aujourd’hui on parle de ${input.offer}.

DESIRE:
C’est idéal pour ${input.audience} car ${input.angle}.

ACTION:
Passe à l’action maintenant.
`
}

function buildPAS(input: EngineInput) {
  return `
PROBLÈME:
Tu galères avec ${input.objective} ?

AGITATION:
Sans stratégie adaptée à ${input.platform}, tu perds du temps.

SOLUTION:
Voici comment ${input.offer} peut t’aider.
`
}

export function buildEnginePrompt(input: EngineInput) {
  const base = buildAIDA(input)
  const alt = buildPAS(input)

  if (input.userType === "agency") {
    return `
MODE AGENCY — ton premium, stratégique.

VERSION 1:
${base}

VERSION 2:
${alt}

Ajoute :
- KPI recommandés
- Angle Ads
- Variante A/B
`
  }

  return `
MODE CREATOR — naturel, organique.

VERSION 1:
${base}

VERSION 2:
${alt}

Ajoute :
- Version storytelling
- CTA naturel
`
}
