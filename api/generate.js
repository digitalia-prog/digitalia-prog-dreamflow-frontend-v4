
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async (req, res) => {
  // CORS (utile si ton frontend est sur un autre domaine)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content:
            "Écris un court script UGC fun pour Instagram Reels sur la perte de poids",
        },
      ],
    });

    return res.status(200).json({
      text: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error("OPENAI ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
};

