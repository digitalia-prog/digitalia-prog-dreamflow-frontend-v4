import { NextResponse } from "next/server";

type Mode = "AGENCY" | "CREATOR";

type Variant = {
  promptEngine?: string;
  platformStrategy?: string;
  psychologicalAngle?: string;
  creativeDirection?: string;
  hook?: string;
  hookDetected?: string;
  script?: {
    aida?: {
      attention?: string;
      interest?: string;
      desire?: string;
      action?: string;
    };
  };
  beats?: string[];
  beatsTiming?: string[];
  proof?: string[];
  whyItWorks?: string[];
  adsVariants?: string[];
  shotlist?: string[];
  cta?: {
    primary?: string;
    optimized?: string;
  };
  testingPlan?: string;
  kpi?: string;
};

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

function sanitizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizePlatform(platform?: string) {
  const lower = String(platform || "").toLowerCase();

  return {
    isTikTok: lower.includes("tiktok"),
    isReels: lower.includes("instagram") || lower.includes("reels"),
    isShorts: lower.includes("youtube") || lower.includes("shorts"),
    isFacebookAds: lower.includes("facebook"),
    isGoogleAds: lower.includes("google"),
    isLandingPage: lower.includes("landing"),
    isEmail: lower.includes("email"),
  };
}

function getLanguageName(lang: string) {
  switch ((lang || "FR").toUpperCase()) {
    case "EN":
      return "English";
    case "EN-US":
      return "American English";
    case "EN-UK":
      return "British English";
    case "ES":
      return "Spanish";
    case "AR":
      return "Arabic";
    case "ZH":
      return "Chinese";
    case "FR":
    default:
      return "French";
  }
}

function inferProductType(offer: string) {
  const lower = offer.toLowerCase();

  const contentKeywords = [
    "mon chat",
    "mon chien",
    "mon bébé",
    "mon enfant",
    "mon copain",
    "ma copine",
    "ma vie",
    "mon histoire",
    "story",
    "histoire",
    "anecdote",
    "expérience",
    "vlog",
    "témoignage",
    "temoignage",
    "problème",
    "probleme",
    "situation",
    "drama",
    "drôle",
    "drole",
    "fait pipi",
    "fait caca",
    "il m'est arrivé",
    "il m est arrive",
    "quand mon",
    "quand ma",
  ];

  const saasKeywords = [
    "saas",
    "software",
    "logiciel",
    "app",
    "application",
    "plateforme",
    "platform",
    "crm",
    "automation",
    "automatisation",
    "dashboard",
    "tool",
    "outil",
    "script engine",
    "generator",
    "générateur",
    "generateur",
  ];

  const digitalKeywords = [
    "ebook",
    "e-book",
    "formation",
    "cours",
    "course",
    "template",
    "guide",
    "pdf",
    "checklist",
    "masterclass",
    "workbook",
    "prompt pack",
    "digital product",
    "produit digital",
  ];

  const serviceKeywords = [
    "service",
    "agency",
    "agence",
    "coaching",
    "consulting",
    "consultation",
    "freelance",
    "done for you",
    "dfy",
    "audit",
    "mentoring",
    "accompagnement",
  ];

  if (contentKeywords.some((keyword) => lower.includes(keyword))) {
    return "content";
  }

  if (saasKeywords.some((keyword) => lower.includes(keyword))) {
    return "SaaS";
  }

  if (digitalKeywords.some((keyword) => lower.includes(keyword))) {
    return "digital product";
  }

  if (serviceKeywords.some((keyword) => lower.includes(keyword))) {
    return "service";
  }

  return "physical product";
}

