1 file changed
+98
-181
lines changed
Search within code
 
‎app/api/generate/route.ts‎
+98
-181
Lines changed: 98 additions & 181 deletions
Original file line number	Diff line number	Diff line change
@@ -1,220 +1,137 @@
import { NextResponse } from "next/server";

type Body = {
  mode?: "AGENCY" | "CREATOR";
  lang?: "fr" | "en-GB" | "en-US" | "es" | "ar";
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
  scriptsCount?: number;
};
function extractTextFromResponsesApi(data: any): string {
  const directText = data?.output_text;
  if (typeof directText === "string" && directText.trim()) return directText;
  const parts = data?.output ?? [];
  for (const item of parts) {
    const content = item?.content ?? [];
    for (const c of content) {
      if (c?.type === "output_text" && typeof c?.text === "string") {
        return c.text;
      }
    }
  }
  return "";
}
function extractJson(text: string) {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {}
  const match = trimmed.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("Impossible de parser le JSON renvoyé par l'IA.");
  }
  return JSON.parse(match[0]);
}
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
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

    const mode = body.mode === "CREATOR" ? "CREATOR" : "AGENCY";
    const scriptsCount =
      typeof body.scriptsCount === "number"
        ? body.scriptsCount
        : mode === "AGENCY"
        ? 10
        : 4;
    const lang = body.lang || "fr";
    const platform = body.platform || "TikTok";
    const objective = body.objective || "Vente";
    const audience = body.audience || "E-commerçants sur TikTok";
    const offer = body.offer || "Produit / offre";
    const price = body.price || "";
    const angle = body.angle || "";
    const objection = body.objection || "";
    const hookType = body.hookType || "";
    const tone = body.tone || "";
    const duration = body.duration || "30s";
    const context = body.context || "";
    const systemPrompt = `
You are an elite UGC and direct-response script generator for paid social and short-form video.
Your job is to generate high-converting marketing scripts.
COUNT RULES
- Return exactly ${scriptsCount} variants.
- If mode is AGENCY, return 10 variants.
- If mode is CREATOR, return 4 variants.
- Never return only 2 variants.
- Every variant must be genuinely different.
DIFFERENTIATION RULES
Each variant must differ in:
- hook angle
- emotional trigger
- framing
- proof style
- CTA wording
OUTPUT RULES
- Return valid JSON only.
- No markdown.
- No explanation outside JSON.
- Respect this exact schema:
    const prompt = `
You are an elite UGC ad copywriter.
{
  "variants": [
    {
      "name": "A",
      "hook": "string",
      "script": {
        "aida": {
          "attention": "string",
          "interest": "string",
          "desire": "string",
          "action": "string"
        }
      },
      "beats": ["string", "string", "string"],
      "proof": ["string", "string"],
      "shotlist": ["string", "string", "string"],
      "cta": {
        "primary": "string"
      }
    }
  ]
}
Generate ${scriptsCount} HIGH-CONVERTING UGC video scripts.
QUALITY RULES
- Hooks must be scroll-stopping.
- Scripts must feel natural, specific, and ready to shoot.
- Use the user's language.
- Adapt to platform, objective, objection, tone, and duration.
`;
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
    const userPrompt = `
Generate ${scriptsCount} variants for this brief.
MODE: ${mode}
LANGUAGE: ${lang}
PLATFORM: ${platform}
OBJECTIVE: ${objective}
AUDIENCE: ${audience}
OFFER: ${offer}
PRICE: ${price}
ANGLE: ${angle}
OBJECTION: ${objection}
HOOK TYPE: ${hookType}
TONE: ${tone}
DURATION: ${duration}
CONTEXT: ${context}
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

    const openaiRes = await fetch("https://api.openai.com/v1/responses", {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
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

    const openaiData = await openaiRes.json();
    const data = await response.json();

    if (!openaiRes.ok) {
      return NextResponse.json(
        {
          error: "OpenAI request failed.",
          details:
            openaiData?.error?.message ||
            JSON.stringify(openaiData) ||
            "Unknown OpenAI error",
        },
        { status: 500 }
      );
    }
    const raw = extractTextFromResponsesApi(openaiData);
    if (!raw) {
      return NextResponse.json(
        { error: "OpenAI returned an empty response." },
        { status: 500 }
      );
    }
    const content = data.choices?.[0]?.message?.content || "";

    let parsed = extractJson(raw);
    let parsed;

    if (!Array.isArray(parsed?.variants)) {
      throw new Error("Réponse IA invalide: variants manquant.");
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = null;
    }

    parsed.variants = parsed.variants.slice(0, scriptsCount);
    return NextResponse.json({
      ok: true,
      raw,
      raw: content,
      parsed,
    });
  } catch (error: any) {
  } catch (err) {
    return NextResponse.json(
      {
        error: "Server error",
        details: error?.message || "Unknown error",
      },
      { error: "Server error", details: String(err) },
      { status: 500 }
    );
  }
0 commit comments
Comments
0
 (0)
Comment
You're not receiving notifications from this thread.
