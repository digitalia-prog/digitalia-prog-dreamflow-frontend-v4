import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    return NextResponse.json({
      raw: "Script généré (placeholder)",
      parsed: {
        hook: "Hook exemple",
        body: "Body exemple",
        cta: "CTA exemple"
      }
    });

  } catch (e: any) {
    return NextResponse.json(
      { error: "Server error", details: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}

