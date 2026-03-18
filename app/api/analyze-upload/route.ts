import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as any

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      )
    }

    console.log("FILE TYPE:", file.type)
    console.log("FILE NAME:", file.name)

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // ⚠️ simulation analyse (temporaire pour éviter crash)
    const fakeTranscript = "Ceci est une transcription simulée de 60 secondes."

    const analysis = {
      resume: "Vidéo courte avec hook émotionnel",
      hook: "Attire l'attention dès les 3 premières secondes",
      structure: "Hook → message → CTA",
      angle: "Emotion / curiosité",
      psychologie: "Curiosité + identification",
      points_forts: ["Hook rapide", "Message clair"],
      points_faibles: ["Pas assez de preuve sociale"],
      idees: ["Ajouter témoignage", "Cut plus rapide"],
    }

    return NextResponse.json({
      success: true,
      transcript: fakeTranscript,
      analysis,
    })

  } catch (error: any) {
    console.error("UPLOAD ERROR:", error)

    return NextResponse.json(
      {
        error: "Audio file processing failed",
        details: error?.message || "unknown error"
      },
      { status: 500 }
    )
  }
}
