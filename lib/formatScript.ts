export function formatScript(data: any) {
  const variants = data?.variants || [];
  if (!variants.length) return "-";

  return variants
    .map((v: any, index: number) => {
      const aida = v?.script?.aida || {};
      const beats = (v?.script?.beats || []).map((x: string) => `• ${x}`).join("\n");
      const proof = (v?.script?.proof || []).map((x: string) => `• ${x}`).join("\n");
      const cta = (v?.script?.cta || []).map((x: string) => `• ${x}`).join("\n");
      const shotlist = (v?.shotlist || []).map((x: string) => `• ${x}`).join("\n");

      return `
VARIANTE ${v?.name || index + 1}

HOOK
${v?.hook || ""}

SCRIPT
Attention: ${aida.attention || ""}
Interest: ${aida.interest || ""}
Desire: ${aida.desire || ""}
Action: ${aida.action || ""}

BEATS
${beats}

PROOF
${proof}

SHOTLIST
${shotlist}

CTA
${cta}
`.trim();
    })
    .join("\n\n------------------------------\n\n");
}
