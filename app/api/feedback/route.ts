import { NextResponse } from "next/server";

type Body = {
  email?: string;
  role?: string;
  rating?: number;
  subject?: string;
  message?: string;
  consent?: boolean;
};

const memory: Record<string, { count: number; ts: number }> = {};

function tooMany(ip: string) {
  const now = Date.now();
  const windowMs = 60_000;
  const max = 10;

  const item = memory[ip] || { count: 0, ts: now };

  if (now - item.ts > windowMs) {
    memory[ip] = { count: 1, ts: now };
    return false;
  }

  item.count += 1;
  memory[ip] = item;
  return item.count > max;
}

async function sendEmailIfConfigured(
  payload: Required<Pick<Body, "email" | "message">> & Body
) {
  const key = process.env.RESEND_API_KEY;

  if (!key) {
    return { sent: false, reason: "NO_RESEND_API_KEY" };
  }

  const subject = payload.subject?.trim()
    ? `UGC Growth Feedback — ${payload.subject.trim()}`
    : `UGC Growth Feedback — ${
        payload.rating ? `${payload.rating}/5` : "nouveau"
      }`;

  const text = [
    "Nouveau feedback UGC Growth",
    "--------------------------",
    `Email: ${payload.email}`,
    `Rôle: ${payload.role || "-"}`,
    `Note: ${payload.rating || "-"}/5`,
    `Consentement: ${payload.consent ? "Oui" : "Non"}`,
    "",
    "Message :",
    payload.message || "",
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "UGC Growth <feedback@ugcgrowth.io>",
      to: ["feedbackugc@outlook.com"],
      reply_to: payload.email,
      subject,
      text,
    }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    console.log("RESEND ERROR:", err);
    return {
      sent: false,
      reason: `RESEND_ERROR: ${res.status} ${err}`,
    };
  }

  return { sent: true };
}

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (tooMany(ip)) {
      return NextResponse.json(
        { ok: false, error: "Too many requests" },
        { status: 429 }
      );
    }

    const body = (await req.json()) as Body;

    if (!body.email || !body.message) {
      return NextResponse.json(
        { ok: false, error: "Email et message requis" },
        { status: 400 }
      );
    }

    if (body.message.trim().length < 10) {
      return NextResponse.json(
        { ok: false, error: "Le message doit contenir au moins 10 caractères" },
        { status: 400 }
      );
    }

    const emailResult = await sendEmailIfConfigured({
      ...body,
      email: body.email,
      message: body.message,
    });

    return NextResponse.json({
      ok: true,
      emailResult,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Server error",
      },
      { status: 500 }
    );
  }
}
