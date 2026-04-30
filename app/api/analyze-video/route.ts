async function analyzeTranscript({
  url,
  platform,
  language,
  offer,
  audience,
  notes,
  transcript,
}: {
  url: string;
  platform?: string;
  language?: string;
  offer?: string;
  audience?: string;
  notes?: string;
  transcript: string;
}) {
  const prompt = `
Tu es un expert senior en UGC ads et marketing.

Analyse cette vidéo.

Transcript :
${transcript}

⚠️ IMPORTANT :
- Tu DOIS remplir TOUS les champs
- Aucun champ vide
- Si tu n’as pas d’info → invente intelligemment
- Réponds UNIQUEMENT en JSON

FORMAT STRICT :

{
  "transcript": "${transcript}",
  "summary": "résumé clair",
  "hook": "hook principal",
  "structure": "structure complète",
  "angle": "angle marketing",
  "psychology": ["levier 1", "levier 2"],
  "strengths": ["force 1", "force 2"],
  "weaknesses": ["faiblesse 1", "faiblesse 2"],
  "recreateIdeas": ["idée 1", "idée 2"],
  "similarHooks": ["hook 1", "hook 2"],
  "similarAngles": ["angle 1", "angle 2"],
  "scriptPrompt": "script prêt à tourner",
  "viralScore": "note sur 10 + explication",
  "whyItWorks": ["raison 1", "raison 2"],
  "howToBeat": ["action 1", "action 2"],
  "adsAngles": ["angle ads 1", "angle ads 2"],
  "creativeType": "type de créa"
}
`;

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_ANALYSIS_MODEL || "gpt-4.1-mini",
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content:
          "Tu es un expert marketing UGC. Tu DOIS répondre en JSON COMPLET sans champs vides.",
      },
      { role: "user", content: prompt },
    ],
  });

  const content = completion.choices[0]?.message?.content || "";

  let parsed: any;

  try {
    const cleaned = cleanJsonString(content);
    parsed = JSON.parse(cleaned);
  } catch {
    parsed = {};
  }

  // 🔥 FALLBACK AUTO (remplit tout si manquant)
  return {
    transcript: parsed.transcript || transcript,
    summary: parsed.summary || "Résumé indisponible",
    hook: parsed.hook || "Hook non détecté",
    structure: parsed.structure || "Structure non détectée",
    angle: parsed.angle || "Angle non détecté",
    psychology: parsed.psychology?.length
      ? parsed.psychology
      : ["Curiosité", "Preuve sociale"],
    strengths: parsed.strengths?.length
      ? parsed.strengths
      : ["Contenu engageant"],
    weaknesses: parsed.weaknesses?.length
      ? parsed.weaknesses
      : ["Manque de clarté"],
    recreateIdeas: parsed.recreateIdeas?.length
      ? parsed.recreateIdeas
      : ["Refaire avec structure claire"],
    similarHooks: parsed.similarHooks?.length
      ? parsed.similarHooks
      : ["Hook alternatif"],
    similarAngles: parsed.similarAngles?.length
      ? parsed.similarAngles
      : ["Angle alternatif"],
    scriptPrompt:
      parsed.scriptPrompt || "Créer une vidéo similaire optimisée",
    viralScore: parsed.viralScore || "6/10",
    whyItWorks: parsed.whyItWorks?.length
      ? parsed.whyItWorks
      : ["Contenu relatable"],
    howToBeat: parsed.howToBeat?.length
      ? parsed.howToBeat
      : ["Améliorer le hook"],
    adsAngles: parsed.adsAngles?.length
      ? parsed.adsAngles
      : ["Angle direct response"],
    creativeType: parsed.creativeType || "UGC classique",
  };
}
