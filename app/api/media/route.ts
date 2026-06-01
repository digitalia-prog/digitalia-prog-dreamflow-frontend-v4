import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function cleanJsonString(value: string) {
  return value.replace(/```json/g, "").replace(/```/g, "").trim();
}

function normalizeReportLanguage(value: string) {
  const lang = value.toLowerCase().trim();

  if (["en", "english", "anglais"].includes(lang)) return "English";
  if (["es", "spanish", "español", "espagnol"].includes(lang)) return "Español";
  if (["it", "italian", "italiano", "italien"].includes(lang)) return "Italiano";
  if (["ar", "arabic", "arabe", "العربية"].includes(lang)) return "العربية";
  if (["zh", "chinese", "中文", "chinois"].includes(lang)) return "中文";

  return "Français";
}

async function transcribeWithOpenAI(file: File) {
  const transcript = await openai.audio.transcriptions.create({
    file,
    model: "whisper-1",
    response_format: "text",
  });

  return typeof transcript === "string" ? transcript : "";
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY manquante" },
        { status: 500 }
      );
    }

    const formData = await req.formData();

    const notes = String(formData.get("notes") || "").trim();
    const file = formData.get("file") as File | null;

    const analysisMode = String(
      formData.get("analysisMode") || "founder"
    ).toLowerCase();

    const reportLanguage = normalizeReportLanguage(
      String(formData.get("reportLanguage") || "fr")
    );

    let rawTranscript = "";

    if (file && file.size > 0) {
      rawTranscript = await transcribeWithOpenAI(file);
    }

    const sourceContent = rawTranscript
      ? `TRANSCRIPT BRUT AUDIO/VIDÉO:\n${rawTranscript}\n\nNOTES COMPLÉMENTAIRES PRIORITAIRES:\n${notes || "-"}`
      : `NOTES BRUTES:\n${notes}`;

    if (!sourceContent.trim()) {
      return NextResponse.json(
        { error: "Ajoute des notes texte ou un fichier audio/vidéo." },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MEDIA_MODEL || "gpt-4o-mini",
      temperature: 0.35,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
You are the Founder Intelligence & Media Engine of UGC Growth.

CRITICAL LANGUAGE RULE:
The output language is: ${reportLanguage}

TRANSCRIPT LANGUAGE RULE:

translatedTranscript MUST always be returned.

translatedTranscript MUST always be written in the selected report language.

If source audio is French and reportLanguage is English:
translatedTranscript must be English.

If source audio is French and reportLanguage is Español:
translatedTranscript must be Spanish.

If source audio is French and reportLanguage is Italiano:
translatedTranscript must be Italian.

If source audio is French and reportLanguage is العربية:
translatedTranscript must be Arabic.

If source audio is French and reportLanguage is 中文:
translatedTranscript must be Chinese.

Never keep the original transcript language unless it matches reportLanguage.

correctedTranscript must also be written in the selected report language.

cleanedTranscript must also be written in the selected report language.

You MUST write every textual value in the JSON in this exact language: ${reportLanguage}.
JSON keys must stay in English.
Do not mix languages.
Do not answer in French unless the selected language is Français.
If the selected language is English, all content values must be in English.
If the selected language is Español, all content values must be in Spanish.
If the selected language is Italiano, all content values must be in Italian.
If the selected language is العربية, all content values must be in Arabic.
If the selected language is 中文, all content values must be in Chinese.

Analysis mode:
${analysisMode}

You are not a generic content generator.
You are a strategic intelligence system.

If analysisMode = "founder":
Produce a founder-oriented analysis:
- central message
- founder narrative
- market tension
- strategic belief
- media angles
- executive summary
- strategic opportunities

If analysisMode = "agency":
Produce an agency-oriented analysis:
- ideal customer profile
- pain points
- offer clarity
- positioning
- agency opportunities
- growth recommendations

SOURCE-CALIBRATED RULES:
- Use only information present in the source.
- Do not invent proof, numbers, clients, results, claims or promises.
- If information is missing, say the equivalent of "Information insufficient in the source" in ${reportLanguage}.
- Do not exaggerate.
- Do not turn hypotheses into facts.
- Detect and structure. Do not embellish.

BRAND RULE:
If the notes indicate "Nom de la société : UGC Growth", the official brand name is UGC Growth.

Correct all phonetic variants:
- GC Grove
- Juicy Grove
- UGC Grove
- GC Growth
- UGC Grow
- UG Growth

into:
UGC Growth

FORBIDDEN MARKETING WORDS unless present in the source:
- revolutionary
- leader
- game changer
- incontournable
- nouvelle ère
- solution innovante
- acteur clé
- future of marketing
- révolutionnaire
- plateforme innovante

STRATEGIC INTELLIGENCE:
Identify:

marketTension:
The visible market tension in the source.

problemStatement:
The concrete problem described.

uniqueBelief:
The differentiating belief carried by the founder or project.

whyNow:
Why this problem matters now.

These fields must be sober, precise and grounded in the source.

Return only valid JSON.

Mandatory JSON structure:
{
  "analysisMode": "",
  "reportLanguage": "",
  "rawTranscript": "",
  "translatedTranscript": "",
  "correctedTranscript": "",
  "cleanedTranscript": "",
  "coreMessage": "",
  "whyItMatters": "",
  "marketTension": "",
  "problemStatement": "",
  "uniqueBelief": "",
  "whyNow": "",
  "founderNarrative": "",
  "strongIdeas": [],
  "mediaHeadlines": [],
  "keyQuotes": [],
  "prAngles": [],
  "editorialStructure": {
    "title": "",
    "subtitle": "",
    "sections": []
  },
  "executiveSummary": "",
  "mediaKit": {
    "companyDescription": "",
    "mission": "",
    "vision": "",
    "positioning": ""
  },
  "mediaArticle": "",
  "founderInterview": "",
  "mediaBrochure": "",
  "linkedinPost": "",
  "shortExtracts": [],
  "missingInformation": [],
  "strategicOpportunities": [],
  "idealCustomerProfile": [],
  "painPoints": [],
  "offerClarity": "",
  "positioning": "",
  "agencyOpportunities": [],
  "growthRecommendations": []
}
          `,
        },
        {
          role: "user",
          content: `
OUTPUT LANGUAGE REQUIRED: ${reportLanguage}
ANALYSIS MODE: ${analysisMode}

SOURCE:
${sourceContent}
          `,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content || "";

    let parsed: any = {};
    try {
      parsed = JSON.parse(cleanJsonString(raw));
    } catch {
      console.error("MEDIA_JSON_PARSE_ERROR", raw);
      parsed = {};
    }

    return NextResponse.json({
      success: true,
      noStorage: true,
      source: rawTranscript ? "audio_video_openai_whisper" : "text_notes",
      analysisMode,
      reportLanguage,

      rawTranscript: rawTranscript || notes,

      translatedTranscript: parsed.translatedTranscript || "",

      correctedTranscript: parsed.correctedTranscript || "",

      transcript:
        parsed.translatedTranscript ||
        parsed.correctedTranscript ||
        parsed.cleanedTranscript ||
        rawTranscript ||
        notes,

      cleanedTranscript:
        parsed.cleanedTranscript ||
        parsed.translatedTranscript ||
        parsed.correctedTranscript ||
        "",

      coreMessage: parsed.coreMessage || "",
      whyItMatters: parsed.whyItMatters || "",
      marketTension: parsed.marketTension || "",
      problemStatement: parsed.problemStatement || "",
      uniqueBelief: parsed.uniqueBelief || "",
      whyNow: parsed.whyNow || "",
      founderNarrative: parsed.founderNarrative || "",

      strongIdeas: Array.isArray(parsed.strongIdeas) ? parsed.strongIdeas : [],
      mediaHeadlines: Array.isArray(parsed.mediaHeadlines)
        ? parsed.mediaHeadlines
        : [],
      keyQuotes: Array.isArray(parsed.keyQuotes) ? parsed.keyQuotes : [],
      prAngles: Array.isArray(parsed.prAngles) ? parsed.prAngles : [],

      editorialStructure: parsed.editorialStructure || {
        title: "",
        subtitle: "",
        sections: [],
      },

      executiveSummary: parsed.executiveSummary || "",

      mediaKit: parsed.mediaKit || {
        companyDescription: "",
        mission: "",
        vision: "",
        positioning: "",
      },

      mediaArticle: parsed.mediaArticle || "",
      founderInterview: parsed.founderInterview || "",
      mediaBrochure: parsed.mediaBrochure || "",
      linkedinPost: parsed.linkedinPost || "",

      shortExtracts: Array.isArray(parsed.shortExtracts)
        ? parsed.shortExtracts
        : [],

      missingInformation: Array.isArray(parsed.missingInformation)
        ? parsed.missingInformation
        : [],

      strategicOpportunities: Array.isArray(parsed.strategicOpportunities)
        ? parsed.strategicOpportunities
        : [],

      idealCustomerProfile: Array.isArray(parsed.idealCustomerProfile)
        ? parsed.idealCustomerProfile
        : [],

      painPoints: Array.isArray(parsed.painPoints) ? parsed.painPoints : [],
      offerClarity: parsed.offerClarity || "",
      positioning: parsed.positioning || "",
      agencyOpportunities: Array.isArray(parsed.agencyOpportunities)
        ? parsed.agencyOpportunities
        : [],
      growthRecommendations: Array.isArray(parsed.growthRecommendations)
        ? parsed.growthRecommendations
        : [],
    });
  } catch (error: any) {
    console.error("MEDIA_ENGINE_ERROR", error);

    return NextResponse.json(
      {
        error: "Erreur serveur Media Engine.",
        details: error?.message || "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}
