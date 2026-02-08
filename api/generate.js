// api/generate.js (Vercel Serverless Function - CommonJS)
// No SDK dependency: uses fetch (Node 20 has it).
// Env required: OPENAI_API_KEY
// Env optional: OPENAI_MODEL (default: gpt-4.1-mini)

module.exports = async (req, res) => {
  // CORS (safe)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: "OPENAI_API_KEY manquant dans les variables d’environnement (Vercel).",
      });
    }

    // Parse body safely
    let body = req.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch { body = {}; }
    }
    body = body || {};

    const userPrompt = String(body.prompt || "").trim();

    // If you later send structured fields (mode/type/niche/etc), we can use them too:
    const mode = String(body.mode || "").toLowerCase(); // "fun" | "business"
    const type = String(body.type || "").trim();
    const niche = String(body.niche || "").trim();
    const platform = String(body.platform || "TikTok").trim();
    const subject = String(body.subject || "").trim();
    const style = String(body.style || "").trim();

    // Require at least something
    if (!userPrompt && !subject) {
      return res.status(400).json({ success: false, error: "Prompt manquant" });
    }

    const finalPrompt = buildUGCPrompt({
      userPrompt,
      mode,
      type,
      niche,
      platform,
      subject,
      style,
    });

    const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

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
      }),
    });

    const data = await r.json().catch(() => ({}));

    if (!r.ok) {
      return res.status(500).json({
        success: false,
        error: "OpenAI error",
        status: r.status,
        details: data,
      });
    }

    const text = extractTextFromResponses(data);

    return res.status(200).json({
      success: true,
      content: text || "❌ Aucun contenu généré",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Function crashed",
      details: err?.message || String(err),
    });
  }
};

function buildUGCPrompt({ userPrompt, mode, type, niche, platform, subject, style }) {
  const MODE = mode === "fun" ? "FUN" : "BUSINESS";
  const PLATFORM = platform || "TikTok";
  const TYPE = type || (MODE === "FUN" ? "Script UGC" : "Stratégie UGC + Script Ads");
  const NICHE = niche || "général";
  const SUBJECT = subject || userPrompt || "produit/service non précisé";
  const STYLE = style || (MODE === "FUN" ? "drôle, viral, très TikTok" : "conversion, direct, growth");

  // Prompt ultra cadré => fini les réponses “générales”
  return `
Tu es un expert UGC + Growth Marketing (niveau agence).
Tu écris pour: agences marketing, freelances UGC, CM, créateurs.

MODE: ${MODE}
PLATEFORME: ${PLATFORM}
TYPE: ${TYPE}
NICHE: ${NICHE}
SUJET/PRODUIT: ${SUBJECT}
STYLE: ${STYLE}

OBJECTIF:
Créer une STRATÉGIE + un SCRIPT UGC prêt à tourner, orienté performance.

FORMAT OBLIGATOIRE (sans blabla):
1) 🎯 Angle marketing principal (1 phrase)
2) 🎣 5 hooks ultra modernes (fort CTR)
3) 🎬 Script UGC MOT À MOT (30–40s):
   - Hook (0–3s)
   - Problème
   - Solution
   - Preuve (résultat, démonstration, crédibilité)
   - Objection (1)
   - CTA clair
4) 🧠 3 CTA (soft / direct / urgence)
5) 🎥 Mini plan tournage smartphone (plans, b-roll, textes écran)
6) ✅ Checklist “prêt à tourner” (5 bullets)

CONTRAINTES:
- Ultra concret, phrases courtes, rythme TikTok
- Pas de conseils vagues, pas de généralités
- Pas de “undefined”
- Livrable prêt à envoyer à un client
`.trim();
}

function extractTextFromResponses(resp) {
  // Responses API often returns output_text directly
  if (typeof resp?.output_text === "string" && resp.output_text.trim()) {
    return resp.output_text.trim();
  }

  // Fallback: aggregate output content
  const out = resp?.output;
  if (Array.isArray(out)) {
    let all = "";
    for (const item of out) {
      const content = item?.content;
      if (!Array.isArray(content)) continue;
      for (const c of content) {
        if (c?.type === "output_text" && typeof c?.text === "string") {
          all += c.text + "\n";
        }
      }
    }
    return all.trim();
  }
  return "";
}

