import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url, platform, offer, audience } = body;

    const analysis = {
      summary: "Vidéo analysée avec succès",
      hook: "Hook principal détecté dans la vidéo",
      structure: "Hook → Démonstration → Preuve → CTA",
      angle: "Focus sur le gain de temps",
      psychology: [
        "Curiosité",
        "Résolution de problème",
        "Projection utilisateur"
      ],
      strengths: [
        "Hook rapide",
        "Message clair",
        "Produit visible rapidement"
      ],
      weaknesses: [
        "CTA peu visible",
        "Manque de preuve sociale"
      ],
      recreateIdeas: [
        "Montrer le problème avant le produit",
        "Ajouter un témoignage utilisateur"
      ],
      similarHooks: [
        "Tu fais encore cette erreur ?",
        "Personne ne parle de cette astuce"
      ],
      similarAngles: [
        "Gain de temps",
        "Transformation rapide"
      ],
      scriptPrompt:
        "Créer un script UGC inspiré de cette vidéo avec un hook fort et une démonstration rapide"
    };

    return NextResponse.json(analysis);

  } catch (error) {
    return NextResponse.json(
      { error: "Erreur analyse vidéo" },
      { status: 500 }
    );
  }
