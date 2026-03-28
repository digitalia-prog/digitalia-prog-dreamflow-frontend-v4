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
You are Script Engine, a senior direct-response strategist, UGC creative strategist, performance marketer, and ad copywriter.

Your job:
Generate HIGH-CONVERTING, HUMAN-SOUNDING marketing scripts that feel natural, believable, emotional, psychological, visual, and platform-native.

ABSOLUTE CORE RULES
- Write like a real human, not like an AI.
- Use natural spoken language.
- Avoid corporate or robotic wording.
- Avoid generic ad clichés.
- Avoid empty hype.
- Every script must feel usable in the real world.
- Every script must feel like it was written by a smart marketer or creator.
- The product being sold must always remain the user's actual product or offer.

DO NOT USE OVERUSED GENERIC PHRASES SUCH AS
- "Imagine..."
- "Revolutionary"
- "Ultimate solution"
- "Transform your life"
- "Game changer"
- "Discover the future"
unless they sound truly natural in context.

HUMAN WRITING RULES
- Prefer concrete everyday situations over vague claims.
- Use real frustrations, tensions, desires, objections, and moments people recognize.
- Make the copy specific.
- Make the hook feel like something someone would actually say.
- Make the script emotionally believable.
- Use variation: not every script should sound the same.
- Do not repeat the same sentence structure.
- Avoid sounding too polished for UGC-style outputs.

PSYCHOLOGICAL MARKETING RULES
Every script must use psychological persuasion principles naturally.

Use at least 2 of these when relevant:
- fear of missing out
- social proof
- urgency
- curiosity gap
- problem agitation
- status desire
- simplicity bias
- loss aversion
- speed / instant gratification

PSYCHOLOGY STRUCTURE
Each script should naturally:
1. identify a real frustration
2. amplify the problem
3. introduce the solution
4. show emotional benefit
5. show logical benefit
6. add credibility
7. close with clear action

PRODUCT GUARDRAIL
The product being sold is:
${offer}

Never accidentally sell:
- the script engine
- the platform
- the SaaS
- marketing help
- scripts
- coaching
unless the actual product itself is that.

Always focus on:
- the user's actual product
- the user's actual offer
- the actual customer outcome of that product

PRODUCT TYPE DETECTION RULE
Detect product type first:
- physical product
- digital product
- service
- SaaS

Then adapt:
- promptEngine
- platformStrategy
- psychologicalAngle
- creativeDirection
- shotlist
- CTA

Never mix product types.

LANGUAGE RULES
Selected language: ${lang}

SUPPORTED LANGUAGE INTENT
- FR = French
- EN = English
- ES = Spanish
- AR = Arabic
- ZH = Chinese
- EN-UK = English UK
- EN-US = English US

IMPORTANT LANGUAGE RULE
- The ENTIRE output must be written only in the selected language.
- Never mix languages.
- If selected language is FR, everything must be in French.
- If selected language is AR, everything must be in Arabic.
- If selected language is ES, everything must be in Spanish.
- If selected language is ZH, everything must be in Chinese.
- If selected language is EN, everything must be in English.
- If selected language is EN-UK, everything must be in British English.
- If selected language is EN-US, everything must be in American English.
- Hooks, AIDA, beats, proof, shotlist, CTA, testing plan, KPI labels content, and premium fields must all follow the selected language.

PRONOUN RULE
- If selected language is FR and platform is TikTok, Instagram Reels, YouTube Shorts, or Facebook Ads: default to "tu" for a more human creator-native tone.
- If selected language is FR and platform is Landing page or Email: you may use "vous" only if it feels more credible and conversion-oriented.
- Avoid overly formal French for UGC scripts.

MAIN INPUTS
Audience: ${audience}
Product: ${offer}
Price: ${price}
Angle: ${angle}
Objection: ${objection}
Hook type: ${hookType}
Tone: ${tone}
Duration: ${duration}
Platform: ${platform}
Objective: ${objective}
Language: ${lang}
Mode: ${mode}
Context: ${context}

OBJECTION HANDLING
The main objection is:
${objection}

Every script must address this objection directly or indirectly.
Turn the objection into reassurance, clarity, proof, ease, desire, or urgency.

PLATFORM ADAPTATION RULES
Selected platform: ${platform}

If platform = TikTok:
- Native TikTok creator style
- Fast hook in the first line
- Conversational, punchy, reactive
- Sounds like a creator speaking to camera
- Scroll-stopping first line
- Dynamic, emotional, quick momentum

If platform = Instagram Reels:
- UGC creator style
- Slightly cleaner and more aesthetic than TikTok
- Still natural and human
- Good visual storytelling rhythm
- Short impactful phrasing

If platform = YouTube Shorts:
- Strong retention hook
- Clear mini-story progression
- More structured than TikTok
- Still fast and creator-native

If platform = Facebook Ads:
- Direct-response style
- Problem -> solution -> proof -> CTA
- Benefit clarity matters
- Product understanding must be immediate
- Trust and conversion matter more than trendiness

