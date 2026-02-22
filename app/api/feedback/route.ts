import { NextResponse } from "next/server";

type Body = {
  name?: string;
  email?: string;
  role?: "creator" | "agency" | "other";
  rating?: "5" | "4" | "3" | "2" | "1";
  subject?: string;
  message?: string;
  consent?: boolean;
};

// (Optionnel) petite “anti-abus” soft (pas parfait en serverless, mais ok en beta)
const memory: Record<string, { count: number; ts: number }> = {};

function tooMany(ip: string) {
  const now = Date.now();
  const windowMs = 60_000; // 1 min
  const max = 10; // 10 envois / min / ip

  const item = memory[ip] || { count: 0, ts: now };
  if (now - item.ts > windowMs) {
    memory[ip] = { count: 1, ts: now };
    return false;
  }
  item.count += 1;
  memory[ip] = item;
  return item.count > max;
}

// Email via Resend si configuré
async function sendEmailIfConfigured(payload: Required<Pick<Body, "email" | "message">> & Body) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.FEEDBACK_TO || "feedback@ugcgrowth.com";
  const from = process.env.FEEDBACK_FROM || "UGC Growth <onboarding@resend.dev>";

  if (!key) return { sent: false, reason: "NO_RESEND_API_KEY" };

  const subject =
    payload.subject?.trim()
      ? `UGC Growth Feedback — ${payload.subject.trim()}`
      : `UGC Growth Feedback — ${payload.rating ? `${payload.rating}/5` : "nouveau"}`;

  const text = [
    "Nouveau feedback UGC GROWTH",
    "--------------------------",
    `Nom: ${payload.name || "-"}`,
    `Email: ${payload.email}`,
    `Rôle: ${payload.role || "-"}`,
    `Note: ${payload.rating || "-"}/5`,
    `Consent: ${payload.consent ? "Oui" : "Non"}`,
    "",
    "Message:",
    payload.message || "",
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      text,
      reply_to: payload.email,
    }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    return { sent: false, reason: `RESEND_ERROR: ${res.status} ${err}` };
  }
  return { sent: true };
}

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (ip !== "unknown" && tooMany(ip)) {
      return NextResponse.json({ error: "Trop de demandes. Réessaie dans 1 minute." }, { status: 429 });
    }

    const body = (await req.json()) as Body;

    if (!body.email || !body.email.includes("@")) {
      return NextResponse.json({ error: "Email invalide." }, { status: 400 });
    }
    if (!body.message || body.message.trim().length < 10) {
      return NextResponse.json({ error: "Message trop court (min 10 caractères)." }, { status: 400 });
    }

    const result = await sendEmailIfConfigured({
      ...body,
      email: body.email,
      message: body.message,
    });

    // Même sans email configuré, on renvoie OK (beta)
    if (!result.sent) {
      console.log("[feedback] received (email not sent):", { ip, body, reason: result.reason });
      return NextResponse.json({ ok: true, sent: false });
    }

    return NextResponse.json({ ok: true, sent: true });
  } catch (e: any) {
    return NextResponse.json({ error: "Server error", details: String(e?.message ?? e) }, { status: 500 });
  }
}
