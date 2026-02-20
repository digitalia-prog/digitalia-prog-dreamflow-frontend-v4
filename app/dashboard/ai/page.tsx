function generateScript(s: FormState, locale: "fr" | "en") {
  const hooks = [
    "STOP ✋ — personne ne t’explique ça correctement.",
    "Si tu fais encore ça… tu perds des vues.",
    "Le vrai problème n’est pas ce que tu crois.",
    "Personne ne parle de cette technique.",
    "Je vais te montrer un hack que 90% ignorent.",
  ];

  const randomHook =
    s.hak?.trim()
      ? `HAK: ${s.hak}`
      : hooks[Math.floor(Math.random() * hooks.length)];

  const lines: string[] = [];

  lines.push(`🎬 PLATFORM: ${s.platform}`);
  lines.push(`⚡ MODE: IA VIRAL`);
  lines.push("");
  lines.push(`HOOK: ${randomHook}`);
  lines.push("");

  lines.push(`STORY: Imagine… ${s.audience || "ton audience"} fait cette erreur tous les jours.`);
  lines.push(`PROBLÈME: ${s.problem || "ils galèrent à obtenir des résultats."}`);
  lines.push(`TWIST: Et pourtant la solution est plus simple que tu crois.`);
  lines.push(`SOLUTION: ${s.solution || "une méthode rapide et claire."}`);
  lines.push(`OFFRE: ${s.offer || "ton produit / service"}`);
  lines.push(`PREUVE: ${s.proof || "résultats, avis, chiffres réels."}`);
  lines.push(`CTA: ${s.cta || 'DM "GO" / lien bio / commente "INFO"'}`);

  lines.push("");
  lines.push("🔥 VIRAL STRUCTURE:");
  lines.push("1️⃣ Hook agressif");
  lines.push("2️⃣ Story courte");
  lines.push("3️⃣ Pattern interrupt");
  lines.push("4️⃣ Solution claire");
  lines.push("5️⃣ CTA direct");

  return lines.join("\n");
}