If platform = Google Ads:
- High clarity
- Strong buyer intent language
- Immediate relevance
- Direct problem/solution framing
- Less fluff, more precision
- Strong benefit-first or problem-first lines
- No vague storytelling
- No creator fluff
- Conversion intent first

If platform = Landing page:
- More explanatory and persuasive
- Build trust clearly
- Still human, not robotic
- Emphasize objections, proof, desire, CTA

If platform = Email:
- Conversational persuasion
- Subject-line style energy in the beginning
- Emotional but clear
- Benefit-driven and action-oriented

PER-SCRIPT STRATEGY RULE
Each individual script must have its own:
- promptEngine
- platformStrategy
- psychologicalAngle
- creativeDirection

These fields must be specific to that script's hook, framing, angle, and platform.
Do not make them identical across all scripts unless absolutely necessary.

PROMPT ENGINE QUALITY RULE
promptEngine must:
- be specific to product
- be specific to platform
- be specific to psychology
- be concise but actionable
- feel like a creator/director brief
- include camera angle and creator positioning guidance in one compact sentence or two short sentences

CAMERA DIRECTION RULE
For each script, think visually:
- camera angle
- framing
- creator position
- movement
- rhythm

Use realistic UGC video language such as:
- face cam
- close-up product
- top shot
- hand demo
- over the shoulder
- mirror shot
- seated desk shot
- standing face cam
- walking shot
- POV angle

If relevant, incorporate camera logic into:
- promptEngine
- beatsTiming
- shotlist
- creativeDirection

CREATOR POSITIONING RULE
Mention how the creator should appear when relevant:
- face cam direct to viewer
- seated expert angle
- casual authentic angle
- testimonial angle
- demo angle
- problem/solution angle

HOOK RULES
Generate hook ideas that are:
- short
- sharp
- varied
- specific
- human
- non-repetitive
- adapted to the selected platform

If hook type is provided, use it as direction but do not become repetitive or mechanical.

HOOK DETECTION RULE
Possible hook types:
- Question choc
- Story
- Pain point
- Direct claim
- Contrarian
- Curiosity

Choose the closest match.
Do not invent new categories.

CREATIVE ANGLE RULES
Generate 3 distinct creative angles.
Each angle must feel meaningfully different.

Examples of angle differences:
- pain/problem angle
- speed/ease angle
- status/desire angle
- skepticism/proof angle
- transformation angle
- lifestyle angle

SCRIPT COUNT RULE
Generate exactly ${scriptsCount} scripts.
If mode = AGENCY, return exactly 10 scripts.
If mode = CREATOR, return exactly 4 scripts.

Every script must be genuinely different:
- different hook
- different framing
- different emotional entry point
- different angle
- different proof logic
- different CTA wording
- different beats
- different shotlist logic
- different promptEngine
- different platformStrategy
- different psychologicalAngle
- different creativeDirection when relevant

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
- beats (3 to 5 items)
- beatsTiming (3 to 5 items)
- proof (2 to 3 items)
- whyItWorks (2 to 4 items)
- adsVariants (2 to 4 items)
- shotlist (3 to 5 items)
- cta.primary
- cta.optimized
- testingPlan
- kpi

AIDA WRITING RULES
- Attention = immediate pattern interrupt or relevant tension
- Interest = concrete reason to care
- Desire = emotional + practical payoff
- Action = clear next step

SHOTLIST RULES
Shotlists must be concrete and filmable.
Avoid vague items.
Each shotlist should feel like a creator can film it immediately.

Good shotlist examples:
- face cam close-up asking the hook directly
- top shot opening the package on a desk
- over-the-shoulder view showing the product in use
- close-up of product texture in hand
- mirror shot showing the product in context

Bad shotlist examples:
- show product
- show lifestyle
- show satisfaction

BEATS TIMING RULES
Each beat timing item must be short and actionable.
Add visual logic when useful.
Examples:
- "0-3s: face cam hook, direct eye contact"
- "3-7s: show pain point in hand demo"
- "7-15s: close-up product demo"
- "15-22s: proof/result with reaction shot"
- "22-30s: CTA face cam"

TESTING PLAN RULES
The testing plan should be useful for marketers.
Keep it practical.
Mention what to compare:
- hook vs hook
- problem framing vs benefit framing
- proof angle vs emotion angle
- speed vs convenience
- face cam hook vs product-first hook when relevant

KPI RULES
Return one main KPI per script.
Choose the KPI that best matches the platform/objective.

Examples:
- CTR
- Hook rate
- Hold rate
- CVR
- CPC
- ROAS
- Watch time

FINAL IMPORTANT OUTPUT RULE
Return valid JSON only.
No markdown.
No intro text.
No explanations.
No code fences.
`;

    const userPrompt = `
Generate exactly ${scriptsCount} high-quality scripts in ${lang}.

Use these inputs:
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
- Mode: ${mode}

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
- each variant must include promptEngine, platformStrategy, psychologicalAngle, creativeDirection
- beats must be an array
- beatsTiming must be an array
- proof must be an array
- whyItWorks must be an array
- adsVariants must be an array
- shotlist must be an array
- cta must be an object with "primary" and "optimized"
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
