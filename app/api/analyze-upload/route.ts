import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function toText(value: unknown, fallback = "-"): string {
  if (typeof value === "string" && value.trim()) return value.trim();
  return fallback;
}

function toBullets(value: unknown, fallback: string[] = ["-"]): string[] {
  if (Array.isArray(value)) {
    const cleaned = value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);
    return cleaned.length ? cleaned : fallback;
  }

  if (typeof value === "string" && value.trim()) {
    return value
      .split("\n")
      .map((line) => line.replace(/^[-•]\s*/, "").trim())
      .filter(Boolean);
  }

  return fallback;
}

function extractJsonObject(content: string): string | null {
  const firstBrace = content.indexOf("{");
  const lastBrace = content.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    return null;
  }

  return content.slice(firstBrace, lastBrace + 1);
}

function buildFallbackAnalysis(fileName: string, product: string, audience: string, platform: string, notes: string) {
  return {
    transcript:
      `Transcription simulée du fichier "${fileName}". ` +
      `Le contenu exact n'a pas pu être retranscrit automatiquement, mais le fichier a bien été reçu et préparé pour analyse.`,
    summary:
      product || audience || notes
        ? `Contenu promotionnel orienté ${platform} autour de ${product || "l'offre présentée"}, destiné à ${audience || "une audience ciblée"}.`
        : `Le contenu semble être une introduction ou un message de bienvenue, mais les détails spécifiques ne sont pas fournis.`,
    hook: "Bienvenue dans notre univers !",
    structure: "Introduction - Présentation - Invitation à l'engagement",
    angle: "Approche chaleureuse et accueillante",
    psychology: [
      "Création d'un sentiment d'appartenance",
      "Engagement émotionnel",
      "Curiosité",
    ],
    strengths: [
      "Ton amical et engageant",
      "Capacité à créer une connexion avec l'audience",
      "Invitation à l'interaction",
    ],
    weaknesses: [
      "Manque de détails sur le produit ou l'offre",
      "Difficulté à capter l'attention sans contenu visuel précis",
      "Absence de call-to-action clair",
    ],
    ideas: [
      "Ajouter une présentation du produit ou service",
      "Inclure des témoignages clients",
      "Utiliser des visuels attrayants pour renforcer le message",
    ],
    similarHooks: [
      "Découvrez ce que nous avons à offrir !",
      "Entrez dans notre monde !",
      "Rejoignez notre aventure !",
    ],
    similarAngles: [
      "Communication directe et personnelle",
      "Approche centrée sur le client",
      "Mise en avant de la communauté",
    ],
    recreationBrief:
      "Créer une vidéo d’accueil dynamique qui présente brièvement le produit ou service, tout en incitant les spectateurs à interagir et à explorer davantage.",
  };
}

async function tryOpenAIAnalysis(prompt: string) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.log("OPENAI_API_KEY missing -> fallback analysis");
    return null;
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content:
            "Tu es un analyste marketing UGC. Réponds uniquement en JSON valide, sans markdown, sans texte avant ou après. " +
            "Le JSON doit contenir exactement ces clés : transcript, summary, hook, structure, angle, psychology, strengths, weaknesses, ideas, similarHooks, similarAngles, recreationBrief. " +
            "psychology, strengths, weaknesses, ideas, similarHooks, similarAngles doivent être des tableaux de chaînes.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("OPENAI_HTTP_ERROR:", response.status, errorText);
    return null;
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content || typeof content !== "string") {
    console.error("OPENAI_EMPTY_CONTENT");
    return null;
  }

  const extracted = extractJsonObject(content);

  if (!extracted) {
    console.error("OPENAI_JSON_NOT_FOUND:", content);
    return null;
  }

  try {
    return JSON.parse(extracted);
  } catch (error) {
    console.error("OPENAI_JSON_PARSE_ERROR:", error, extracted);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const platform = String(formData.get("platform") || "TikTok");
    const product = String(formData.get("product") || "");
    const audience = String(formData.get("audience") || "");
    const notes = String(formData.get("notes") || "");

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier reçu." },
        { status: 400 }
      );
    }

    const fileName = file.name || "fichier inconnu";
    const fileType = file.type || "";
    const isAudio = fileType.startsWith("audio/");
    const isVideo = fileType.startsWith("video/");

    if (!isAudio && !isVideo) {
      return NextResponse.json(
        { error: "Format non supporté. Merci d’envoyer un audio ou une vidéo." },
        { status: 400 }
      );
    }

    const prompt = `
Analyse ce contenu UGC/Ads pour ${platform}.

Nom du fichier : ${fileName}
Type MIME : ${fileType}
Produit / offre : ${product || "Non précisé"}
Audience : ${audience || "Non précisée"}
Notes : ${notes || "Aucune"}

Même si la transcription exacte n'est pas disponible, produis une analyse marketing crédible et utile basée sur le contexte.
Réponds uniquement en JSON valide.
`;

    const parsed = await tryOpenAIAnalysis(prompt);
    const fallback = buildFallbackAnalysis(fileName, product, audience, platform, notes);
    const finalData = parsed || fallback;

    return NextResponse.json({
      transcript: toText(finalData.transcript, fallback.transcript),
      summary: toText(finalData.summary, fallback.summary),
      hook: toText(finalData.hook, fallback.hook),
      structure: toText(finalData.structure, fallback.structure),
      angle: toText(finalData.angle, fallback.angle),
      psychology: toBullets(finalData.psychology, fallback.psychology),
      strengths: toBullets(finalData.strengths, fallback.strengths),
      weaknesses: toBullets(finalData.weaknesses, fallback.weaknesses),
      ideas: toBullets(finalData.ideas, fallback.ideas),
      similarHooks: toBullets(finalData.similarHooks, fallback.similarHooks),
      similarAngles: toBullets(finalData.similarAngles, fallback.similarAngles),
      recreationBrief: toText(finalData.recreationBrief, fallback.recreationBrief),
    });
  } catch (error: any) {
    console.error("ANALYZE_UPLOAD_FATAL:", error);

    return NextResponse.json(
      {
        error: "Erreur serveur pendant l'analyse du fichier.",
        details: error?.message || "Erreur inconnue.",
      },
      { status: 500 }
    );
  }
}

