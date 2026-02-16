import { NextResponse } from "next/server"
import { buildEnginePrompt, EngineInput } from "@/lib/scriptEngine"

export async function POST(req: Request) {
  try {
    const body = await req.json() as EngineInput

    const required = [
      "userType",
      "platform",
      "objective",
      "offer",
      "audience",
      "angle",
      "hookType",
      "tone"
    ]

    for (const key of required) {
      if (!(key in body)) {
        return NextResponse.json(
          { error: `Missing field: ${key}` },
          { status: 400 }
        )
      }
    }

    const prompt = buildEnginePrompt(body)

    // Pour l’instant on renvoie juste le prompt structuré
    // On branchera OpenAI après

    return NextResponse.json({
      success: true,
      prompt
    })

  } catch (e: any) {
    return NextResponse.json(
      { error: "Server error", details: String(e?.message ?? e) },
      { status: 500 }
    )
  }
}

