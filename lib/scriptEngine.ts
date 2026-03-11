export type EngineInput = {
  mode: "CREATOR" | "AGENCY";
  lang: "fr" | "en-GB" | "en-US" | "es" | "ar";
  platform: string;
  objective: string;
  audience: string;
  offer: string;
  price?: string;
  angle: string;
  objection: string;
  hookType: string;
  tone: string;
  duration: string;
  context?: string;
};

function langLabel(lang: EngineInput["lang"]) {
  switch (lang) {
    case "fr":
      return "French";
    case "en-GB":
      return "English (UK)";
    case "en-US":
      return "English (US)";
    case "es":
      return "Spanish";
    case "ar":
      return "Arabic";
    default:
      return "French";
  }
}

function objectiveRules(objective: string) {
  switch (objective.toLowerCase()) {
    case "vente":
      return `
OBJECTIVE RULES = SALES
- Primary goal: drive purchase now.
- CTA must be direct and action-oriented.
- Mention clear benefit, urgency, ROI, result, or concrete outcome.
- Script should feel conversion-first, not educational-first.
- Prioritize money/result/time gain language.
`;
    case "lead":
      return `
OBJECTIVE RULES = LEAD
- Primary goal: capture lead / signup / contact.
- CTA must push to register, book, message, or subscribe.
- Reduce friction and emphasize simplicity.
- Prioritize curiosity + benefit + easy next step.
`;
    case "notoriété":
      return `
OBJECTIVE RULES = AWARENESS
- Primary goal: brand recall and memorability.
- CTA must be soft.
- Focus on strong hook, emotional impression, and brand positioning.
- Do not make the script too pushy.
`;
    case "conversion":
      return `
OBJECTIVE RULES = CONVERSION
- Primary goal: get the viewer to convert immediately.
- The script must feel highly persuasive and performance-driven.
- CTA must be explicit, concrete, and immediate.
- Use proof, friction reduction, and direct response logic.
- Every section must push the viewer closer to action.
`;
    default:
      return `
OBJECTIVE RULES
- Keep the script aligned with the requested goal.
- Make the CTA coherent with the objective.
`;
  }
}

function hookRules(hookType: string) {
  switch (hookType.toLowerCase()) {
    case "question choc":
      return `
HOOK RULES = SHOCK QUESTION
- Hook MUST be written as a question.
- It must create tension, doubt, or urgency in the first line.
- It should stop scroll immediately.
`;
    case "stat / preuve":
      return `
HOOK RULES = STAT / PROOF
- Hook MUST open with a concrete result, number, or proof angle.
- It should sound credible and performance-oriented.
`;
    case "avant / après":
      return `
HOOK RULES = BEFORE / AFTER
- Hook MUST contrast before vs after.
- Make transformation obvious and visual.
`;
    case "erreur fréquente":
      return `
HOOK RULES = COMMON MISTAKE
- Hook MUST call out a mistake or bad assumption.
- It should create self-recognition and tension.
`;
    case "mythe vs réalité":
      return `
HOOK RULES = MYTH VS REALITY
- Hook MUST oppose a common belief with reality.
- Keep it simple and punchy.
`;
    case "story":
      return `
HOOK RULES = STORY
- Hook MUST sound like the beginning of a personal story.
- It should feel human and natural.
`;
    default:
      return `
HOOK RULES
- The hook must strongly reflect the selected hook type.
`;
  }
}

function toneRules(tone: string) {
  const t = tone.toLowerCase();

  if (t.includes("ugc naturel")) {
    return `
TONE RULES = NATURAL UGC
- Use simple, human, spoken language.
- Avoid sounding overly corporate or robotic.
- Keep it realistic for a creator speaking to camera.
`;
  }

  if (t.includes("premium")) {
    return `
TONE RULES = PREMIUM
- Keep language polished, strategic, and credible.
- Stronger positioning, cleaner formulation, more confidence.
`;
  }

  if (t.includes("direct response")) {
    return `
TONE RULES = DIRECT RESPONSE
- Make it more aggressive, persuasive, and conversion-driven.
- Strong urgency, direct CTA, strong benefit framing.
`;
  }

  if (t.includes("friendly")) {
    return `
TONE RULES = FRIENDLY
- Make it warm, easy to understand, and reassuring.
- Keep the structure persuasive but not aggressive.
`;
  }

  return `
TONE RULES
- Respect the selected tone clearly.
`;
}

