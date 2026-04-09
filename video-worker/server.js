import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import OpenAI from "openai";

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function cleanJsonString(value) {
  return String(value || "")
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function normalizeResult(parsed, fallbackUrl) {
  return {
    transcript:
      typeof parsed?.transcript === "string" && parsed.transcript.trim()
        ? parsed.transcript
        : `Analyse basée sur le lien : ${fallbackUrl}`,
    summary:
      typeof parsed?.summary === "string" && parsed.summary.trim()
        ? parsed.summary
        : "Vidéo détectée, mais les détails restent limités sans transcription réelle.",
    hook:
      typeof parsed?.hook === "string" && parsed.hook.trim()
        ? parsed.hook
        : "Hook non identifié avec certitude à partir du lien seul.",
    structure:
      typeof parsed?.structure === "string" && parsed.structure.trim()
        ? parsed.structure
        : "Structure non confirmée sans accès au contenu vidéo.",
    angle:
      typeof parsed?.angle === "string" && parsed.angle.trim()
        ? parsed.angle
        : "Angle marketing non confirmé sans transcript.",
    psychology: Array.isArray(parsed?.psychology) ? parsed.psychology : [],
    strengths: Array.isArray(parsed?.strengths) ? parsed.strengths : [],
    weaknesses: Array.isArray(parsed?.weaknesses) ? parsed.weaknesses : [],
    recreateIdeas: Array.isArray(parsed?.recreateIdeas) ? parsed.recreateIdeas : [],
    similarHooks: Array.isArray(parsed?.similarHooks) ? parsed.similarHooks : [],
    similarAngles: Array.isArray(parsed?.similarAngles) ? parsed.similarAngles : [],
    scriptPrompt:
      typeof parsed?.scriptPrompt === "string" ? parsed.scriptPrompt : "",
    viralScore:
      typeof parsed?.viralScore === "string" ? parsed.viralScore : "",
    whyItWorks: Array.isArray(parsed?.whyItWorks) ? parsed.whyItWorks : [],
    howToBeat: Array.isArray(parsed?.howToBeat) ? parsed.howToBeat : [],
    adsAngles: Array.isArray(parsed?.adsAngles) ? parsed.adsAngles : [],
    creativeType:
      typeof parsed?.creativeType === "string" ? parsed.creativeType : "",
  };
}

app.post("/analyze", upload.none(), async (req, res) => {
  try {
    const { url, platform, offer, audience, notes } = req.body || {};

    console.log("WORKER INPUT:", { url, platform, offer, audience, notes });

    const prompt = `
Tu es un expert senior en marketing UGC et performance ads.

Tu dois analyser une vidéo à partir de son contexte, même si tu n'as pas accès à la transcription réelle.
Tu ne dois PAS laisser les champs vides.
Si une information est incertaine, formule-la honnêtement mais donne quand même une hypothèse utile.

Contexte :
- URL : ${url || ""}
- Plateforme : ${platform || ""}
- Produit / Offre : ${offer || ""}
- Audience : ${audience || ""}
- Notes : ${notes || ""}

Retourne uniquement un JSON valide, sans markdown :

{
  "transcript": "",
  "summary": "",
  "hook": "",
  "structure": "",
  "angle": "",
  "psychology": [],
  "strengths": [],
  "weaknesses": [],
  "recreateIdeas": [],
  "similarHooks": [],
  "similarAngles": [],
  "scriptPrompt": "",
  "viralScore": "",
  "whyItWorks": [],
  "howToBeat": [],
  "adsAngles": [],
  "creativeType": ""
}

Règles :
- Tous les champs texte doivent contenir une vraie phrase.
- Tous les tableaux doivent contenir au moins 2 éléments utiles quand c'est possible.
- Réponds en français.
- Ne laisse rien vide.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.5,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = response.choices?.[0]?.message?.content || "";
    console.log("WORKER RAW OUTPUT:", content);

    const cleaned = cleanJsonString(content);
    const parsed = JSON.parse(cleaned);
    const normalized = normalizeResult(parsed, url || "");

    console.log("WORKER NORMALIZED OUTPUT:", normalized);

    res.json(normalized);
  } catch (error) {
    console.error("WORKER ERROR:", error);
    res.status(500).json({
      error: "worker error",
      details: error?.message || "unknown error",
    });
  }
});

app.listen(3001, () => {
  console.log("Worker running on port 3001");
});
