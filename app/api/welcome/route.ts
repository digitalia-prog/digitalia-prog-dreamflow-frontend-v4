import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const email =
      typeof body?.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { ok: false, error: "Email invalide." },
        { status: 400 }
      );
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "UGC Growth <agency@ugcgrowth.io>",
        to: email,
        subject: "Bienvenue dans UGC Growth 🚀",
        html: `
          <h2>Bienvenue dans UGC Growth</h2>
          <p>Merci d'avoir rejoint la plateforme.</p>
          <p>Tu peux maintenant tester le Script Engine.</p>
          <br />
          <strong>L'équipe UGC Growth</strong>
        `,
      }),
    });

    const data = await res.text();

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: data },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });

  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
