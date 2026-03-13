import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      mode,
      lang,
      platform,
      objective,
      audience,
      offer,
      price,
      angle,
      objection,
      hookType,
      tone,
      duration,
      context,
    } = body;

    const scriptsCount = mode === "AGENCY" ? 10 : 4;

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY in environment variables." },
        { status: 500 }
      );
    }

    const prompt = `
You are an elite UGC ad copywriter.

Generate ${scriptsCount} HIGH-CONVERTING UGC video scripts.

Product:
${offer}

Price:
${price}

Audience:
${audience}

Platform:
${platform}

Marketing angle:
${angle}

Main objection:
${objection}

Hook type:
${hookType}

Tone:
${tone}

Video duration:
${duration}

Extra context:
${context}

IMPORTANT RULES:
- Focus ONLY on selling the product
- Do NOT mention scripts, SaaS, or marketing tools
- Use psychological persuasion
- Each script must feel like a real creator talking
- Hooks must stop scrolling
- Add proof and demonstration

Return ONLY JSON in this format:

{
 "variants":[
  {
   "hook":"",
   "problem":"",
   "demo":"",
   "proof":"",
   "objection":"",
   "cta":"",
   "shotlist":[]
  }
 ]
}
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.9,
        messages: [
          {
            role: "system",
            content: "You are an expert direct response ad copywriter.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();

    const content = data.choices?.[0]?.message?.content || "";

    let parsed;

    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = null;
    }

    return NextResponse.json({
      raw: content,
      parsed,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error", details: String(err) },
      { status: 500 }
    );
  }
}
