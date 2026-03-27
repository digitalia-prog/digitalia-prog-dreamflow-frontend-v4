import { NextResponse } from "next/server";

type Mode = "AGENCY" | "CREATOR";

type GenerateBody = {
  mode?: Mode;
  lang?: string;
  platform?: string;
  objective?: string;
  audience?: string;
  offer?: string;
  price?: string;
  angle?: string;
  objection?: string;
  hookType?: string;
  tone?: string;
  duration?: string;
  context?: string;
};

export async function POST(req: Request) {
  try {
    const body: GenerateBody = await req.json();

    const mode: Mode = body.mode === "AGENCY" ? "AGENCY" : "CREATOR";
    const lang = body.lang || "fr";
    const platform = body.platform || "TikTok";
    const objective = body.objective || "Vente";
    const audience = body.audience || "";
    const offer = body.offer || "";
    const price = body.price || "";
    const angle = body.angle || "";
    const objection = body.objection || "";
    const hookType = body.hookType || "";
    const tone = body.tone || "";
    const duration = body.duration || "";
    const context = body.context || "";

    const scriptsCount = mode === "AGENCY" ? 10 : 4;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY in environment variables." },
        { status: 500 }
      );
    }

    const systemPrompt = `
You are Script Engine, a senior direct-response strategist, UGC creative strategist, performance marketer.

PSYCHOLOGICAL MARKETING RULES

Every script must use psychological persuasion:

Use at least 2:
- Fear of missing out
- Social proof
- Urgency
- Curiosity
- Problem agitation
- Status desire
- Simplicity bias
- Loss aversion
- Speed benefit

PSYCHOLOGY STRUCTURE

1. Frustration
2. Problem amplification
3. Solution
4. Emotional benefit
5. Logical benefit
6. Credibility
7. CTA

HUMAN RULES

- Natural spoken language
- No corporate tone
- No generic phrases
- Realistic scripts

SCRIPT STRUCTURE

HOOK
HOOK DETECTED
SCRIPT (AIDA)
BEATS
BEATS TIMING
PROOF
WHY IT WORKS
ADS VARIANTS
SHOTLIST
CTA
CTA OPTIMIZED
TESTING PLAN
KPI

Return JSON only
`;

    const userPrompt = `
Generate ${scriptsCount} scripts

Inputs

Audience: ${audience}
Offer: ${offer}
Price: ${price}
Angle: ${angle}
Platform: ${platform}
Objective: ${objective}
Hook type: ${hookType}
Tone: ${tone}
Duration: ${duration}
Context: ${context}
Objection: ${objection}

Return JSON:

{
  "hookIdeas": ["", ""],
  "creativeAngles": ["", "", ""],
  "testingPlanSummary": "",
  "variants": [
    {
      "hook": "",
      "hookDetected": "",
      "script": {
        "aida": {
          "attention": "",
          "interest": "",
          "desire": "",
          "action": ""
        }
      },
      "beats": [],
      "beatsTiming": [],
      "proof": [],
      "whyItWorks": [],
      "adsVariants": [],
      "shotlist": [],
      "cta": {
        "primary": "",
        "optimized": ""
      },
      "testingPlan": "",
      "kpi": ""
    }
  ]
}
`;

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          temperature: 1,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "OpenAI request failed",
          details: data?.error?.message || "Unknown error",
        },
        { status: 500 }
      );
    }

    const raw = data?.choices?.[0]?.message?.content || "";

    let parsed: any;

    try {
      parsed = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        {
          error: "Failed to parse AI JSON response",
          raw,
        },
        { status: 500 }
      );
    }

    const hookIdeas = Array.isArray(parsed?.hookIdeas) ? parsed.hookIdeas : [];
    const creativeAngles = Array.isArray(parsed?.creativeAngles)
      ? parsed.creativeAngles
      : [];
    const testingPlanSummary =
      typeof parsed?.testingPlanSummary === "string"
        ? parsed.testingPlanSummary
        : "";

    let variants = Array.isArray(parsed?.variants) ? parsed.variants : [];

    variants = variants.map((variant: any) => ({
      hook: variant?.hook || "",
      hookDetected: variant?.hookDetected || "",
      script: {
        aida: {
          attention: variant?.script?.aida?.attention || "",
          interest: variant?.script?.aida?.interest || "",
          desire: variant?.script?.aida?.desire || "",
          action: variant?.script?.aida?.action || "",
        },
      },
      beats: variant?.beats || [],
      beatsTiming: variant?.beatsTiming || [],
      proof: variant?.proof || [],
      whyItWorks: variant?.whyItWorks || [],
      adsVariants: variant?.adsVariants || [],
      shotlist: variant?.shotlist || [],
      cta: {
        primary: variant?.cta?.primary || "",
        optimized: variant?.cta?.optimized || "",
      },
      testingPlan: variant?.testingPlan || "",
      kpi: variant?.kpi || "",
    }));

    return NextResponse.json({
      hookIdeas,
      creativeAngles,
      testingPlanSummary,
      variants,
      raw,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Unexpected server error",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