function modeRules(mode: EngineInput["mode"]) {
  if (mode === "AGENCY") {
    return `
MODE RULES = AGENCY
- Output must feel strategic and performance-oriented.
- Variants must be clearly differentiated.
- Include stronger proof and testing logic.
- Make the result usable by an agency for paid media / UGC testing.
`;
  }

  return `
MODE RULES = CREATOR
- Output must be simpler, more direct, and easier to film.
- Keep the script practical and natural.
- Prioritize clarity over complexity.
`;
}

export function buildEnginePrompts(input: EngineInput) {
  const language = langLabel(input.lang);

  const system = `
You are a top-tier UGC ads strategist and direct-response scriptwriter.
You create high-performing short-form ad scripts for ${input.platform}.

You MUST strictly follow:
- the selected objective
- the selected hook type
- the selected tone
- the selected angle
- the selected mode
- the selected language

You MUST NOT ignore the user's fields.
If objective = Conversion, the script must feel meaningfully more conversion-focused than Awareness or Lead.
If hook type = Question choc, the hook MUST be a question.
If tone = UGC naturel, the language MUST feel spoken and natural.

Return valid JSON only.
No markdown.
No commentary.
No code fences.
`;

  const user = `
LANGUAGE
Write the full output in ${language}.

BRIEF
- Mode: ${input.mode}
- Platform: ${input.platform}
- Objective: ${input.objective}
- Audience: ${input.audience}
- Offer/Product: ${input.offer}
- Price: ${input.price || "not specified"}
- Marketing angle: ${input.angle}
- Main objection: ${input.objection}
- Hook type: ${input.hookType}
- Tone: ${input.tone}
- Duration: ${input.duration}
- Context: ${input.context || "none"}

${modeRules(input.mode)}

${objectiveRules(input.objective)}

${hookRules(input.hookType)}

${toneRules(input.tone)}

ANGLE RULES
- The script must clearly reflect this angle: "${input.angle}"
- The wording in hook, interest, desire, proof, CTA, and shotlist must visibly reinforce this angle.
- If the angle contains ROI / speed / time / results / confidence / simplicity, this must be obvious in the final script.

OBJECTION RULES
- The objection "${input.objection}" must be answered clearly inside the script.
- Do not ignore it.
- Make the objection handling visible in either interest, desire, proof, or beats.

SHOTLIST RULES
- Shotlist must feel filmable.
- Use realistic UGC camera moments.
- Do not return generic placeholders.

VARIANT RULES
- Return exactly 2 variants: A and B.
- Variant A and B must be genuinely different.
- Different hook wording.
- Different framing.
- Different persuasion angle or rhythm.
- Not just a small rewrite.

RETURN THIS EXACT JSON SHAPE:
{
  "mode": "${input.mode}",
  "lang": "${input.lang}",
  "platform": "${input.platform}",
  "objective": "${input.objective}",
  "audience": "${input.audience}",
  "offer": "${input.offer}",
  "angle": "${input.angle}",
  "objection": "${input.objection}",
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
        },
        "beats": ["string", "string", "string", "string"],
        "proof": ["string", "string"],
        "cta": ["string", "string"]
      },
      "shotlist": ["string", "string", "string"],
      "broll": ["string", "string", "string"]
    },
    {
      "name": "B",
      "hook": "string",
      "script": {
        "aida": {
          "attention": "string",
          "interest": "string",
          "desire": "string",
          "action": "string"
        },
        "beats": ["string", "string", "string", "string"],
        "proof": ["string", "string"],
        "cta": ["string", "string"]
      },
      "shotlist": ["string", "string", "string"],
      "broll": ["string", "string", "string"]
    }
  ],
  "testingPlan": {
    "day1": ["string", "string"],
    "day2": ["string", "string"],
    "day3": ["string", "string"]
  },
  "kpi": ["string", "string", "string"]
}

FINAL QUALITY CHECK BEFORE RETURNING JSON:
- Is the selected objective clearly visible in the script?
- Is the selected hook type clearly respected?
- Is the selected tone clearly visible?
- Is the angle clearly visible?
- Is the objection clearly handled?
- Are A and B meaningfully different?

If not, rewrite before returning the JSON.
`;

  return { system, user };
}
