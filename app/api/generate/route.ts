import { buildEnginePrompts, EngineInput } from "@/lib/scriptEngine";

export const runtime = "nodejs";

type ApiOk = { raw: string; parsed: any | null };
type ApiErr = { error: string; details?: string };

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
      return Response.json<ApiErr>(
        { error: "Missing OPENAI_API_KEY in environment variables." },
        { status: 500 }
      );
    }

    const body = (await req.json()) as Partial<EngineInput>;
    const required = ["mode","lang","platform","objective","audience","offer","angle","objection","hookType","tone","duration"] as const;
    for (const k of required) {
      if (!body[k]) {
        return Response.json<ApiErr>(
          { error: "Missing field", details: String(k) },
          { status: 400 }
        );
      }
    }

    const input = body as EngineInput;
    const { system, user } = buildEnginePrompts(input);

    // Responses API (simple via fetch)
    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
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
      return Response.json<ApiErr>(
        { error: "OpenAI API error", details: JSON.stringify(data) },
        { status: 500 }
      );
    }

    // On récupère le texte de sortie
    const raw =
      data?.output?.[0]?.content?.[0]?.text ??
      data?.output_text ??
      "";

    const parsed = safeJsonParse(raw);

    return Response.json<ApiOk>({ raw, parsed });
  } catch (e: any) {
    return Response.json<ApiErr>(
      { error: "Server error", details: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}
