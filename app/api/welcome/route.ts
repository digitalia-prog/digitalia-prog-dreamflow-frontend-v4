import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    const email =
      typeof body?.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { ok: false, error: "Email invalide" },
        { status: 400 }
      );
    }

    const key = process.env.RESEND_API_KEY;
    const from =
      process.env.WELCOME_EMAIL_FROM ||
      "UGC Growth <agency@ugcgrowth.io>";

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
        subject: "Bienvenue dans UGC Growth 🚀",
        html: `
          <h2>Bienvenue dans UGC Growth</h2>
          <p>Merci d'avoir rejoint la plateforme.</p>
          <p>Tu peux maintenant tester le Script Engine.</p>
          <p>Envoie ton feedback directement depuis l'app.</p>
          <br />
          <strong>L'équipe UGC Growth</strong>
        `,
      }),
    });

    const data = await res.text().catch(() => "");

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: data || "Erreur Resend" },
        { status: res.status }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || "server error" },
      { status: 500 }
    );
  }
}
