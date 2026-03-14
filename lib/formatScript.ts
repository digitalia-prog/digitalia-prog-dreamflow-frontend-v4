export function formatScript(data: any) {
  const variants = data?.variants || [];
  if (!variants.length) return "-";

  return variants
    .map((v: any, i: number) => {
      const aida = v?.script?.aida || {};

      const hook =
        typeof v?.hook === "string" && v.hook.trim()
          ? v.hook.trim()
          : "Tu veux découvrir un produit qui fait vraiment la différence ?";

      const attention =
        typeof aida?.attention === "string" && aida.attention.trim()
          ? aida.attention.trim()
          : "Voici le problème que ce produit résout immédiatement.";

      const interest =
        typeof aida?.interest === "string" && aida.interest.trim()
          ? aida.interest.trim()
          : "Ce produit apporte un avantage concret, simple et utile.";

      const desire =
        typeof aida?.desire === "string" && aida.desire.trim()
          ? aida.desire.trim()
          : "Tu gagnes en confort, en praticité et en tranquillité d’esprit.";

      const action =
        typeof aida?.action === "string" && aida.action.trim()
          ? aida.action.trim()
          : "Clique maintenant pour le commander avant qu’il n’y en ait plus.";

      const beats =
        Array.isArray(v?.beats) && v.beats.filter(Boolean).length > 0
          ? v.beats.filter((x: any) => typeof x === "string" && x.trim())
          : [
              "Ouverture sur le problème ou la frustration du client",
              "Démonstration du produit en situation réelle",
              "Moment de persuasion juste avant l’appel à l’action",
            ];

      const proof =
        Array.isArray(v?.proof) && v.proof.filter(Boolean).length > 0
          ? v.proof.filter((x: any) => typeof x === "string" && x.trim())
          : [
              "Démonstration concrète du produit en action",
              "Élément de réassurance ou bénéfice visible immédiatement",
            ];

      const shotlist =
        Array.isArray(v?.shotlist) && v.shotlist.filter(Boolean).length > 0
          ? v.shotlist.filter((x: any) => typeof x === "string" && x.trim())
          : [
              "Gros plan sur le produit en main",
              "Plan montrant le produit utilisé en situation réelle",
              "Plan final lifestyle ou réaction utilisateur",
            ];

      const cta =
        typeof v?.cta?.primary === "string" && v.cta.primary.trim()
          ? v.cta.primary.trim()
          : "Clique sur le lien pour commander maintenant avant la rupture de stock.";

      return `Script ${i + 1}

HOOK
${hook}

SCRIPT
Attention: ${attention}
Interest: ${interest}
Desire: ${desire}
Action: ${action}

BEATS
${beats.map((b: string) => `• ${b}`).join("\n")}

PROOF
${proof.map((p: string) => `• ${p}`).join("\n")}

SHOTLIST
${shotlist.map((s: string) => `• ${s}`).join("\n")}

CTA
${cta}`;
    })
    .join("\n\n");
}
