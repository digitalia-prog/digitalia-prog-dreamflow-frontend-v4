import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Ajoute une vidéo ou un fichier audio." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      transcript: "TEST TRANSCRIPT OK",
      summary: "TEST SUMMARY OK",
      hook: "TEST HOOK OK",
      structure: "TEST STRUCTURE OK",
      angle: "TEST ANGLE OK",
      psychology: ["TEST PSYCHO 1", "TEST PSYCHO 2", "TEST PSYCHO 3"],
      strengths: ["TEST STRENGTH 1", "TEST STRENGTH 2", "TEST STRENGTH 3"],
      weaknesses: ["TEST WEAKNESS 1", "TEST WEAKNESS 2", "TEST WEAKNESS 3"],
      recreateIdeas: ["TEST IDEA 1", "TEST IDEA 2", "TEST IDEA 3"],
      similarHooks: ["TEST HOOK A", "TEST HOOK B", "TEST HOOK C"],
      similarAngles: ["TEST ANGLE A", "TEST ANGLE B", "TEST ANGLE C"],
      scriptPrompt: "TEST SCRIPT PROMPT OK"
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Erreur serveur",
        details: String(error?.message || error),
      },
      { status: 500 }
    );
  }
}
=
