(function () {
  function labelPlatform(p) {
    if (!p) return "TikTok";
    const v = String(p).toLowerCase();
    if (v.includes("insta")) return "Instagram Reels";
    if (v.includes("youtube")) return "YouTube Shorts";
    return "TikTok";
  }

  function normalizeMode(mode) {
    const m = (mode || "").toLowerCase();
    return (m === "fun" || m === "business") ? m : "business";
  }

  function normalizeType(type) {
    const t = (type || "").toLowerCase();
    if (t.includes("hack") || t.includes("growth")) return "hook_growth";
    if (t.includes("hook")) return "hook_growth";
    return "default";
  }

  function buildPrompt({ mode, type, niche, platform, subject, style, lang }) {
    const MODE = normalizeMode(mode);
    const TYPE = normalizeType(type);
    const PLATFORM = labelPlatform(platform);
    const NICHE = niche && String(niche).trim() ? String(niche).trim() : "général";
    const SUBJECT = subject && String(subject).trim() ? String(subject).trim() : "sans sujet";
    const STYLE = style && String(style).trim() ? String(style).trim() : (MODE === "fun" ? "fun, dynamique" : "pro, orienté conversion");
    const LANG = lang && String(lang).trim() ? String(lang).trim() : "français";

    if (MODE === "fun") {
      return `
Tu es un créateur TikTok EXPERT en viralité et rétention.
Plateforme: ${PLATFORM}
Niche: ${NICHE}
Sujet/Produit: ${SUBJECT}
Style: ${STYLE}
Langue: ${LANG}

DONNE:
1) 🎣 5 hooks ULTRA viraux (moins de 7 mots)
2) 🎬 1 script vidéo MOT À MOT (20–30 sec), fun, phrases courtes
3) 🚀 1 growth hack original (watch time/abonnés)
4) 💬 2 idées de commentaires épingles
5) 📢 1 CTA engageant

Contraintes: concret, pas générique, pas corporate.
`.trim();
    }

    if (TYPE === "hook_growth") {
      return `
Tu es un analyste de contenus viraux + growth hacker.
Plateforme: ${PLATFORM}
Niche: ${NICHE}
Sujet/Produit: ${SUBJECT}
Langue: ${LANG}

DONNE:
1) 🧠 Pattern psychologique
2) 🎣 7 hooks GROWTH HACK (rupture de pattern, curiosité max)
3) ⏱️ Où les placer (0–2s, 3–5s…) + pourquoi ça booste la rétention
4) ✅ Mini structure vidéo (20–30s)
5) ❌ 2 erreurs qui tuent la rétention

Contraintes: hyper concret, niveau expert, pas de blabla.
`.trim();
    }

    return `
Tu es un expert UGC & growth marketing.
Plateforme: ${PLATFORM}
Niche: ${NICHE}
Sujet/Produit: ${SUBJECT}
Style: ${STYLE}
Langue: ${LANG}

DONNE:
1) 🎯 Angle marketing principal
2) 🎣 3 hooks business (fort CTR)
3) 🎬 Script UGC MOT À MOT (30–40s): Hook / Problème / Solution / Preuve / CTA
4) 📈 KPI cible + 1 optimisation
5) 🎥 Mini plan de tournage smartphone

Contraintes: clair, structuré, prêt client, pas générique.
`.trim();
  }

  window.DreamflowPrompts = { buildPrompt };
})();

