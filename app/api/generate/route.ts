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
    const lang = body.lang || "FR";
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
You are Script Engine, a senior direct-response strategist.

PSYCHOLOGICAL MARKETING RULES

Use:
- curiosity
- FOMO
- social proof
- urgency
- desire
- pain points
- status

PLATFORM ADAPTATION RULES

TikTok:
- fast hook
- creator tone

Facebook Ads:
- direct response

Google Ads:
- high intent

Instagram:
- storytelling

YouTube Shorts:
- retention

CREATIVE DIRECTION

Identify:
- frustration
- desire
- emotional angle

Each script must include:

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

Return ONLY valid JSON.
`;

    const userPrompt = `
Generate exactly ${scriptsCount} high-quality scripts in ${lang}.

Platform: ${platform}
Objective: ${objective}
Audience: ${audience}
Product: ${offer}
Price: ${price}
Angle: ${angle}
Objection: ${objection}
Tone: ${tone}
Duration: ${duration}
Context: ${context}

Return JSON format:

{
"platformStrategy":"",
"psychologicalAngle":"",
"creativeDirection":"",
"variants":[
{
"hook":"",
"hookDetected":"",
"script":{
"aida":{
"attention":"",
"interest":"",
"desire":"",
"action":""
}
},
"beats":[],
"beatsTiming":[],
"proof":[],
"whyItWorks":[],
"adsVariants":[],
"shotlist":[],
"cta":{
"primary":"",
"optimized":""
},
"testingPlan":[],
"kpi":[]
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
          Authorization: "Bearer " + process.env.OPENAI_API_KEY,
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

    const raw =
      data?.choices?.[0]?.message?.content || "";

    let parsed = null;

    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      return NextResponse.json(
        {
          error: "JSON parse failed",
          raw,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      raw,
      parsed,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Script generation failed",
        details: error?.message || "unknown error",
      },
      { status: 500 }
    );
  }
}
