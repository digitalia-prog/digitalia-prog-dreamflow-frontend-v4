const OpenAI = require("openai");

module.exports = async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    // ✅ check env
    if (!process.env.OPENAI_API_KEY) {
      return res
        .status(500)
        .json({ success: false, error: "OPENAI_API_KEY manquante sur Vercel" });
    }

    // ✅ parse body robuste (Vercel peut donner req.body string ou object)
    const body =
      typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const prompt = body.prompt;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ success: false, error: "Prompt manquant" });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt.trim() }],
      temperature: 0.7,
    });

    const text = completion?.choices?.[0]?.message?.content?.trim() || "";

    return res.status(200).json({ success: true, result: text });
  } catch (err) {
    console.error("API /generate error:", err);
    return res.status(500).json({
      success: false,
      error: err?.message || "Internal error",
    });
  }
};

