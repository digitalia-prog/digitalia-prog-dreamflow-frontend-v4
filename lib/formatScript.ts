export function formatScript(data: any) {
  const aida = data?.script?.aida || {};

  return `
HOOK
${data?.hook || ""}

SCRIPT
${aida.attention || ""}
${aida.interest || ""}
${aida.desire || ""}
${aida.action || ""}

BEATS
${(data?.beats || []).map((b: string) => "- " + b).join("\n")}

PROOF
${(data?.proof || []).map((p: string) => "- " + p).join("\n")}

SHOTLIST
${(data?.shotlist || []).map((s: string) => "- " + s).join("\n")}

CTA
${Array.isArray(data?.cta) ? data.cta.join(" / ") : data?.cta || ""}
`;
}
