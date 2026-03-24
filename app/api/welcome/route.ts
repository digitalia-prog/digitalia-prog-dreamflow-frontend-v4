import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const key = process.env.RESEND_API_KEY;

    const from =
      process.env.WELCOME_EMAIL_FROM ||
      "UGC Growth <onboarding@resen.dev>";

    if (!key) {
      return NextResponse.json(
        { ok: false, error: "RESEND_API_KEY manquante" },
        { status: 500 }
      );
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: email,
        subject: "Bienvenue dans la bêta UGC Growth 🚀",
        html: `
        <h2>Bienvenue dans la bêta UGC Growth</h2>
        <p>Merci d'avoir rejoint la plateforme.</p>
        <p>Tu peux maintenant tester le Script Engine.</p>
        <p>Envoie ton feedback directement depuis l'app.</p>
        <br/>
        <strong>L'équipe UGC Growth</strong>
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.text().catch(() => "");
      return NextResponse.json(
        { ok: false, error: err },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e.message || "server error" },
      { status: 500 }
    );
  }
}
