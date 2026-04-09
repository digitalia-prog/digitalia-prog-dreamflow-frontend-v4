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

function fallbackAnalysis({ url, platform, offer, audience, notes }) {
  return {
    transcript: `Analyse basée sur le lien fourni : ${url || "lien non précisé"}.`,
    summary:
      "La vidéo semble être une créa courte pensée pour capter rapidement l’attention sur un format social.",
    hook:
      "Hook probablement basé sur une accroche immédiate, visuelle ou verbale, pour retenir l’utilisateur dès les premières secondes.",
    structure:
      "Ouverture rapide, développement du message principal, puis fin orientée bénéfice ou curiosité.",
    angle:
      "Angle marketing centré sur la simplicité, l’attention rapide et la promesse perçue du contenu.",
    psychology: [
      "Curiosité : pousser l’utilisateur à vouloir comprendre la suite.",
      "Attention rapide : format pensé pour stopper le scroll."
    ],
    strengths: [
      "Format adapté aux plateformes courtes.",
      "Potentiel de message simple et rapide à comprendre."
    ],
    weaknesses: [
      "Analyse limitée sans transcription réelle ni lecture directe de la vidéo.",
      "Certains détails créatifs restent hypothétiques."
    ],
    recreateIdeas: [
      "Refaire une version plus directe avec bénéfice annoncé dès le début.",
      "Ajouter davantage de preuve ou de démonstration produit."
    ],
    similarHooks: [
      "Attends de voir ça…",
      "Tu ne t’attends pas à ce résultat."
    ],
    similarAngles: [
      "Angle découverte rapide.",
      "Angle bénéfice simple et immédiat."
    ],
    scriptPrompt:
      "Crée une vidéo courte orientée TikTok avec une accroche immédiate, un bénéfice clair, un ton naturel, puis une fin qui donne envie d’en savoir plus.",
    viralScore: "6.5/10",
    whyItWorks: [
      "Format court compatible avec la consommation rapide.",
      "Promesse potentiellement compréhensible en peu de temps."
    ],
    howToBeat: [
      "Rendre le hook plus agressif dès la première seconde.",
      "Ajouter plus de preuve visuelle ou de résultat concret."
    ],
    adsAngles: [
      "Angle bénéfice rapide.",
      "Angle curiosité / découverte."
    ],
    creativeType: "Short-form social creative"
  };
}

function normalizeResult(parsed, fallback) {
  return {
    transcript:
      typeof parsed?.transcript === "string" && parsed.transcript.trim()
        ? parsed.transcript
        : fallback.transcript,
    summary:
      typeof parsed?.summary === "string" && parsed.summary.trim()
        ? parsed.summary
        : fallback.summary,
    hook:
      typeof parsed?.hook === "string" && parsed.hook.trim()
        ? parsed.hook
        : fallback.hook,
    structure:
      typeof parsed?.structure === "string" && parsed.structure.trim()
        ? parsed.structure
        : fallback.structure,
    angle:
      typeof parsed?.angle === "string" && parsed.angle.trim()
        ? parsed.angle
        : fallback.angle,
    psychology:
      Array.isArray(parsed?.psychology) && parsed.psychology.length
        ? parsed.psychology
        : fallback.psychology,
    strengths:
      Array.isArray(parsed?.strengths) && parsed.strengths.length
        ? parsed.strengths
        : fallback.strengths,
    weaknesses:
      Array.isArray(parsed?.weaknesses) && parsed.weaknesses.length
        ? parsed.weaknesses
        : fallback.weaknesses,
    recreateIdeas:
      Array.isArray(parsed?.recreateIdeas) && parsed.recreateIdeas.length
        ? parsed.recreateIdeas
        : fallback.recreateIdeas,
    similarHooks:
      Array.isArray(parsed?.similarHooks) && parsed.similarHooks.length
        ? parsed.similarHooks
        : fallback.similarHooks,
    similarAngles:
      Array.isArray(parsed?.similarAngles) && parsed.similarAngles.length
        ? parsed.similarAngles
        : fallback.similarAngles,
    scriptPrompt:
      typeof parsed?.scriptPrompt === "string" && parsed.scriptPrompt.trim()
        ? parsed.scriptPrompt
        : fallback.scriptPrompt,
    viralScore:
      typeof parsed?.viralScore === "string" && parsed.viralScore.trim()
        ? parsed.viralScore
        : fallback.viralScore,
    whyItWorks:
      Array.isArray(parsed?.whyItWorks) && parsed.whyItWorks.length
        ? parsed.whyItWorks
        : fallback.whyItWorks,
    howToBeat:
      Array.isArray(parsed?.howToBeat) && parsed.howToBeat.length
        ? parsed.howToBeat
        : fallback.howToBeat,
    adsAngles:
      Array.isArray(parsed?.adsAngles) && parsed.adsAngles.length
        ? parsed.adsAngles
        : fallback.adsAngles,
    creativeType:
      typeof parsed?.creativeType === "string" && parsed.creativeType.trim()
        ? parsed.creativeType
        : fallback.creativeType
  };
}

app.post("/analyze", upload.none(), async (req, res) => {
  const { url, platform, offer, audience, notes } = req.body || {};
  const fallback = fallbackAnalysis({ url, platform, offer, audience, notes });

  try {
    const prompt = `
Tu es un expert senior en marketing UGC et performance.

Analyse une vidéo à partir de son lien et de son contexte.
Même si certaines informations sont incertaines, tu ne dois laisser aucun champ vide.
Tu dois fournir des hypothèses utiles et concrètes en français.

Contexte :
- URL : ${url || ""}
- Plateforme : ${platform || ""}
- Produit / Offre : ${offer || ""}
- Audience : ${audience || ""}
- Notes : ${notes || ""}

Retourne uniquement un JSON valide :

{
  "transcript": "phrase obligatoire",
  "summary": "phrase obligatoire",
  "hook": "phrase obligatoire",
  "structure": "phrase obligatoire",
  "angle": "phrase obligatoire",
  "psychology": ["élément 1", "élément 2"],
  "strengths": ["élément 1", "élément 2"],
  "weaknesses": ["élément 1", "élément 2"],
  "recreateIdeas": ["élément 1", "élément 2"],
  "similarHooks": ["élément 1", "élément 2"],
  "similarAngles": ["élément 1", "élément 2"],
  "scriptPrompt": "phrase obligatoire",
  "viralScore": "exemple 7.2/10",
  "whyItWorks": ["élément 1", "élément 2"],
  "howToBeat": ["élément 1", "élément 2"],
  "adsAngles": ["élément 1", "élément 2"],
  "creativeType": "phrase obligatoire"
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.6,
      messages: [{ role: "user", content: prompt }]
    });

    const content = response.choices?.[0]?.message?.content || "";
    const cleaned = cleanJsonString(content);

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return res.json(fallback);
    }

    return res.json(normalizeResult(parsed, fallback));
  } catch (error) {
    console.error("WORKER ERROR:", error);
    return res.json(fallback);
  }
});

app.listen(3001, () => {
  console.log("Worker running on port 3001");
});
