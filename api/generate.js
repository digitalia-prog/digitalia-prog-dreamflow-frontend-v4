// api/generate.js (Vercel Serverless Function - CommonJS)
// Required env: OPENAI_API_KEY
// Optional env: OPENAI_MODEL (default: gpt-4o-mini)

const OpenAI = require("openai");

module.exports = async (req, res) => {
  // CORS
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

    // Support both formats
    const prompt = (body.prompt && String(body.prompt).trim()) ? String(body.prompt).trim() : "";

    const mode = body.mode || body.MODE || "";
    const type = body.type || "";
    const niche = body.niche || "";
    const platform = body.platform || "";
    const subject = body.subject || body.product || "";
    const style = body.style || "";
    const lang = body.lang || "français";

    const builtPrompt = prompt || [
      "Tu es un expert UGC & growth marketing. Tu réponds en français, style moderne, concret, orienté conversion.",
      `Mode: ${mode || "Fun"}`,
      `Type: ${type || "Script UGC complet"}`,
      `Plateforme: ${platform || "TikTok"}`,
      `Niche: ${niche || "Non précisée"}`,
      `Sujet/Produit: ${subject || "Non précisé"}`,
      `Style: ${style || "Drôle / Viral"}`,
      "",
      "DONNE :",
      "1) 🎯 Angle marketing principal (1 phrase)",
      "2) 🎣 5 hooks (fort CTR) adaptés TikTok/Reels/Shorts",
      "3) 🎬 Script MOT À MOT (30–40s) : Hook / Problème / Solution / Preuve / CTA",
      "4) 🧠 3 variantes de CTA (soft / direct / urgence)",
      "5) 🎥 Mini plan de tournage smartphone (plans + texte à l’écran)",
      "",
      "Contraintes : hyper concret, pas de blabla, pas générique, pas de 'undefined'."
    ].join("\n");

    const client = new OpenAI({ apiKey });
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: "Tu es un expert UGC, copywriting et growth marketing." },
        { role: "user", content: builtPrompt }
      ],
      temperature: 0.8,
    });

    const text =
      completion?.choices?.[0]?.message?.content?.trim() ||
      "❌ Aucun contenu généré";

    // Return compatible keys for your frontend
    return res.status(200).json({
      success: true,
      content: text,
      result: text,
      text: text,
      script: text,
      lang,
    });

  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({
      success: false,
      error: "Erreur serveur",
      details: err?.message || String(err),
    });
  }
};

