const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function buildPromptFromFields(body = {}) {
  const {
    type = "UGC",
    mode = "fun",
    niche = "general",
    style = "court",
    lang = "fr",
    platform = "Instagram Reels",
    subject = "sans sujet",
  } = body;

  return `
Tu es un expert en copywriting UGC.
Génère un script UGC ${type} en ${lang} pour ${platform}.

Contraintes:
- Ton: ${mode}
- Niche: ${niche}
- Style: ${style}
- Sujet: ${subject}
- Donne un script complet prêt à tourner.
- Structure: Hook (0-2s) / Problème / Solution / Preuves / CTA
- Format: texte clair, phrases courtes, 20-40 secondes max.
`.trim();
}

module.exports = async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ success: false, error: "Method not allowed" });

  try {
    const body = req.body || {};

    // ✅ Ton front peut envoyer soit {prompt}, soit {type/mode/niche/...}
    const prompt = (body.prompt && String(body.prompt).trim())
      ? String(body.prompt).trim()
      : buildPromptFromFields(body);

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ success: false, error: "OPENAI_API_KEY manquante sur Vercel" });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Tu écris des scripts UGC performants et concrets." },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 500,
    });

    const text = completion?.choices?.[0]?.message?.content?.trim();

    if (!text) {
      return res.status(500).json({ success: false, error: "Réponse vide de l'API OpenAI" });
    }

    return res.status(200).json({ success: true, result: text });
  } catch (err) {
    console.error("API ERROR:", err);

    // Message propre côté client
    const msg =
      err?.message ||
      err?.error?.message ||
      "Erreur inconnue";

    return res.status(500).json({ success: false, error: msg });
  }
};

