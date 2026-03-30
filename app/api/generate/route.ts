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

Never ignore the grid.
Never replace the user's product with a generic business/productivity offer.

INPUT ANCHORING RULE
The output must clearly reflect:
- the exact product
- the exact platform
- the exact audience
- the exact price when relevant
- the main objection
- the exact angle

If the input says "chargeur magsafe iphone" at "19", the script must clearly sound like it sells that exact product at that exact price point.
If the input says Google Ads, the copy must sound like Google Ads logic.
If the input says TikTok, the copy must sound creator-native.

PRODUCT TYPE RULE
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
- script
- shotlist
- CTA

Never mix product types.

PRICE RULE
If a price is provided, use it strategically when relevant:
- low-friction purchase
- accessible price
- impulse-buying logic
- premium value
- comparison logic
- testable product logic

Do not ignore the price.

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

Examples:
- beginner audience -> reassurance, simplicity, low-risk language
- low price -> impulse / accessible value psychology
- Google Ads -> intent-driven, logical conversion psychology
- TikTok / Reels / Shorts -> emotional curiosity, direct creator psychology

Use at least 2 of these naturally when relevant:
- FOMO
- social proof
- urgency
- curiosity gap
- problem agitation
- status desire
- simplicity bias
- loss aversion
- speed / instant gratification

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

The ENTIRE output must be written only in the selected language.
Never mix languages.

PRONOUN RULE
- For French TikTok / Reels / Shorts / most B2C ads: default to "tu"
- For French Email / Landing page / more formal B2B: "vous" allowed when more credible
- Avoid overly formal French in UGC-style outputs

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
- no vague storytelling
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
- strong CTA

Do not mix platform styles.

PROMPT ENGINE RULE
Each script must contain a REAL filming brief, not 1 or 2 vague lines.
promptEngine must be:
- concrete
- useful
- multi-line
- specific to product, platform, audience, price, and objection
- directly usable by a creator

promptEngine must include, in the selected language:
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
- detailed and practical
- no vague fluff

CAMERA + CREATOR DIRECTION RULE
Think visually for every script.
Mention, when relevant:
- camera angle
- framing
- creator position
- hand movement
- scene progression
- visual rhythm
- product focus moment
- CTA ending shot

Use realistic creator language such as:
- face cam close-up
- medium shot face cam
- top shot on desk
- over-the-shoulder
- hand demo close-up
- POV angle
- walking selfie shot
- seated talking head
- mirror angle
- product close-up

HOOK RULES
Generate hooks that are:
- short
- sharp
- human
- specific
- non-repetitive
- aligned with selected platform and product

HOOK DETECTION RULE
Possible hook types:
- Question choc
- Story
- Pain point
- Direct claim
- Contrarian
- Curiosity

Choose the closest match only.
Do not invent new categories.

CREATIVE ANGLE RULES
Generate 3 truly distinct angles.
Examples:
- pain/problem
- speed/ease
- status/desire
- skepticism/proof
- transformation
- lifestyle

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
- beats (3 to 5)
- beatsTiming (3 to 5)
- proof (2 to 3)
- whyItWorks (2 to 4)
- adsVariants (2 to 4)
- shotlist (3 to 5)
- cta.primary
- cta.optimized
- testingPlan
- kpi

AIDA RULE
- Attention = immediate pattern interrupt or tension
- Interest = concrete reason to care
- Desire = emotional + practical payoff
- Action = clear next step

SHOTLIST RULE
Shotlists must be concrete and filmable immediately.
Bad:
- show product
- show lifestyle
- show satisfaction

Good:
- face cam close-up asking the hook directly
- top shot opening the product on a desk
- over-the-shoulder showing the product in use
- close-up of the product in hand
- before/after transition on desk setup

BEATS TIMING RULE
Each beat timing item must be short and actionable.
Examples:
- 0-3s: face cam hook, direct eye contact
- 3-7s: show pain point with hand demo
- 7-15s: close-up product demo
- 15-22s: proof/result reaction shot
- 22-30s: CTA face cam

TESTING PLAN RULE
Keep it practical and ad-useful.
Mention what to compare:
- hook vs hook
- problem vs benefit framing
- proof vs emotion
- face cam vs product-first
- urgency vs simplicity

KPI RULE
Return one main KPI per script.
Examples:
- CTR
- Hook rate
- Hold rate
- CVR
- CPC
- ROAS
- Watch time

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
- Mode: ${mode}

IMPORTANT
Every script must be tightly anchored to the selected form inputs.

Examples:
- if platform = Google Ads, it must sound like Google Ads
- if product = chargeur magsafe iphone, it must clearly sell that exact product
- if price = 19, it should use that value strategically
- if audience = e-commerçants débutants sur TikTok, it must reflect beginner psychology
- if context says "Avant / Après, Bureau", the promptEngine, beats, shotlist, and creative direction must reflect that exact context

Do not output generic scripts.

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
- every variant must clearly reflect the selected platform, product, price, audience, angle, objection, and context
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
