import { NextResponse } from "next/server";
import { checkQuota } from "@/lib/security";

type Mode = "AGENCY" | "CREATOR";

type GenerateBody = {
  mode?: Mode;
  lang?: string;
  platform?: string;
  objective?: string;
  audience?: string;
  offer?: string;
  product?: string;
  price?: string;
  angle?: string;
  objection?: string;
  hookType?: string;
  tone?: string;
  duration?: string;
  context?: string;
  brief?: string;
  market?: string;
  adsBudget?: string;
};

export async function POST(req: Request) {
  try {
    const body: GenerateBody = await req.json();

    const mode: Mode = body.mode === "AGENCY" ? "AGENCY" : "CREATOR";

    const forwardedFor = req.headers.get("x-forwarded-for") || "";
    const ip = forwardedFor.split(",")[0]?.trim() || "unknown";

    const betaLimit = mode === "AGENCY" ? 20 : 4;

    const allowed = await checkQuota(`beta:scripts:${ip}:${mode}`, betaLimit);

    if (!allowed) {
      return NextResponse.json(
        { error: "Quota bêta dépassé pour les scripts." },
        { status: 403 }
      );
    }

    const lang = body.lang || "FR";
    const platform = body.platform || "TikTok";
    const objective = body.objective || "Vente";
    const audience = body.audience || "";
    const offer = body.offer || body.product || "";
    const price = body.price || "";
    const angle = body.angle || "";
    const objection = body.objection || "";
    const hookType = body.hookType || "";
    const tone = body.tone || "";
    const duration = body.duration || "";
    const context = body.context || body.brief || "";
    const market = body.market || "";
    const adsBudget = body.adsBudget || "";

    const scriptsCount = mode === "AGENCY" ? 10 : 4;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY in environment variables." },
        { status: 500 }
      );
    }

    const systemPrompt = `
You are Script Engine, a senior UGC strategist, paid ads strategist, direct-response copywriter, performance marketer, and creative director.

MISSION
Generate high-converting, human-sounding scripts that feel:
- platform-native
- psychologically smart
- specific to the user's exact grid
- realistic to film
- useful for ads and social media

ABSOLUTE RULES
- Write like a real human.
- No robotic or corporate tone.
- No generic template copy.
- No vague filler.
- The product sold must always remain the user's exact product or offer.
- Every script must feel obviously generated from the exact inputs.

NO FAKE RULE
- Never invent a brand.
- Never invent a company.
- Never invent a product origin.
- Never say "notre produit" or "notre marque" unless the user explicitly provided a brand voice using "nous".
- Only use what the user provided.

ANTI-TEMPLATE RULE
Do not generate copy that could work for any random product.
Bad examples:
- improve your life
- discover this solution
- simplify everything
- game changer
- create engaging content
- highlight the benefits

Replace vague statements with:
- exact use case
- exact product logic
- exact buyer psychology
- exact visual direction
- exact CTA logic

GRID COHERENCE RULE
Every script must strictly reflect:
- platform
- product / offer
- price
- audience
- objective
- angle
- objection
- hook type
- tone
- duration
- context
- market
- ads budget

Never ignore the grid.
Never replace the user's product with a generic business/productivity offer.

STRICT COHERENCE RULE
The generated output must stay fully coherent with the generator selections.
That means:
- if hookType = "Question choc", the main hook must clearly be a question
- if tone = "Direct response", the copy must feel conversion-focused and direct
- if tone = "Storytelling", the copy must open like a story
- if tone = "Premium", the copy must feel elevated, refined, aspirational
- if tone = "Funny", the copy must contain a light humorous angle
- if tone = "Performance Ads", the copy must feel ad-driven, conversion-first, practical
- if tone = "Authority / Expert", the copy must sound credible, expert, educational
- if tone = "Emotional", the copy must lean on feelings, transformation, identity
- if platform = TikTok / Reels / Shorts, the script must sound creator-native
- if platform = Google Ads, the copy must sound intent-driven and direct-response
- if market = USA, the phrasing must match US marketing expectations
- if market = UK, the phrasing must match UK marketing expectations
- if market = Arabic, the phrasing must feel adapted to Arabic-speaking audiences
- if adsBudget is high, the testing logic can be broader and more performance-driven
- if adsBudget is low, the script must prioritize clarity, speed, and simple angles

If the output is not coherent with the selected generator options, it is wrong.

INPUT ANCHORING RULE
The output must clearly reflect:
- the exact product
- the exact platform
- the exact audience
- the exact price when relevant
- the main objection
- the exact angle
- the selected tone
- the selected hook type
- the selected market
- the selected ads budget when relevant

PRICE RULE
If a price is provided, use it strategically when relevant:
- low-friction purchase
- accessible price
- impulse-buying logic
- premium value
- comparison logic
- testable product logic

ADVANCED PSYCHOLOGICAL ENGINE
Before writing each script, analyze:
- primary pain
- secondary pain
- emotional trigger
- logical trigger
- fear
- desire
- objection
- buying motivation

Then adapt:
- hook
- tone
- CTA
- structure
- proof
- whyItWorks

LANGUAGE RULES
Selected language: ${lang}

The ENTIRE output must be written only in the selected language.
Never mix languages.

PRONOUN RULE
- Creator mode must always use "tu" in French
- Never use "vous" in Creator mode
- Never use "nous" in Creator mode
- Speak like a creator talking directly to one viewer
- Direct, natural, spoken language

PLATFORM RULES
TikTok:
- fast hook
- creator-native
- direct to camera
- emotional and visual
- natural spoken phrasing

Instagram Reels:
- aesthetic UGC
- clean but human
- short impactful phrasing
- visual storytelling

YouTube Shorts:
- retention-first
- structured sequence
- creator-native but clear

Facebook Ads:
- direct response
- problem -> solution -> proof -> CTA
- benefit clarity
- trust and conversion logic

Google Ads:
- clear buyer intent
- direct response only
- low fluff
- direct product value
- strong buying logic
- immediate clarity

Landing page:
- explanatory
- persuasive
- objection handling
- trust-building

Email:
- conversational persuasion
- benefit-first
- more readable rhythm
- CTA-focused

Do not mix platform styles.

PROMPT ENGINE RULE
Each script must contain a REAL filming brief.
promptEngine must be:
- concrete
- useful
- multi-line
- specific to product, platform, audience, price, objection, market, and tone
- directly usable by a creator

promptEngine must include:
- OBJECTIVE
- POSITIONING
- AUDIENCE MINDSET
- PSYCHOLOGICAL LEVER
- HOOK INTENTION
- CREATOR DIRECTION
- CAMERA DIRECTION
- VISUAL RHYTHM
- CTA DIRECTION

Minimum:
- 8 lines
- detailed
- practical
- no vague fluff

HOOK DETECTION RULE
Possible hook types:
- Question choc
- Story
- Pain point
- Direct claim
- Contrarian
- Curiosity

Choose the closest match only.

CREATIVE ANGLE RULES
Generate 3 truly distinct angles.

SCRIPT COUNT RULE
Generate exactly ${scriptsCount} scripts.
If mode = AGENCY, return exactly 10 scripts.
If mode = CREATOR, return exactly 4 scripts.

Each script must be genuinely different:
- different hook
- different framing
- different emotional entry point
- different proof logic
- different CTA wording
- different beats
- different shotlist logic
- different promptEngine
- different psychological logic

SCRIPT STRUCTURE RULE
Each script must include:
- promptEngine
- platformStrategy
- psychologicalAngle
- creativeDirection
- hook
- hookDetected
- script.aida.attention
- script.aida.interest
- script.aida.desire
- script.aida.action
- beats
- beatsTiming
- proof
- whyItWorks
- adsVariants
- shotlist
- cta.primary
- cta.optimized
- testingPlan
- kpi

FINAL OUTPUT RULE
Return valid JSON only.
No markdown.
No explanations.
No code fences.
`;

    const userPrompt = `
Generate exactly ${scriptsCount} high-quality scripts in ${lang}.

Inputs:
- Audience: ${audience}
- Offer/Product: ${offer}
- Price: ${price}
- Angle: ${angle}
- Platform: ${platform}
- Objective: ${objective}
- Hook type: ${hookType}
- Tone: ${tone}
- Duration: ${duration}
- Context: ${context}
- Main objection: ${objection}
- Market: ${market}
- Ads budget: ${adsBudget}
- Mode: ${mode}

IMPORTANT
Every script must be tightly anchored to the selected form inputs.
Never use fake brand voice.
Never say "notre" unless explicitly provided in the user's own brand tone.
In French Creator mode, use "tu" only.

COHERENCE CHECK
Before answering, verify internally:
1. does the hook style match the selected hookType?
2. does the writing style match the selected tone?
3. does the CTA fit the objective?
4. does the platformStrategy fit the selected platform?
5. does the psychological angle fit the audience + objection?
6. does the output reflect market and ads budget when relevant?

If not, rewrite before final output.

Return this exact JSON shape:

{
  "hookIdeas": ["", ""],
  "creativeAngles": ["", "", ""],
  "testingPlanSummary": "",
  "variants": [
    {
      "promptEngine": "",
      "platformStrategy": "",
      "psychologicalAngle": "",
      "creativeDirection": "",
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
      "beats": ["", "", ""],
      "beatsTiming": ["", "", ""],
      "proof": ["", ""],
      "whyItWorks": ["", ""],
      "adsVariants": ["", ""],
      "shotlist": ["", "", ""],
      "cta": {
        "primary": "",
        "optimized": ""
      },
      "testingPlan": "",
      "kpi": ""
    }
  ]
}

STRICT OUTPUT RULES
- hookIdeas must be an array
- creativeAngles must be an array of 3 items
- testingPlanSummary must be a string
- variants must contain exactly ${scriptsCount} items
- JSON only
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
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
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "OpenAI request failed",
          details: data?.error?.message || "Unknown OpenAI error",
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
      promptEngine:
        typeof variant?.promptEngine === "string" ? variant.promptEngine : "",
      platformStrategy:
        typeof variant?.platformStrategy === "string"
          ? variant.platformStrategy
          : "",
      psychologicalAngle:
        typeof variant?.psychologicalAngle === "string"
          ? variant.psychologicalAngle
          : "",
      creativeDirection:
        typeof variant?.creativeDirection === "string"
          ? variant.creativeDirection
          : "",
      hook: typeof variant?.hook === "string" ? variant.hook : "",
      hookDetected:
        typeof variant?.hookDetected === "string" ? variant.hookDetected : "",
      script: {
        aida: {
          attention:
            typeof variant?.script?.aida?.attention === "string"
              ? variant.script.aida.attention
              : "",
          interest:
            typeof variant?.script?.aida?.interest === "string"
              ? variant.script.aida.interest
              : "",
          desire:
            typeof variant?.script?.aida?.desire === "string"
              ? variant.script.aida.desire
              : "",
          action:
            typeof variant?.script?.aida?.action === "string"
              ? variant.script.aida.action
              : "",
        },
      },
      beats: Array.isArray(variant?.beats) ? variant.beats : [],
      beatsTiming: Array.isArray(variant?.beatsTiming)
        ? variant.beatsTiming
        : [],
      proof: Array.isArray(variant?.proof) ? variant.proof : [],
      whyItWorks: Array.isArray(variant?.whyItWorks)
        ? variant.whyItWorks
        : [],
      adsVariants: Array.isArray(variant?.adsVariants)
        ? variant.adsVariants
        : [],
      shotlist: Array.isArray(variant?.shotlist) ? variant.shotlist : [],
      cta: {
        primary:
          typeof variant?.cta?.primary === "string" ? variant.cta.primary : "",
        optimized:
          typeof variant?.cta?.optimized === "string"
            ? variant.cta.optimized
            : "",
      },
      testingPlan:
        typeof variant?.testingPlan === "string" ? variant.testingPlan : "",
      kpi: typeof variant?.kpi === "string" ? variant.kpi : "",
    }));

    if (variants.length > scriptsCount) {
      variants = variants.slice(0, scriptsCount);
    }

    while (variants.length < scriptsCount) {
      variants.push({
        promptEngine: "",
        platformStrategy: "",
        psychologicalAngle: "",
        creativeDirection: "",
        hook: "",
        hookDetected: "",
        script: {
          aida: {
            attention: "",
            interest: "",
            desire: "",
            action: "",
          },
        },
        beats: [],
        beatsTiming: [],
        proof: [],
        whyItWorks: [],
        adsVariants: [],
        shotlist: [],
        cta: { primary: "", optimized: "" },
        testingPlan: "",
        kpi: "",
      });
    }

    return NextResponse.json({
      hookIdeas,
      creativeAngles,
      testingPlanSummary,
      variants,
      parsed: {
        hookIdeas,
        creativeAngles,
        testingPlanSummary,
        variants,
      },
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
