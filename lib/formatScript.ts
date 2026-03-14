export function formatScript(data: any) {
  if (!data) return "-";

  const variants = data?.variants || [];

  if (!variants.length) return "-";

  return variants
    .map((v: any, i: number) => {
      const hook = v?.hook || "";

      const script = v?.script?.aida || {};

      const beats = v?.beats?.join("\n• ") || "";
      const proof = v?.proof?.join("\n• ") || "";
      const shotlist = v?.shotlist?.join("\n• ") || "";
      const cta = v?.cta?.primary || "";

      return `
=============================
SCRIPT ${i + 1}
=============================

HOOK
${hook}

SCRIPT
Attention: ${script.attention || ""}
Interest: ${script.interest || ""}
Desire: ${script.desire || ""}
Action: ${script.action || ""}

BEATS
• ${beats}

PROOF
• ${proof}

SHOTLIST
• ${shotlist}

CTA
${cta}

`;
    })
    .join("\n");
}
