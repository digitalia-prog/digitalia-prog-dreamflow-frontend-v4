import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const analysis = {
      summary: "Vidéo analysée avec succès",
      hook: "Hook principal détecté",
      structure: "Hook → Démonstration → Preuve → CTA",
      angle: "Gain de temps",
      psychology: ["Curiosité","Résolution de problème"],
      strengths: ["Hook rapide","Produit visible"],
      weaknesses: ["CTA faible"],
      recreateIdeas: ["Montrer le problème avant le produit"],
      similarHooks: ["Tu fais encore cette erreur ?"],
      similarAngles: ["Gain de temps"],
      scriptPrompt: "Créer un script UGC inspiré de cette vidéo"
    };

    return NextResponse.json(analysis);

  } catch (error) {
    return NextResponse.json({ error: "Analyse impossible" }, { status: 500 });
  }
}
