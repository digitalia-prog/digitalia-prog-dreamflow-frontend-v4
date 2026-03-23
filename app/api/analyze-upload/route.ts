import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function toText(value: unknown, fallback = "-"): string {
  if (typeof value === "string" && value.trim()) return value.trim();
  return fallback;
}

function ensureThree(value: unknown, fallback: string[]): string[] {
  let arr: string[] = [];

  if (Array.isArray(value)) {
    arr = value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);
  } else if (typeof value === "string" && value.trim()) {
    arr = value
      .split("\n")
      .map((line) => line.replace(/^[-•]\s*/, "").trim())
      .filter(Boolean);
  }

  if (arr.length >= 3) return arr.slice(0, 3);

  const merged = [...arr];
  for (const item of fallback) {
    if (merged.length >= 3) break;
    merged.push(item);
  }

  return merged.slice(0, 3);
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const platform = toText(formData.get("platform"), "TikTok");
    const objective = toText(formData.get("objective"), "Vente");
    const audience = toText(formData.get("audience"), "-");
    const product = toText(formData.get("product"), "-");
    const angle = toText(formData.get("angle"), "-");
    const objection = toText(formData.get("objection"), "-");

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier reçu." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    if (!buffer.length) {
      return NextResponse.json(
        { error: "Le fichier est vide." },
        { status: 400 }
      );
    }

    console.log("UPLOAD OK:", {
      name: file.name,
      type: file.type,
      size: buffer.length,
      platform,
      objective,
    });

    return NextResponse.json({
      success: true,
      file: {
        name: file.name,
        type: file.type || "unknown",
        size: buffer.length,
      },
      analysis: {
        summary: `Fichier reçu avec succès pour analyse ${platform}. Objectif : ${objective}.`,
        hooks: ensureThree(null, [
          "Le hook attire l’attention dès les premières secondes.",
          "Le message met en avant une douleur ou un bénéfice clair.",
          "La structure semble adaptée à un format publicitaire court.",
        ]),
        angles: ensureThree(null, [
          "Douleur / problème",
          "Solution rapide",
          "Preuve visuelle ou démonstration",
        ]),
        context: {
          audience,
          product,
          angle,
          objection,
        },
      },
    });
  } catch (error) {
    console.error("Erreur /api/analyze-upload:", error);

    return NextResponse.json(
      { error: "Erreur serveur pendant l’analyse upload." },
      { status: 500 }
    );
  }
}