function getHumanVoiceRules() {
  return `
UNIVERSAL HUMAN WRITING RULES
For every platform and every user type (creator, agency, freelancer, brand):
- Write like a real human, not like an AI assistant, not like a generic copywriter, and not like a stiff consultant.
- Keep the writing natural, credible, specific, and easy to say, read, or use directly.
- Favor concrete wording over abstract marketing language.
- Prefer believable observations, real-life phrasing, and natural transitions.
- Keep the writing commercially useful, but never robotic.

NATURAL LANGUAGE RULES
- Use simple, clear language.
- Prefer short to medium-length sentences unless longer structure improves clarity.
- Make the rhythm feel human, not mechanically optimized line after line.
- Avoid over-explaining.
- Avoid sounding overly polished, corporate, or artificially perfect.
- If the platform is spoken/video-based, the text should sound speakable out loud.
- If the platform is written/conversion-based, the text should still feel human and fluid, not sterile.

ANTI-AI / ANTI-GENERIC RULES
Do not sound like:
- an AI assistant
- a generic ad generator
- a fake visionary marketer
- a hollow performance-marketing cliché machine

Avoid wording such as:
- "revolutionary"
- "game-changing"
- "unlock"
- "transform your life"
- "ultimate solution"
- "in today's world"
- "take your business to the next level"
- "seamless experience"
- "innovative solution"

Avoid:
- empty hype
- vague benefits with no real feeling
- robotic persuasion transitions
- repeating the same sentence pattern across scripts
- generic hooks that could apply to anything
- fake enthusiasm
- overusing exclamation marks
- forced slang
- unnatural creator wording when the platform or audience does not justify it

CREDIBILITY RULES
- The output must feel believable for the product, audience, and platform.
- Claims should feel grounded, not inflated.
- Emotions should feel real, not exaggerated for no reason.
- The voice should feel native to the platform, but also usable by agencies, freelancers, brands, and creators.
- The script should feel like something a competent human would actually write or say.

STYLE BALANCE RULE
- Keep performance intent strong.
- Keep conversion logic strong.
- But never sacrifice human believability for marketing intensity.
- "High-performing" must still feel "human-usable".
`;
}

function getTikTokOpeningExamples(lang: string) {
  switch ((lang || "FR").toUpperCase()) {
    case "EN":
    case "EN-US":
    case "EN-UK":
      return [
        "I swear...",
        "I was so done...",
        "Wait, let me show you this...",
        "Okay, I’ll be honest...",
        "I never thought I’d say this...",
      ];
    case "ES":
      return [
        "Te lo juro...",
        "Ya no podía más...",
        "Espera, tengo que enseñarte esto...",
        "Vale, voy a ser sincero...",
        "Nunca pensé que diría esto...",
      ];
    case "AR":
      return [
        "أقسم لك...",
        "كنت فعلًا تعبت...",
        "لحظة، لازم أوريك هذا...",
        "بصراحة لازم أقولها...",
        "ما توقعت يوم أقول هذا...",
      ];
    case "ZH":
      return [
        "我真的服了……",
        "我当时真的受够了……",
        "等等，我得给你看这个……",
        "说真的……",
        "我真没想到我会这么说……",
      ];
    case "FR":
    default:
      return [
        "Je vous jure...",
        "J’en pouvais plus...",
        "Attends, faut que je te montre...",
        "Bon, je vais être honnête...",
        "Je pensais pas dire ça un jour...",
      ];
  }
}

function getTikTokBadOpeners(lang: string) {
  switch ((lang || "FR").toUpperCase()) {
    case "EN":
    case "EN-US":
    case "EN-UK":
      return ['"Tired of..."', '"Discover..."', '"Buy now..."', '"Click the link"'];
    case "ES":
      return [
        '"¿Cansado de...?"',
        '"Descubre..."',
        '"Compra ahora..."',
        '"Haz clic en el enlace"',
      ];
    case "AR":
      return [
        '"هل سئمت من...؟"',
        '"اكتشف..."',
        '"اشترِ الآن..."',
        '"اضغط على الرابط"',
      ];
    case "ZH":
      return ['"你是否厌倦了……"', '"发现……"', '"立即购买……"', '"点击链接……"'];
    case "FR":
    default:
      return ['"Marre de..."', '"Découvrez..."', '"Achetez..."', '"Cliquez sur le lien"'];
  }
}

function getTikTokCtaExamples(lang: string) {
  switch ((lang || "FR").toUpperCase()) {
    case "EN":
    case "EN-US":
    case "EN-UK":
      return [
        '"Let me show you"',
        '"Look at this"',
        '"Go check it out"',
        '"Honestly, try it"',
      ];
    case "ES":
      return ['"Te enseño"', '"Mira esto"', '"Ve a verlo"', '"La verdad, pruébalo"'];
    case "AR":
      return ['"خليني أوريك"', '"شوف هذا"', '"روح شوفه"', '"بصراحة جرّبه"'];
    case "ZH":
      return ['"我给你看"', '"你看这个"', '"去看看"', '"真的可以试试"'];
    case "FR":
    default:
      return ['"Je te montre"', '"Regarde ça"', '"Va voir"', '"Franchement, teste"'];
  }
}

