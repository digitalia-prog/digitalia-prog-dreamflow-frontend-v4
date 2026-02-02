import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      type,
      mode,
      niche,
      style,
      lang,
      platform,
      subject,
    } = req.body;

    const prompt = `
Type: ${type}
Mode: ${mode}
Niche: ${niche}
Style: ${style}
Langue: ${lang}
Plateforme: ${platform}
Sujet: ${subject}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Tu es un expert en scripts UGC viraux." },
        { role: "user", content: prompt },
      ],
    });

    res.status(200).json({
      result: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("OPENAI ERROR:", error);
    res.status(500).json({ error: error.message });
  }
}

