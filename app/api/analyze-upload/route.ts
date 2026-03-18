import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AnalyzeUploadResponse = {
  transcript: string;
  summary: string;
  hook: string;
  structure: string;
  angle: string;
  psychology: string[];
  strengths: string[];
  weaknesses: string[];
  ideas: string[];
  similarHooks: string[];
  similarAngles: string[];
  recreationBrief: string;
};

function safeString(value: unknown, fallback = "-"): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function safeArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatBulletList(items: string[]): string {
  if (!items.length) return "-";
  return items.map((item) => `• ${item}`).join("\n");
}

async function fakeTranscriptFromFile(file: File): Promise<string> {
  const fileName = file.name || "fichier";
  return `Transcription simulée du fichier "${fileName}". Le contenu exact n’a pas encore été retranscrit automatiquement, mais le fichier a bien été reçu et préparé pour analyse.`;
}

function buildFallbackAnalysis(params: {
  transcript: string;
  platform: string;
  product: string;
  audience: string;
  notes: string;
  fileName: string;
}): AnalyzeUploadResponse {
  const { transcript, platform, product, audience, notes, fileName } = params;

  const contextBits = [
    platform ? `Plateforme : ${platform}` : null,
    product ? `Produit / offre : ${product}` : null,
    audience ? `Audience : ${audience}` : null,
    notes ? `Notes : ${notes}` : null,
  ].filter(Boolean);

  return {
    transcript,
    summary:
      `Le fichier "${fileName}" a bien été reçu. ` +
      `Le contenu semble destiné à une analyse marketing ${platform ? `sur ${platform}` : ""}. ` +
      `L’objectif est d’identifier le message principal, la mécanique d’accroche et les éléments à reproduire pour créer un contenu plus performant.`,
    hook:
      "Le hook repose probablement sur une accroche rapide dès les premières secondes pour capter l’attention et poser immédiatement le sujet.",
    structure:
      "1. Accroche immédiate\n2. Mise en contexte rapide\n3. Démonstration / développement\n4. Message principal\n5. Conclusion ou appel à l’action",
    angle:
      "Angle principal : capter l’attention rapidement avec un message simple, clair et facilement mémorisable.",
    psychology: [
      "Curiosité",
      "Identification",
      "Clarté du message",
      "Promesse de valeur rapide",
    ],
    strengths: [
      "Format exploitable pour contenu social",
      "Base utile pour extraire un hook",
      "Peut être retravaillé en script UGC ou ads",
    ],
    weaknesses: [
      "Transcription automatique réelle non encore branchée",
      "Certaines nuances du ton ou du visuel peuvent manquer",
      "Analyse encore générique si le contenu du fichier n’est pas détaillé",
    ],
    ideas: [
      "Renforcer l’accroche dès les 2 premières secondes",
      "Ajouter un bénéfice utilisateur plus explicite",
      "Finir avec un CTA plus net",
    ],
    similarHooks: [
      "Attends de voir ça…",
      "Le détail que personne ne remarque au début",
      "Voilà pourquoi ce contenu retient l’attention",
    ],
    similarAngles: [
      "Avant / après",
      "Problème / solution",
      "Réaction émotionnelle",
    ],
    recreationBrief:
      `Crée une vidéo courte avec une accroche forte dès le début, un message simple et un déroulé fluide. ` +
      `Mets en avant le point principal du contenu, puis termine par une conclusion claire ou un appel à l’action. ` +
      `${contextBits.length ? `Contexte fourni : ${contextBits.join(" | ")}.` : ""}`,
  };
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("file");
    const platform = safeString(formData.get("platform"), "");
    const product = safeString(formData.get("product"), "");
    const audience = safeString(formData.get("audience"), "");
    const notes = safeString(formData.get("notes"), "");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Aucun fichier reçu." },
        { status: 400 }
      );
    }

    const transcript = await fakeTranscriptFromFile(file);

    let analysis: AnalyzeUploadResponse | null = null;

    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (openaiApiKey) {
      try {
        const prompt = `
Tu es un analyste marketing UGC / Ads.

Analyse ce contenu uploadé à partir de sa transcription et du contexte.
Réponds UNIQUEMENT en JSON valide avec exactement ces clés :
{
  "transcript": "string",
  "summary": "string",
  "hook": "string",
  "structure": "string",
  "angle": "string",
  "psychology": ["string"],
  "strengths": ["string"],
  "weaknesses": ["string"],
  "ideas": ["string"],
  "similarHooks": ["string"],
  "similarAngles": ["string"],
  "recreationBrief": "string"
}

Contexte :
- Plateforme: ${platform || "non précisée"}
- Produit / Offre: ${product || "non précisé"}
- Audience: ${audience || "non précisée"}
- Notes: ${notes || "aucune"}

Transcription :
${transcript}
        `.trim();

        const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiApiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            temperature: 0.7,
            messages: [
              {
                role: "system",
                content:
                  "Tu es un expert en analyse marketing UGC, TikTok Ads, Reels et hooks publicitaires.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
          }),
        });

        const rawText = await openaiRes.text();

        if (!openaiRes.ok) {
          console.error("OPENAI API ERROR:", rawText);
          throw new Error("OpenAI request failed");
        }

        let parsedOuter: any;
        try {
          parsedOuter = JSON.parse(rawText);
        } catch (e) {
          console.error("OPENAI RAW NON-JSON:", rawText);
          throw new Error("Invalid OpenAI outer JSON");
        }

        const content = parsedOuter?.choices?.[0]?.message?.content;

        if (!content || typeof content !== "string") {
          throw new Error("OpenAI content missing");
        }

        let parsedContent: any;
        try {
          parsedContent = JSON.parse(content);
        } catch {
          const cleaned = content
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();

          parsedContent = JSON.parse(cleaned);
        }

        analysis = {
          transcript: safeString(parsedContent?.transcript, transcript),
          summary: safeString(parsedContent?.summary),
          hook: safeString(parsedContent?.hook),
          structure: safeString(parsedContent?.structure),
          angle: safeString(parsedContent?.angle),
          psychology: safeArray(parsedContent?.psychology),
          strengths: safeArray(parsedContent?.strengths),
          weaknesses: safeArray(parsedContent?.weaknesses),
          ideas: safeArray(parsedContent?.ideas),
          similarHooks: safeArray(parsedContent?.similarHooks),
          similarAngles: safeArray(parsedContent?.similarAngles),
          recreationBrief: safeString(parsedContent?.recreationBrief),
        };
      } catch (error) {
        console.error("ANALYZE_UPLOAD_OPENAI_FAIL:", error);
      }
    }

    if (!analysis) {
      analysis = buildFallbackAnalysis({
        transcript,
        platform,
        product,
        audience,
        notes,
        fileName: file.name || "fichier uploadé",
      });
    }

    return NextResponse.json({
      transcript: analysis.transcript,
      summary: analysis.summary,
      hook: analysis.hook,
      structure: analysis.structure,
      angle: analysis.angle,
      psychology: formatBulletList(analysis.psychology),
      strengths: formatBulletList(analysis.strengths),
      weaknesses: formatBulletList(analysis.weaknesses),
      ideas: formatBulletList(analysis.ideas),
      similarHooks: formatBulletList(analysis.similarHooks),
      similarAngles: formatBulletList(analysis.similarAngles),
      recreationBrief: analysis.recreationBrief,
    });
  } catch (error) {
    console.error("ANALYZE_UPLOAD_ROUTE_FATAL:", error);

    return NextResponse.json(
      {
        error: "Erreur serveur pendant l’analyse du fichier.",
      },
      { status: 500 }
    );
  }
}
