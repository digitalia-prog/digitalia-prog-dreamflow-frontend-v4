// api/generate.js
// Vercel Serverless Function (CommonJS)
// Expects env: OPENAI_API_KEY (required), OPENAI_MODEL (optional)

module.exports = async (req, res) => {
  try {
    // Basic method guard
    if (req.method !== "POST") {
      return res.status(405).json({ success: false, error: "Method Not Allowed" });
    }

    // Safety: key must exist
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: "OPENAI_API_KEY manquant dans les variables d’environnement (Vercel).",
      });
    }

    // Parse body safely (Vercel usually parses JSON, but we handle string too)
    let body = req.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch (_) { body = {}; }
    }
    body = body || {};

    // Support BOTH:
    // 1) Simple front: { prompt }
    // 2) Full SaaS: { mode, type, niche, platform, subject, style, lang }
    const mode = (body.mode || "").toString().toLowerCase(); // "fun" | "business"
    const type = (body.type || "").toString();
    const niche = (body.niche || "").toString();
    const platform = (body.platform || "").toString();
    const subject = (body.subject || "").toString();
    const style = (body.style || "").toString();
    const lang = (body.lang || "français").toString();

    const rawPrompt = (body.prompt || "").toString().trim();

    // If front only sends prompt, we wrap it in a strong instruction
    const finalPrompt = rawPrompt
      ? buildFromRawPrompt(rawPrompt, lang)
      : buildFromFields({ mode, type, niche, platform, subject, style, lang });

    if (!finalPrompt || finalPrompt.length < 5) {
      return res.status(400).json({
        success: false,
        error: "Prompt manquant (envoie {prompt} ou des champs {mode,type,niche,platform,subject,style}).",
      });
    }

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    // Call OpenAI Responses API
    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        input: finalPrompt,
        temperature: 0.8,
        max_output_tokens: 900,
      }),
    });

    const data = await r.json();

    if (!r.ok) {
      const msg =
        (data && data.error && (data.error.message || data.error)) ||
        "Erreur OpenAI";
      return res.status(500).json({ success: false, error: msg });
    }

    const content = extractText(data).trim();

    return res.status(200).json({
      success: true,
      content: content || "❌ Aucun contenu généré",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err && err.message ? err.message : "Erreur serveur",
    });
  }
};

function extractText(resp) {
  // Responses API can return convenience text in different fields depending on SDK/version.
  // We try multiple safe paths.
  if (!resp) return "";

  if (typeof resp.output_text === "string") return resp.output_text;

  // Fallback: dig in output array
  const out = resp.output;
  if (Array.isArray(out)) {
    let all = "";
    for (const item of out) {
      const content = item && item.content;
      if (Array.isArray(content)) {
        for (const c of content) {
          if (c && typeof c.text === "string") all += c.text;
          if (c && c.type === "output_text" && typeof c.text === "string") all += c.text;
        }
      }
    }
    return all;
  }

  // Older patterns:
  if (resp.content && typeof resp.content === "string") return resp.content;

  return "";
}

function buildFromRawPrompt(userPrompt, lang) {
  return `
Tu es un expert UGC + Growth (niveau élite).
Langue: ${lang}

TÂCHE:
Génère un script UGC ultra actionnable basé sur cette demande:

"${userPrompt}"

FORMAT OBLIGATOIRE (sans blabla):
1) 🎯 Angle marketing principal (1 phrase)
2) 🎣 5 hooks (fort CTR) adaptés à TikTok/Reels/Shorts
3) 🎬 Script MOT À MOT (30–40s) :
   - Hook (0–3s)
   - Problème
   - Solution
   - Preuve / crédibilité
   - CTA clair
4) 🧠 3 variantes de CTA (soft / direct / urgence)
5) 🎥 Mini plan tournage smartphone (plans, gestes, textes à l’écran)
6) ✅ Checklist “prêt à tourner” (5 bullets)

Contraintes:
- Concret, punchy, moderne, pas générique
- Pas de titres vides, pas de “undefined”, pas de sections manquantes
`.trim();
}

function buildFromFields({ mode, type, niche, platform, subject, style, lang }) {
  const MODE = mode === "business" ? "business" : "fun";
  const PLATFORM = platform || "TikTok";
  const TYPE = type || (MODE === "business" ? "Stratégie UGC" : "Script UGC");
  const NICHE = niche || "général";
  const SUBJECT = subject || "produit/service non précisé";
  const STYLE = style || (MODE === "business" ? "direct & conversion" : "fun & viral");

  if (MODE === "fun") {
    return `
Tu es un créateur UGC expert en viralité (TikTok/Reels/Shorts).
Langue: ${lang}

Contexte:
- Plateforme: ${PLATFORM}
- Type: ${TYPE}
- Niche: ${NICHE}
- Sujet: ${SUBJECT}
- Style: ${STYLE}

DONNE (hyper concret):
1) 🎯 Objectif (1 ligne)
2) 🎣 5 hooks viraux (ultra modernes)
3) 🎬 Script MOT À MOT (15–30s) : Hook / scène / punchlines / twist / CTA "engagement" (commentaire, like, follow)
4) 💥 3 variations de la 1ère phrase (A/B/C)
5) 🎥 Plans de tournage (smartphone) + textes à l’écran

Contraintes:
- Très actuel, rythme TikTok, pas scolaire, pas générique
- Format prêt à copier-coller
`.trim();
  }

  // BUSINESS
  return `
Tu es un expert UGC + Growth Marketing (niveau agence).
Langue: ${lang}

Contexte:
- Plateforme: ${PLATFORM}
- Type: ${TYPE}
- Niche: ${NICHE}
- Produit/Sujet: ${SUBJECT}
- Style: ${STYLE}

DONNE (niveau expert, sans blabla):
1) 🎯 Angle marketing principal (1 phrase)
2) 🧠 Positionnement + promesse (2 lignes max)
3) 🎣 5 hooks "growth" (fort CTR) + pour chacun: intention (curiosité / preuve / peur de rater / bénéfice)
4) 🎬 Script UGC MOT À MOT (30–45s): Hook / Problème / Solution / Preuve / Objection / CTA
5) 📈 KPI cible (CTR, CVR ou watch time) + 2 optimisations concrètes
6) 🎥 Mini plan de tournage smartphone (plans, b-roll, textes à l’écran)
7) 🧷 3 variations de CTA (soft / direct / urgence)

Contraintes:
- Ultra concret, prêt client, moderne, orienté conversion
- Ne répète pas des banalités, pas de “undefined”
`.trim();
}