export async function POST(req: Request) {
  try {
    const body: GenerateBody = await req.json();

    const mode: Mode = body.mode === "AGENCY" ? "AGENCY" : "CREATOR";
    const lang = sanitizeString(body.lang) || "FR";
    const platform = sanitizeString(body.platform) || "TikTok";
    const objective = sanitizeString(body.objective) || "Vente";
    const audience = sanitizeString(body.audience);
    const offer = sanitizeString(body.offer);
    const price = sanitizeString(body.price);
    const angle = sanitizeString(body.angle);
    const objection = sanitizeString(body.objection);
    const hookType = sanitizeString(body.hookType);
    const tone = sanitizeString(body.tone);
    const duration = sanitizeString(body.duration);
    const context = sanitizeString(body.context);

    const scriptsCount = mode === "AGENCY" ? 10 : 4;
    const {
      isTikTok,
      isReels,
      isShorts,
      isFacebookAds,
      isGoogleAds,
      isLandingPage,
      isEmail,
    } = normalizePlatform(platform);
    const hasContext = context.length > 0;

    const languageName = getLanguageName(lang);
    const inferredProductType = inferProductType(offer);
    const humanVoiceRules = getHumanVoiceRules();
    const tiktokOpenings = getTikTokOpeningExamples(lang);
    const tiktokBadOpeners = getTikTokBadOpeners(lang);
    const tiktokCtas = getTikTokCtaExamples(lang);

    const contextPriorityRules = hasContext
      ? `
CONTEXT PRIORITY RULE
A context has been provided by the user:
${context}

This context is NOT optional for generation quality.
You must use it as a strong creative constraint across the output.

If context is provided:
- adapt the hook using the context
- adapt promptEngine using the context
- adapt platformStrategy using the context
- adapt creativeDirection using the context
- adapt beats using the context
- adapt beatsTiming using the context
- adapt shotlist using the context
- adapt proof examples using the context when relevant
- adapt the scene, environment, creator posture, and filming logic using the context only if it fits the selected platform and content type
- adapt the tone and realism using the context
- if the context mentions a place, that place should appear in the script logic when relevant
- if the context mentions face cam, the script should reflect face cam delivery only for video-native formats
- if the context mentions a real pet, person, object, kitchen, desk, car, mirror, etc., the visual direction must use it concretely when relevant
- context must have visible impact in multiple sections, not only one line

Do NOT ignore the context.
Do NOT treat it like a weak note.
Make it structurally visible in the final output.
`
      : `
CONTEXT PRIORITY RULE
No extra context was provided.
Generate using the other inputs only.
`;

    const hookTypeRules = hookType
      ? `
HOOK TYPE PRIORITY RULE
Requested hook type: ${hookType}

You must strongly respect this requested hook type.

Hook type guidance:
- Question choc = direct shocking or intriguing question
- Story = personal story opening, lived moment, anecdotal entry
- Pain point = direct pain/frustration/problem opening
- Contrarian = surprising opposite opinion or unexpected claim
- Direct claim = clear strong benefit/result statement
- Curiosity = information gap, tease, unexpected reveal, unanswered tension

IMPORTANT:
- The generated hook must actually match the requested type.
- The "hookDetected" field must match the real hook used.
- Do not label a pain point hook as curiosity.
- Do not label a story hook as direct claim.
- Hook logic must be coherent.
`
      : `
HOOK TYPE PRIORITY RULE
No explicit hook type was provided.
Choose the strongest hook type for the platform and objective.
`;

    const toneRules = tone
      ? `
TONE PRIORITY RULE
Requested tone: ${tone}

You must respect this tone in the writing style.

Tone guidance:
- UGC naturel (simple) = simple, spoken, creator-native, human, not polished
- Direct response = more direct, persuasive, benefit-first, conversion-oriented
- Storytelling = stronger narrative flow, scene, progression, personal feel
- Premium = elegant, polished, aspirational, credible, refined
- Funny = light, playful, relatable, humorous without losing clarity

The tone must be visible in:
- hook
- AIDA
- promptEngine
- creativeDirection
- CTA
- overall voice
`
      : `
TONE PRIORITY RULE
No explicit tone was provided.
Choose the most effective tone for the platform and objective.
`;

    const durationRules = duration
      ? `
DURATION PRIORITY RULE
Requested duration: ${duration}

You must adapt the output to this duration.

Duration guidance:
- 15s = ultra concise, fast pacing, few beats, one main idea
- 30s = balanced structure, concise hook, quick proof, clear CTA
- 45s = more detail, stronger progression, more proof or context
- 60s = more narrative space, richer storytelling, fuller proof and explanation

IMPORTANT:
- beatsTiming must match the requested duration
- the amount of information must fit the duration
- do not write a 60s script disguised as 15s
- do not make timing too thin for 45s or 60s
`
      : `
DURATION PRIORITY RULE
No explicit duration was provided.
Use the most natural pacing for the platform.
`;

    const objectiveRules = objective
      ? `
OBJECTIVE PRIORITY RULE
Requested objective: ${objective}

You must adapt script logic to the objective.

Objective guidance:
- Vente = stronger conversion intent, benefit, objection handling, CTA
- Lead = curiosity + trust + interest + action to learn more
- Awareness = attention, memorability, relatability, retention, lighter CTA
- UGC = native creator style, authenticity, lifestyle proof, realism
- Conversion = strongest persuasion logic, clarity, trust, action

The chosen KPI should reflect the objective.
`
      : "";

    const priceRules = price
      ? `
PRICE RULE
The price provided is: ${price}

If inferred product type = content:
- ignore the price if it does not make sense
- do not invent a product because a price exists
- do not force commerce language into story content

If inferred product type != content:
- use the price only if it helps credibility or conversion
- do not force the price unnaturally
- if used, it must sound natural in the selected language and platform style
`
      : `
PRICE RULE
No price was provided.
Do not invent a price.
`;

    const audienceRules = audience
      ? `
AUDIENCE RULE
Audience provided: ${audience}

The script must feel written specifically for this audience.
Use their reality, frustrations, desires, tone, and context.
Avoid generic messaging.
`
      : `
AUDIENCE RULE
No specific audience was provided.
Use the broadest relevant audience for the product or content theme.
`;

    const objectionRules = objection
      ? `
OBJECTION HANDLING
The main objection provided is:
${objection}

You may use it only if it truly makes sense for the actual product/content and audience.

If inferred product type = content:
- do not turn the content into something to buy
- reinterpret the objection as a creator/content tension if needed
- the output can focus on relatability, attention, story clarity, or emotional connection

If the objection is clearly mismatched with the real product/content:
- reinterpret it in the most believable way
- do not force the objection literally
- do not make the script sound like a SaaS, service, creator tool, or marketing tool if it is not that
`
      : `
OBJECTION HANDLING
No explicit objection was provided.
Use the most likely objection, tension, or audience friction for the product or content theme.
`;

    const angleRules = angle
      ? `
ANGLE PRIORITY RULE
Main marketing angle provided:
${angle}

This angle should influence:
- hook framing
- creative angles
- AIDA
- proof
- CTA logic

However:
- do not force the angle literally if it conflicts with the real product/content
- reinterpret the angle in the most believable way
- for physical products, prefer realistic product benefits over marketing-tool language
- for SaaS/services, ROI and productivity language can be stronger
- for content/story mode, reinterpret the angle as engagement, relatability, emotional payoff, watchability, or storytelling tension
`
      : `
ANGLE PRIORITY RULE
No explicit angle was provided.
Choose strong angles based on product/content, audience, and platform.
`;

    const tiktokNaturalRules = isTikTok
      ? `
TIKTOK NATURAL LANGUAGE RULES
If platform = TikTok:
- Write like a real creator speaking naturally to camera.
- Use human, spontaneous, conversational wording.
- Avoid sounding like a classic ad.
- Avoid overly polished, corporate, or robotic phrasing.
- Prefer native TikTok hooks that sound spoken and authentic.
- Add a strong pattern interrupt in the first 1 to 2 seconds.
- The first line must feel scroll-stopping, emotionally immediate, and human.
- When relevant, prefer first-person phrasing.
- Avoid generic ad openings such as:
  - ${tiktokBadOpeners[0]}
  - ${tiktokBadOpeners[1]}
  - ${tiktokBadOpeners[2]}
  - ${tiktokBadOpeners[3]}
- Prefer hook styles like:
  - ${tiktokOpenings[0]}
  - ${tiktokOpenings[1]}
  - ${tiktokOpenings[2]}
  - ${tiktokOpenings[3]}
  - ${tiktokOpenings[4]}
- TikTok CTA must stay natural, light, and creator-native.
- If inferred product type = content, the CTA should invite engagement, reaction, sharing, or relatability, not purchase.
- Never use cliché ad wording for TikTok.
- The script must feel like native TikTok UGC, not recycled Meta ad copy.
`
      : "";

    const reelsRules = isReels
      ? `
INSTAGRAM REELS RULES
If platform = Instagram Reels:
- Keep the script human and creator-native.
- Make it slightly cleaner, more aesthetic, and more polished than TikTok.
- Keep the rhythm smooth and visually elegant.
- Favor visually pleasing actions, beauty of frame, lifestyle integration, and clean storytelling.
- Hooks should feel attractive and natural, not too chaotic.
- Avoid aggressive or overly pushy CTA wording.
- CTA should feel soft, stylish, and easy to follow.
- Shotlist should reflect visual neatness, intentional framing, and aesthetic coherence.
- Avoid overdoing slang or rough phrasing unless the user context clearly calls for it.
`
      : "";

    const shortsRules = isShorts
      ? `
YOUTUBE SHORTS RULES
If platform = YouTube Shorts:
- Prioritize retention and clean progression.
- The hook must create immediate curiosity or tension.
- The script should feel more structured than TikTok.
- Use a mini-story or mini-progression that pays off clearly.
- Keep the viewer moving from hook -> reason -> proof -> result -> CTA.
- Avoid messy or overly chaotic phrasing.
- Favor clarity, retention, and narrative momentum.
- beatsTiming should support continuous viewer retention.
`
      : "";

    const facebookAdsRules = isFacebookAds
      ? `
FACEBOOK ADS RULES
If platform = Facebook Ads:
- Prioritize direct response performance.
- The hook can be direct if it improves conversion clarity.
- Quickly establish the problem or benefit.
- Move fast toward solution and proof.
- Trust, credibility, reassurance, and clarity matter more than trendiness.
- Use proof, objection handling, and practical benefit strongly.
- CTA can be more direct than TikTok or Reels.
- Avoid being vague, artsy, or purely entertainment-focused.
- AdsVariants should feel genuinely testable for performance marketing.
`
      : "";

    const googleAdsRules = isGoogleAds
      ? `
GOOGLE ADS RULES
If platform = Google Ads:
- Prioritize clarity over style.
- Write with strong buyer-intent logic.
- Avoid vague storytelling, fluff, or overly creator-like language.
- Lead with direct relevance, problem/solution, or immediate benefit.
- Every line should feel useful, specific, and conversion-oriented.
- Hooks should be sharp and clear, not poetic.
- Proof and whyItWorks should be practical and grounded.
- CTA should be direct and friction-reducing.
- Testing plans should reflect performance logic, not creative fluff.
- Do not write like a UGC filming script unless the product itself requires that.
- promptEngine should behave like a messaging/creative brief, not a face-cam shooting script.
- shotlist should behave like an asset/content sequence for ad creative, not a creator vlog.
`
      : "";

    const landingPageRules = isLandingPage
      ? `
LANDING PAGE RULES
If platform = Landing page:
- Be more explanatory and persuasive.
- Build trust clearly and progressively.
- Address objections more explicitly.
- Use proof, reassurance, and benefit stacking.
- The hook can be slightly longer if it improves clarity.
- Keep the writing human, but more structured than short-form video.
- CTA should be confident, clear, and conversion-friendly.
- promptEngine should behave like a conversion copy brief, not a filming brief.
- shotlist should behave like page sections or visual blocks if needed.
`
      : "";

    const emailRules = isEmail
      ? `
EMAIL RULES
If platform = Email:
- Write with conversational persuasion.
- The opening should feel like a strong email opener or subject-line energy.
- Keep the tone human and readable.
- Use benefit-driven copy with clear progression.
- Avoid sounding like a banner ad.
- The action line should feel natural for email, not like TikTok.
- Prioritize clarity, emotional relevance, and easy reading.
- AIDA should feel adapted to email persuasion, not video scripting only.
- promptEngine should behave like an email persuasion brief, not a shooting brief.
- shotlist should behave like content sequence or sections if needed, not camera directions.
`
      : "";

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
- The product, service, or theme must always remain the user's actual input.

${humanVoiceRules}

DO NOT USE OVERUSED GENERIC PHRASES SUCH AS
- "Imagine..."
- "Revolutionary"
- "Ultimate solution"
- "Transform your life"
- "Game changer"
- "Discover the future"
unless they sound truly natural in context.

ADDITIONAL PHRASE RULE
- Avoid using "Imagine..." as an opening or as the Desire line unless it is absolutely necessary and feels completely natural.
- Prefer concrete desire wording instead of fantasy cliché wording.
- Prefer real-life payoff over vague projection.

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
1. identify a real frustration, tension, or relatable situation
2. amplify the problem or emotional friction
3. introduce the payoff, shift, product, solution, or insight depending on the content type
4. show emotional benefit
5. show logical benefit or meaningful reason to care
6. add credibility
7. close with clear action

SOURCE OF TRUTH RULE
The user's actual input is:
${offer}

Never accidentally sell:
- the script engine
- the platform
- the SaaS
- marketing help
- scripts
- coaching
unless the actual input is that.

Always focus on:
- the user's actual product, service, or theme
- the user's actual offer or real content topic
- the actual audience outcome

PRODUCT TYPE DETECTION RULE
Detect input type first.
User input: ${offer}
Inferred type hint: ${inferredProductType}

Possible types:
- physical product
- digital product
- service
- SaaS
- content
- information/content theme if the user input is more conceptual than productized

Then adapt:
- promptEngine
- platformStrategy
- psychologicalAngle
- creativeDirection
- shotlist
- CTA

Never mix categories.
Use the inferred type as the default unless the other inputs clearly prove a different type.

CONTENT MODE RULE
If inferred type = content:
- This is NOT a product
- This is NOT a service
- This is NOT SaaS
- This is NOT something to sell unless the user explicitly provided a real product separately

You must:
- focus on storytelling
- focus on relatable situations
- focus on emotional engagement
- focus on awareness content
- focus on creator storytelling
- focus on retention, emotion, relatability, tension, humor, confession, lesson, or reaction depending on the input

Never:
- mention product if there is no real product
- mention solution product
- mention "acheter"
- mention "buy"
- mention "tester" as if there is a product
- mention "ce produit"
- mention "outil"
- invent a product from the topic
- turn a story topic into an ad for a fake product

Scripts in content mode must feel like:
- personal story
- relatable moment
- emotional hook
- creator storytelling
- awareness or engagement content

PRODUCT COHERENCE RULE
The script must remain coherent with the real input.

If the input is a physical product:
- focus on real product benefits
- avoid marketing service style promises
- avoid "boost your business" unless the product actually does that
- focus on lifestyle, usage, transformation, convenience, comfort, style, protection, desirability, identity, confidence, or practical result
- do not talk like the product is a SaaS, a script engine, a creator tool, or a coaching offer unless it really is

If the input is a digital product:
- focus on learning, saving time, achieving results, solving problems, clarity, or transformation

If the input is a SaaS:
- focus on automation, speed, efficiency, growth, ROI, workflow simplification, or operational clarity

If the input is a service:
- focus on expertise, transformation, results, reassurance, trust, and outcome

If the input is content:
- focus on the story, conflict, emotion, relatability, or lesson
- do not invent commerce language
- do not make up a product

IMPORTANT:
- Do not mix categories
- Do not use SaaS-style messaging for physical products
- Do not use service messaging for simple e-commerce products
- Do not use creator-tool messaging unless the actual input is a creator tool
- Do not use product-selling language in content mode unless there is a real product
- Promises must stay realistic and believable for the input
- If the user inputs are partially inconsistent, prioritize the real input and write the most believable script possible

INPUT COHERENCE RULE
When several inputs conflict, use this priority order:
1. real input / offer / topic
2. platform
3. audience
4. objective
5. angle
6. objection
7. tone
8. hook type
9. price
10. context

If the angle or objection sounds mismatched with the actual input:
- do not force the mismatch literally
- reinterpret it in the most believable way
- keep the final script commercially or editorially coherent

Examples:
- if the input is sunglasses, do not write like it is a SaaS or creator tool
- if the input is a simple physical e-commerce item, focus on style, utility, comfort, quality, fit, protection, confidence, convenience, social proof, desirability, identity, gifting, or problem solved
- if the input is a creator tool, then productivity, scripts, and ROI language can be valid
- if the input is "mon chat fait pipi", treat it as a content/story topic unless a real product is explicitly provided

LANGUAGE RULES
Selected language: ${lang}
Selected language name: ${languageName}

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
- promptEngine, platformStrategy, psychologicalAngle, creativeDirection, testingPlan, and all script content must be in the selected language too.
- Do not output English text when the selected language is FR.
- Do not output French text when the selected language is EN.
- Do not mix localized examples from another language.

PRONOUN RULE
- If selected language is FR and platform is TikTok, Instagram Reels, YouTube Shorts, or Facebook Ads: default to "tu" for a more human creator-native tone.
- If selected language is FR and platform is Landing page or Email: you may use "vous" only if it feels more credible and conversion-oriented.
- Avoid overly formal French for UGC scripts.

MAIN INPUTS
Audience: ${audience}
Input / Offer / Topic: ${offer}
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
Inferred type: ${inferredProductType}

${contextPriorityRules}
${hookTypeRules}
${toneRules}
${durationRules}
${objectiveRules}
${priceRules}
${audienceRules}
${angleRules}
${tiktokNaturalRules}
${reelsRules}
${shortsRules}
${facebookAdsRules}
${googleAdsRules}
${landingPageRules}
${emailRules}
${objectionRules}

PLATFORM ADAPTATION RULES
Selected platform: ${platform}

If platform = TikTok:
- Native TikTok creator style
- Fast hook in the first line
- Conversational, punchy, reactive
- Sounds like a creator speaking to camera
- Scroll-stopping first line
- Dynamic, emotional, quick momentum
- The wording must feel native TikTok, not classic ad copy.
- Prioritize spoken language over polished marketing language.
- Make the first line sound like something a creator would actually say out loud.
- Prefer emotional realism, mini-story tension, and natural confession energy.
- Use pattern interrupt logic in the opening.
- Avoid stiff ad phrases like "discover", "buy now", "click the link", "tired of...".
- Avoid using "Imagine..." as a lazy desire shortcut.
- Prefer human openings adapted to the selected language.
- If inferred type = content, the CTA should drive engagement, reaction, save, comment, share, or identification, not purchase.

If platform = Instagram Reels:
- UGC creator style
- Slightly cleaner and more aesthetic than TikTok
- Still natural and human
- Good visual storytelling rhythm
- Short impactful phrasing
- Prioritize visual attractiveness and aesthetic coherence
- Keep the style clean, smooth, and modern
- CTA should feel soft, stylish, and natural

If platform = YouTube Shorts:
- Strong retention hook
- Clear mini-story progression
- More structured than TikTok
- Still fast and creator-native
- Prioritize payoff and clean narrative progression
- Support viewer retention throughout the beats

If platform = Facebook Ads:
- Direct-response style
- Problem -> solution -> proof -> CTA
- Benefit clarity matters
- Input understanding must be immediate
- Trust and conversion matter more than trendiness
- Strong objection handling
- Strong practical proof
- CTA can be more direct than short-form organic platforms

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
- Every major line should feel specific and useful
- Do not write like a face-cam creator brief unless the input itself requires that
- Do not turn a physical product into a marketing tool
- If inferred type = content, do not turn it into a fake product ad

If platform = Landing page:
- More explanatory and persuasive
- Build trust clearly
- Still human, not robotic
- Emphasize objections, proof, desire, CTA
- More persuasive depth is allowed when it improves clarity

If platform = Email:
- Conversational persuasion
- Subject-line style energy in the beginning
- Emotional but clear
- Benefit-driven and action-oriented
- Easy to read
- Action should feel email-native, not social-video-native

NON-VIDEO PLATFORM EXECUTION RULE
If platform = Google Ads, Landing page, or Email:
- promptEngine must become a messaging brief, copy brief, or creative brief, not a creator filming brief
- do not force face cam, iPhone filming, creator posture, or camera movement unless the context explicitly demands it and it still fits
- shotlist should become an asset/content sequence, message sequence, or visual block sequence if needed
- beats should follow persuasion or message progression, not a video vlog rhythm
- keep the output native to the platform first

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
- be specific to the real input
- be specific to platform
- be specific to psychology
- be specific to tone
- be specific to duration
- be specific to context when provided
- be concise but actionable
- feel like a useful brief
- include camera angle and creator positioning guidance only for video-native platforms
- include message structure, asset logic, or conversion brief logic for non-video platforms
- be formatted as 6 to 10 short lines maximum
- each line must be useful and scannable
- avoid one-line promptEngine outputs
- avoid giant paragraphs

CAMERA DIRECTION RULE
For video-native platforms, think visually:
- camera angle
- framing
- creator position
- movement
- rhythm
- scene environment

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
- kitchen shot
- floor shot
- reaction shot
- before/after shot

For non-video platforms:
- replace camera logic with asset logic, message structure, copy block order, headline-support-proof flow, or visual content block logic

If relevant, incorporate this into:
- promptEngine
- beatsTiming
- shotlist
- creativeDirection

CREATOR POSITIONING RULE
Mention how the creator should appear only when the platform and content type make that relevant:
- face cam direct to viewer
- seated expert angle
- casual authentic angle
- testimonial angle
- demo angle
- problem/solution angle

Do not force creator positioning for Google Ads, Landing page, or Email when it does not fit.

HOOK RULES
Generate hook ideas that are:
- short
- sharp
- varied
- specific
- human
- non-repetitive
- adapted to the selected platform
- coherent with the actual input

If hook type is provided, use it as direction and respect it strongly.
Do not become repetitive or mechanical.

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
The label must accurately match the hook.

CREATIVE ANGLE RULES
Generate 3 distinct creative angles.
Each angle must feel meaningfully different and coherent with the actual input.

Examples of angle differences:
- pain/problem angle
- speed/ease angle
- status/desire angle
- skepticism/proof angle
- transformation angle
- lifestyle angle
- relatability angle
- confession angle
- lesson angle

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
- Do not write generic desire lines.
- Avoid "Imagine..." unless it is exceptionally natural.
- Prefer desire lines based on relief, ease, outcome, confidence, speed, proof, style, comfort, trust, identity, lesson, emotional release, or relatability depending on the input.

SHOTLIST RULES
Shotlists must be concrete and usable.
Avoid vague items.

If the platform is video-native:
- each shotlist should feel like a creator can film it immediately

If the platform is not video-native:
- each shotlist item should become a concrete asset/content block sequence or ad component sequence

If context gives a location or scene, use it concretely only when it fits the platform and input type.

If inferred type = content:
- do not invent a product to hold in hand
- do not say "montre le produit" unless a real product exists
- focus on scene, reaction, environment, expression, moment, tension, confession, or relatable visual cue

Good video-native shotlist examples:
- face cam close-up asking the hook directly
- top shot opening the package on a desk
- over-the-shoulder view showing the product in use
- close-up of product texture in hand
- mirror shot showing the product in context
- face cam in kitchen with the cat in background
- floor close-up showing the problem area
- reaction shot after showing the result

Good non-video shotlist examples:
- headline asset with direct problem-aware claim
- product visual with benefit overlay
- trust/proof block with review or credibility cue
- CTA block with clear low-friction action
- comparison asset highlighting practical benefit

Bad shotlist examples:
- show product
- show lifestyle
- show satisfaction

BEATS TIMING RULES
Each beat timing item must be short and actionable.
Add visual logic when useful.
The total pacing must fit the selected duration.

For non-video platforms, beatsTiming can reflect sequence/progression rather than literal second-by-second filming if that is more coherent.

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
- story opening vs direct result opening when relevant
Avoid awkward or abstract language.

If inferred type = content:
- testing can compare storytelling style, relatability angle, tension angle, confession angle, or emotional payoff
- do not talk like product marketing if there is no real product

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
- Open rate
- Reply rate
- Click rate
- Saves
- Shares
- Engagement rate

FINAL IMPORTANT OUTPUT RULE
Return valid JSON only.
No markdown.
No intro text.
No explanations.
No code fences.
`;

    const userPrompt = `
Generate exactly ${scriptsCount} high-quality scripts in ${languageName}.

Use these inputs:
- Audience: ${audience}
- Input / Offer / Topic: ${offer}
- Inferred type: ${inferredProductType}
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

Critical coherence rule:
- The real input is the source of truth.
- If the angle, objection, or price sounds like SaaS, service, creator-tool, or marketing language but the input is a story/content topic, reinterpret everything so the output stays believable.
- Do not write as if "mon chat fait pipi" is a product to buy.
- If inferred type = content, focus on story, awareness, emotion, and relatability.

Critical output language rule:
- Output everything only in ${languageName}.
- Do not mix languages.
- If the selected language is FR, every field must be in French.
- This includes promptEngine, platformStrategy, psychologicalAngle, creativeDirection, hook, AIDA, beats, proof, whyItWorks, adsVariants, shotlist, CTA, testingPlan, and KPI wording.

Critical promptEngine rule:
- promptEngine must be formatted as 6 to 10 short lines maximum.
- Each line should be compact, actionable, and easy to scan.
- Do not return a one-line promptEngine.
- Do not return a large paragraph.

Critical context rule:
${hasContext ? `- The provided context must clearly influence the hook, promptEngine, beats, beatsTiming, creativeDirection, and shotlist when it fits the selected platform and input type.` : "- No extra context was provided."}

Critical platform rule:
- The output must feel natively adapted to ${platform}.
- Do not generate TikTok-style writing for Email or Google Ads.
- Do not generate Google Ads-style writing for TikTok.
- Do not generate Facebook Ads-style CTA for Reels unless it feels natural.
- Platform adaptation must be obvious.

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

    let variants: Variant[] = Array.isArray(parsed?.variants) ? parsed.variants : [];

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
