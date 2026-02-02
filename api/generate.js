
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ success: false, error: "Prompt manquant" });
  }

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    return res.status(200).json({
      success: true,
      result: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error("OPENAI ERROR:", err);
    return res.status(500).json({
      success: false,
      error: "Erreur OpenAI",
    });
  }
}

