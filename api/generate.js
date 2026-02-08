// api/generate.js
// Vercel Serverless Function – Node.js

const OpenAI = require("openai");

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ success: false, error: "Method not allowed" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: "OPENAI_API_KEY manquant dans Vercel",
      });
    }

    const body = typeof req.body === "string"
      ? JSON.parse(req.body || "{}")
      : req.body || {};

    const userPrompt = body.prompt || "";

    if (!userPrompt) {
      return res.status(400).json({
        success: false,
        error: "Prompt manquant",
      });
    }

    const client = new OpenAI({ apiKey });

    const finalPrompt = `
Tu es un expert UGC & Growth Marketing (niveau agence).
Tu travailles pour des agences marketing, freelances UGC, CM et créateurs.

OBJECTIF :
Créer une STRATÉGIE + SCRIPT UGC prêt à tourner, orienté conversion.

FORMAT OBLIGATOIRE :
1) 🎯 Angle marketing principal (1 phrase)
2) 🎣 5 hooks puissants (fort CTR)
3) 🎬 Script UGC MOT À MOT (30–40s)
   - Hook (0–3s)
   - Problème
   - Solution
   - Preuve / crédibilité
   - CTA clair
4) 🧠 3 variantes de CTA (soft / direct / urgence)
5) 🎥 Mini plan de tournage smartphone
   (plans, gestes, textes à l’écran)

CONTEXTE UTILISATEUR :
"${userPrompt}"

CONTRAINTES :
- Ultra concret
- Orienté performance & conversion
- Pas de blabla
- Prêt client
`.trim();

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Tu es un expert UGC & Growth Marketing." },
        { role: "user", content: finalPrompt }
      ],
      temperature: 0.7,
    });

    const text =
      completion.choices?.[0]?.message?.content || "Aucun contenu généré";

    return res.status(200).json({
      success: true,
      content: text,
    });

  } catch (err)

