import { NextResponse } from "next/server";
import { buildEnginePrompt, EngineInput } from "@/lib/scriptEngine";

type Req = EngineInput;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<Req>;

    // validation minimale
    const required: (keyof Req)[] = [
      "mode",
      "lang",
      "platform",
      "objective",
      "audience",
      "offer",
      "angle",
      "objection",
      "hookType",
      "tone",
      "duration",
      "framework",
    ];

    for (const k of required) {
      if (!body[k]) {
        return NextResponse.json(
          { error: `Missing field: ${String(k)}` },
          { status: 400 }
        );
      }
    }

    const engineInput = body as Req;
    const built = buildEnginePrompt(engineInput);

    // ⚠️ Pour l’instant on renvoie un résultat "simulé" (sans OpenAI)
    // Ensuite on branchera OpenAI proprement (clé dans Vercel env).
    const simulated = simulateScript(engineInput);

    return NextResponse.json({
      title: built.title,
      meta: built.meta,
      prompt: built.prompt, // ton “propriétaire” = ce prompt structuré
      output: simulated,    // résultat lisible direct
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Server error", details: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}

// Génération locale (placeholder) : on branchera OpenAI après
function simulateScript(input: Req) {
  const v1 = [
    `HOOK: [${input.hookType}]`,
    `ATTENTION: Si tu veux ${input.objective.toLowerCase()}, écoute bien.`,
    `INTEREST: ${input.offer}`,
    `DESIRE: Angle: ${input.angle} — Objection: ${input.objection}`,
    `ACTION: Commente "GO" / clique / DM selon objectif.`,
  ].join("\n\n");

  const v2 = [
    `PROBLÈME: ${input.objection}`,
    `AGITATION: Tu perds du temps / argent sans méthode.`,
    `SOLUTION: ${input.offer}`,
    `ANGLE: ${input.angle}`,
    `CTA: Passe à l’action maintenant.`,
  ].join("\n\n");

  return {
    variantA: v1,
    variantB: v2,
    hooks: [
      "Hook alternatif 1",
      "Hook alternatif 2",
      "Hook alternatif 3",
    ],
    ctas: [
      "CTA alternatif 1",
      "CTA alternatif 2",
      "CTA alternatif 3",
    ],
    notes: [
      "Rythme rapide, cuts toutes les 1-2s.",
      "Sous-titres dynamiques.",
      "Pattern interrupt visuel au hook.",
    ],
  };
}
