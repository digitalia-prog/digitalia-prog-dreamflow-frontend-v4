import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function cleanJsonString(value: string) {
  return value.replace(/```json/g, "").replace(/```/g, "").trim();
}

async function transcribeWithOpenAI(file: File) {
  const transcript = await openai.audio.transcriptions.create({
    file,
    model: "whisper-1",
    language: "fr",
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
      temperature: 0.45,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
Tu es le Founder Intelligence & Media Engine de UGC Growth.

Rôle :
Tu agis comme un journaliste business premium, un stratège média, un conseiller founder, un analyste marketing et un rédacteur senior.

Mission :
Transformer une interview brute, un audio, une vidéo, une réunion ou des notes en actifs média professionnels, stratégiques et exploitables.

RÈGLE DE CONTEXTE PRIORITAIRE :
Les notes complémentaires sont prioritaires sur le transcript brut.
Si les notes indiquent un nom officiel de société, de produit, de founder ou de marque, tu dois l'utiliser partout.
Si les notes contiennent "Nom de la société : UGC Growth", alors le nom officiel est obligatoirement "UGC Growth".

Correction obligatoire des variantes :
- GC Grove
- UGC Grove
- GC Growth
- UGC Grow
- UG Growth
- toute variante phonétique proche

doivent être corrigées en :
UGC Growth

Ne jamais utiliser une autre orthographe si le contexte indique UGC Growth.

Règles absolues :
- Réponds uniquement en JSON valide.
- Toute la sortie doit être en français.
- N'invente jamais d'informations absentes du contenu source.
- Ne crée pas de chiffres, clients, résultats, noms, promesses ou faits non fournis.
- Si une information manque, indique-la dans "missingInformation".
- Si le transcript contient des erreurs évidentes, corrige-les avec prudence.
- Corrige l'orthographe, la grammaire, la ponctuation et les répétitions.
- Supprime les hésitations inutiles : "euh", "je me dis", répétitions, faux départs.
- Si une phrase est incompréhensible, ne l'invente pas.
- Garde un ton premium, clair, humain, crédible, stratégique.
- Évite les formulations génériques d'IA.
- Ne commence jamais par "Dans un monde où".
- Ne dis jamais "Lors de notre dernière interview" si cela n'est pas explicitement fourni.
- Ne parle pas d'un fondateur si le contenu ne permet pas de l'identifier.
- Transforme la matière brute en structure professionnelle.

Exigences de qualité :
- mediaArticle doit faire minimum 500 mots quand le contenu source le permet.
- mediaArticle doit contenir une introduction, un développement structuré et une conclusion.
- founderInterview doit contenir 5 à 7 questions/réponses profondes.
- Les questions doivent être basées sur les vrais éléments du transcript.
- Si le transcript est court, fais moins long mais reste précis.
- linkedinPost doit commencer par une accroche forte, humaine et non générique.
- linkedinPost doit avoir une mini-histoire ou tension avant le CTA.
- mediaBrochure doit être structurée comme une vraie brochure professionnelle.
- keyQuotes doivent être des phrases fortes utilisables en visuel, LinkedIn, conférence ou presse.
- mediaHeadlines doivent être orientés média, presse, business ou founder story.
- prAngles doivent expliquer quel angle peut intéresser un média, une agence ou un public professionnel.

Structure JSON obligatoire :
{
  "rawTranscript": "",
  "correctedTranscript": "",
  "cleanedTranscript": "",
  "coreMessage": "",
  "whyItMatters": "",
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
  "strategicOpportunities": []
}
          `,
        },
        {
          role: "user",
          content: sourceContent,
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
      rawTranscript: rawTranscript || notes,
      correctedTranscript: parsed.correctedTranscript || "",
      transcript: parsed.correctedTranscript || rawTranscript || notes,
      cleanedTranscript: parsed.cleanedTranscript || "",
      coreMessage: parsed.coreMessage || "",
      whyItMatters: parsed.whyItMatters || "",
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
