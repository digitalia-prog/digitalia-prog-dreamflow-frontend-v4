/**
 * UGC Growth - Shared Psychology Core
 *
 * Shared psychological intelligence only.
 * This module does NOT own transports, quotas, platforms, transcription,
 * Meta context, Supadata, vision, Creator/Agency counts or UI.
 */


export function normalizePsychologyArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item === "string") return item.trim();
      if (!item || typeof item !== "object") return "";

      const record = item as Record<string, unknown>;
      const mechanism =
        record.mecanisme ??
        record["mécanisme"] ??
        record.mechanism ??
        record.trigger ??
        "";
      const activation = record.activation ?? record.activate ?? record.source ?? "";
      const effect = record.effet ?? record.effect ?? record.impact ?? "";
      const placement = record.emplacement ?? record.placement ?? record.location ?? "";

      const parts: string[] = [];
      if (mechanism) parts.push(String(mechanism));
      if (activation) parts.push(`Activation : ${String(activation)}`);
      if (effect) parts.push(`Effet : ${String(effect)}`);
      if (placement) parts.push(`Emplacement : ${String(placement)}`);

      if (parts.length) return parts.join(" — ");

      return Object.entries(record)
        .filter(([, v]) => ["string", "number", "boolean"].includes(typeof v))
        .map(([k, v]) => `${k} : ${String(v)}`)
        .join(" — ");
    })
    .filter((item): item is string => Boolean(item));
}

export const PSYCHOLOGY_ANALYSIS_CORE = `
PSYCHOLOGY CORE - DEEP ANALYSIS

Your job is NOT to merely describe content.
Your job is to explain WHY the creative works, HOW it captures or manipulates attention,
and HOW its persuasion mechanisms affect performance.

HONESTY RULE
- Only analyze what is actually provided.
- Do not invent visuals, claims, proof, audience facts or product facts.
- If visuals are unavailable, reason from transcript/context only and say so.
- Never use generic psychology labels without explaining the mechanism.
- OUTPUT CONTRACT: psychology must be an array of STRINGS, never objects.
- Each psychology string may include mechanism, activation, effect and placement.

ANALYZE PSYCHOLOGY WITH DEPTH
Identify, when supported by the creative/context:
- primary pain
- secondary pain
- emotional trigger
- logical trigger
- fear
- desire
- objection
- buying motivation
- tension
- identification
- relief
- curiosity gap
- authority
- urgency

For every relevant mechanism, explain:
- what activates it in this creative
- why it affects attention, emotion or conversion
- where it appears in the hook / structure / proof / CTA when identifiable

PERFORMANCE READING
- Explain what makes the creative perform.
- Explain what can kill conversion.
- Separate attention mechanisms from conversion mechanisms.
- Make the analysis actionable for media buyers, UGC creators, agencies and e-commerce founders.
- No fluff.
- No generic "good/bad" wording.
- Everything must be specific and actionable.
`;

export const PSYCHOLOGY_GENERATION_CORE = `
SHARED PSYCHOLOGY CORE

Before writing each script, analyze:
- primary pain
- secondary pain
- emotional trigger
- logical trigger
- fear
- desire
- objection
- buying motivation
- tension
- identification
- relief
- curiosity gap
- authority
- urgency

Then adapt the psychology to:
- hook
- tone
- CTA
- structure
- proof
- whyItWorks

RULES
- Do not use generic psychology labels without making them specific to the exact audience and offer.
- The psychological logic must be visible in the final script, not just named.
- Only use facts supplied by the user/context; do not invent proof or claims.
`;
