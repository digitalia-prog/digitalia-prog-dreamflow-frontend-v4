import { buildEnginePrompts, EngineInput } from "@/lib/scriptEngine";

export const runtime = "nodejs";

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "Missing OPENAI_API_KEY in environment variables." },
        { status: 500 }
      );
    }

    const body = (await req.json()) as Partial<EngineInput>;
    const required = [
      "mode",
      "lang",
      "platform",
      "objective",
      "audience",
      "offer",
      "angle",
      "objection",
      "hookType",
      "tone",
      "duration",
    ] as const;

    for (const k of required) {
      if (!body[k]) {
        return Response.json(
        { error: "Missing field", details: String(k) },
        { status: 400 }
        );
      }
    }

    const input = body as EngineInput;
    const { system, user } = buildEnginePrompts(input);

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.7,
      }),
    });

    const data = await r.json();

    if (!r.ok) {
      return Response.json(
        { error: "OpenAI API error", details: JSON.stringify(data) },
        { status: 500 }
      );
    }

    const raw =
      data?.output?.[0]?.content?.[0]?.text ??
      data?.output_text ??
      "";

    const parsed = safeJsonParse(raw);

    return Response.json({ raw, parsed });
  } catch (e: any) {
    return Response.json(
      { error: "Server error", details: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}
