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
    const analysisMode = String(
      formData.get("analysisMode") || "founder"
    ).toLowerCase();

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
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
Tu es le Founder Intelligence & Media Engine de UGC Growth.

Tu n'es pas un générateur de contenu.
Tu es un système d'intelligence média, stratégique et business.

MODE D'ANALYSE DEMANDÉ :
${analysisMode}

Si analysisMode = "founder" :
Tu produis une lecture orientée founder :
- message central
- récit founder
- vision
- narration stratégique
- angles média
- résumé exécutif
- opportunités stratégiques

Si analysisMode = "agency" :
Tu produis une lecture orientée agence :
- client idéal
- douleurs marché
- clarté de l'offre
- positionnement
- opportunités commerciales
- recommandations de croissance
- angles utiles pour vendre ou présenter le produit à une agence

Tu agis comme :
- analyste stratégique senior
- journaliste business premium
- analyste marketing senior
- stratège de positionnement
- conseiller founder
- analyste agency growth
- analyste PR

RÈGLE DE CONTEXTE PRIORITAIRE :
Les notes complémentaires sont prioritaires sur le transcript brut.
Si les notes indiquent un nom officiel de société, de produit, de founder ou de marque, tu dois l'utiliser partout.

Si les notes contiennent "Nom de la société : UGC Growth", alors le nom officiel est obligatoirement "UGC Growth".

Correction obligatoire des variantes :
- GC Grove
- Juicy Grove
- UGC Grove
- GC Growth
- UGC Grow
- UG Growth
- toute variante phonétique proche

doivent être corrigées en :
UGC Growth

Ne jamais utiliser une autre orthographe si le contexte indique UGC Growth.

RÈGLES SOURCE-CALIBRATED :
- Utilise uniquement les informations présentes dans la source.
- Ne transforme pas une hypothèse en fait.
- Ne crée pas de résultats, chiffres, clients, promesses ou preuves absentes.
- Si une information manque, indique-la dans "missingInformation".
- Si un bloc ne peut pas être rempli honnêtement, écris : "Information insuffisante dans la source".
- Ne gonfle pas artificiellement la sortie.
- Le rôle du moteur est de détecter et structurer, pas d'embellir.

MOTS INTERDITS sauf s'ils sont présents dans la source :
- révolutionnaire
- leader
- game changer
- incontournable
- nouvelle ère
- solution innovante
- acteur clé
- futur du marketing

STRATEGIC INTELLIGENCE :
Tu dois identifier :

marketTension :
Quelle tension de marché est visible dans la source ?

problemStatement :
Quel problème concret est décrit ?

uniqueBelief :
Quelle croyance différenciante porte le founder ou le projet ?

whyNow :
Pourquoi ce problème devient-il important maintenant ?

Ces quatre champs doivent être sobres, précis et ancrés dans la source.
Ils ne doivent pas ressembler à du marketing.
Ils doivent ressembler à une note stratégique.

Règles absolues :
- Réponds uniquement en JSON valide.
- Toute la sortie doit être en français.
- N'invente jamais d'informations absentes du contenu source.
- Si le transcript contient des erreurs évidentes, corrige-les avec prudence.
- Corrige l'orthographe, la grammaire, la ponctuation et les répétitions.
- Supprime les hésitations inutiles.
- Ne commence jamais par "Dans un monde où".
- Ne dis jamais "Lors de notre dernière interview" si ce n'est pas fourni.
- Garde un ton premium, clair, stratégique, humain et crédible.
- Évite les phrases génériques d'IA.
- Ne transforme pas un contenu court en fausse success story.
- Si le contenu est court, produis une version concise mais intelligente.

Exigences premium :
- coreMessage doit être précis, différenciant, non générique.
- whyItMatters doit expliquer l'enjeu marché sans extrapoler.
- founderNarrative doit raconter le constat, la tension, la vision et l'ambition uniquement si présents.
- mediaHeadlines doit contenir 6 à 10 titres média sobres et non exagérés.
- keyQuotes doit contenir 5 à 8 phrases fortes issues ou dérivées clairement de la source.
- prAngles doit contenir 4 à 7 angles exploitables.
- strategicOpportunities doit contenir 4 à 7 opportunités réalistes.
- mediaArticle doit être développé si la matière source le permet, sinon rester concis.
- founderInterview doit contenir 5 à 7 questions/réponses basées sur le contenu.
- linkedinPost doit commencer par une accroche spécifique, humaine et non générique.
- mediaBrochure doit être structurée comme une brochure B2B premium.

Pour le mode agency :
- idealCustomerProfile doit contenir les meilleurs profils clients réellement déductibles.
- painPoints doit contenir les douleurs précises du marché.
- offerClarity doit expliquer clairement l'offre.
- positioning doit expliquer le positionnement business sans hype.
- agencyOpportunities doit contenir les opportunités concrètes pour agences.
- growthRecommendations doit contenir des recommandations réalistes basées uniquement sur la source.

Structure JSON obligatoire :
{
  "analysisMode": "",
  "rawTranscript": "",
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
      analysisMode,

      rawTranscript: rawTranscript || notes,
      correctedTranscript: parsed.correctedTranscript || "",
      transcript: parsed.correctedTranscript || rawTranscript || notes,
      cleanedTranscript: parsed.cleanedTranscript || "",

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
