"use client";

import React, { useMemo, useState } from "react";

type Mode = "AGENCY";
type Lang = "FR" | "EN" | "ES" | "AR" | "ZH";

type Variant = {
  promptEngine?: string;
  hook?: string;
  hookDetected?: string;
  platformStrategy?: string;
  psychologicalAngle?: string;
  creativeDirection?: string;
  beats?: string[];
  beatsTiming?: string[];
  proof?: string[];
  whyItWorks?: string[];
  adsVariants?: string[];
  shotlist?: string[];
  testingPlan?: string;
  kpi?: string;
  script?: {
    aida?: {
      attention?: string;
      interest?: string;
      desire?: string;
      action?: string;
    };
  };
  cta?: {
    primary?: string;
    optimized?: string;
  };
};

type GenerateResponse = {
  hookIdeas?: string[];
  creativeAngles?: string[];
  testingPlanSummary?: string;
  variants?: Variant[];
  raw?: string;
  error?: string;
  details?: string;
};

const PLATFORMS = [
  "TikTok",
  "Instagram Reels",
  "YouTube Shorts",
  "Facebook Ads",
  "Google Ads",
  "Landing page",
  "Email",
];

const OBJECTIVES = ["Vente", "Lead", "Awareness", "UGC", "Conversion"];

const HOOK_TYPES = [
  "Question choc",
  "Story",
  "Pain point",
  "Contrarian",
  "Direct claim",
  "Curiosity",
];

const TONES = [
  "UGC naturel (simple)",
  "Direct response",
  "Storytelling",
  "Premium",
  "Funny",
  "Performance Ads",
  "Authority / Expert",
  "Emotional",
];

const DURATIONS = ["15s", "30s", "45s", "60s"];

const PROMPT_HELPERS = [
  "Face cam",
  "UGC selfie",
  "Product demo",
  "POV",
  "Story personnelle",
  "Avant / Après",
  "Avec produit en main",
  "Filmé sur iPhone",
  "Ton très naturel",
  "Cuisine",
  "Bureau",
  "Voiture",
];

function cn(...v: (string | false | null | undefined)[]) {
  return v.filter(Boolean).join(" ");
}

function addText(current: string, value: string) {
  const trimmed = current.trim();
  if (!trimmed) return value;
  if (trimmed.toLowerCase().includes(value.toLowerCase())) return trimmed;
  return `${trimmed}, ${value}`;
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="mb-4 text-sm font-semibold text-white/90">{title}</div>
      {children}
    </div>
  );
}

function TextBlock({ value }: { value?: string }) {
  return (
    <div className="whitespace-pre-wrap text-sm leading-6 text-white/80">
      {value && value.trim() ? value : "-"}
    </div>
  );
}

function ListBlock({ items }: { items?: string[] }) {
  if (!Array.isArray(items) || items.length === 0) {
    return <div className="text-sm text-white/40">-</div>;
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={`${item}-${index}`}
          className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/80"
        >
          • {item}
        </div>
      ))}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-white/70">{label}</label>
      {children}
    </div>
  );
}

function WorkflowCard({
  step,
  title,
  text,
}: {
  step: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="text-xs font-semibold text-violet-200">{step}</div>
      <div className="mt-2 text-base font-semibold text-white">{title}</div>
      <div className="mt-2 text-sm text-white/60">{text}</div>
    </div>
  );
}

export default function AiPage() {
  const inputCls =
    "w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-violet-500";

  const [mode] = useState<Mode>("AGENCY");
  const [lang, setLang] = useState<Lang>("FR");
  const [platform, setPlatform] = useState("TikTok");
  const [objective, setObjective] = useState("Vente");
  const [audience, setAudience] = useState(
    "E-commerçants (débutants) sur TikTok"
  );
  const [offer, setOffer] = useState("Coaching UGC Growth");
  const [price, setPrice] = useState("49€/mois");
  const [market, setMarket] = useState("France");
  const [adsBudget, setAdsBudget] = useState("500-2000€");
  const [angle, setAngle] = useState("ROI rapide & scripts prêts à filmer");
  const [objection, setObjection] = useState(
    "J'ai pas le temps / je sais pas quoi dire"
  );
  const [hookType, setHookType] = useState("Question choc");
  const [tone, setTone] = useState("UGC naturel (simple)");
  const [duration, setDuration] = useState("30s");
  const [brief, setBrief] = useState(
    "Exemple : Face cam avec mon chat réel, vidéo tournée dans la cuisine, ton très naturel, produit en main, filmé sur iPhone, style UGC simple."
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [activeScriptIndex, setActiveScriptIndex] = useState(0);

  const variants = useMemo(() => result?.variants || [], [result]);
  const activeVariant = variants[activeScriptIndex];

  const scriptText = [
    activeVariant?.script?.aida?.attention,
    activeVariant?.script?.aida?.interest,
    activeVariant?.script?.aida?.desire,
    activeVariant?.script?.aida?.action,
  ]
    .filter(Boolean)
    .join("\n\n");

  function addHelper(helper: string) {
    setBrief((prev) => addText(prev, helper));
  }

  async function handleGenerate() {
    setLoading(true);
    setError("");
    setResult(null);
    setActiveScriptIndex(0);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode,
          lang,
          platform,
          objective,
          audience,
          offer,
          price,
          angle: `${angle} | Marché: ${market} | Budget ads: ${adsBudget}`,
          objection,
          hookType,
          tone,
          duration,
          context: brief,
        }),
      });

      const data: GenerateResponse = await response.json();

      if (!response.ok) {
        throw new Error(data?.details || data?.error || "Erreur génération");
      }

      setResult(data);
    } catch (err: any) {
      setError(String(err?.message || err || "Erreur inconnue"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-col gap-6">
        <div className="rounded-3xl border border-purple-400/20 bg-gradient-to-br from-purple-600/20 via-white/5 to-black/20 p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-sm text-white/60">UGC Growth • Agency</div>

              <h1 className="mt-2 text-3xl font-bold text-white">
                Script Engine — Agency
              </h1>

              <p className="mt-2 max-w-3xl text-white/70">
                Transforme une offre en 10 scripts ads prêts à tester : hooks,
                AIDA, beats, proof, shotlist, CTA, testing plan et KPI.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="/dashboard/analyze-upload"
                className="rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
              >
                Analyser une vidéo
              </a>

              <a
                href="/dashboard/campaigns"
                className="rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
              >
                Créer une campagne
              </a>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <WorkflowCard
            step="01"
            title="Brief"
            text="Définis l’offre, le marché, l’audience et l’objection principale."
          />
          <WorkflowCard
            step="02"
            title="Hooks"
            text="Génère des angles d’entrée capables de capter l’attention."
          />
          <WorkflowCard
            step="03"
            title="Scripts"
            text="Obtiens 10 scripts Agency structurés pour produire plus vite."
          />
          <WorkflowCard
            step="04"
            title="Test plan"
            text="Sors avec des variantes, KPI et pistes de test créatif."
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="mb-5">
              <div className="text-lg font-semibold text-white">
                Brief de génération
              </div>
              <div className="mt-1 text-sm text-white/55">
                Plus le brief est précis, plus les scripts sortent exploitables.
              </div>
            </div>

            <div className="grid gap-4">
              <Field label="Mode">
                <select value={mode} disabled className={inputCls}>
                  <option value="AGENCY">AGENCY — 10 scripts</option>
                </select>
              </Field>

              <Field label="Langue">
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value as Lang)}
                  className={inputCls}
                >
                  <option value="FR">FR</option>
                  <option value="EN">EN</option>
                  <option value="ES">ES</option>
                  <option value="AR">AR</option>
                  <option value="ZH">ZH</option>
                </select>
              </Field>

              <Field label="Plateforme">
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className={inputCls}
                >
                  {PLATFORMS.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </Field>

              <Field label="Objectif">
                <select
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className={inputCls}
                >
                  {OBJECTIVES.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </Field>

              <Field label="Audience">
                <input
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className={inputCls}
                />
              </Field>

              <Field label="Offre / Produit">
                <input
                  value={offer}
                  onChange={(e) => setOffer(e.target.value)}
                  className={inputCls}
                />
              </Field>

              <Field label="Prix">
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className={inputCls}
                />
              </Field>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Marché">
                  <select
                    value={market}
                    onChange={(e) => setMarket(e.target.value)}
                    className={inputCls}
                  >
                    <option>France</option>
                    <option>USA</option>
                    <option>UK</option>
                    <option>Arabic</option>
                    <option>Global</option>
                  </select>
                </Field>

                <Field label="Budget Ads">
                  <select
                    value={adsBudget}
                    onChange={(e) => setAdsBudget(e.target.value)}
                    className={inputCls}
                  >
                    <option>0-500€</option>
                    <option>500-2000€</option>
                    <option>2000€+</option>
                    <option>5000€+</option>
                  </select>
                </Field>
              </div>

              <Field label="Angle marketing">
                <textarea
                  value={angle}
                  onChange={(e) => setAngle(e.target.value)}
                  rows={3}
                  className={inputCls}
                />
              </Field>

              <Field label="Objection principale">
                <textarea
                  value={objection}
                  onChange={(e) => setObjection(e.target.value)}
                  rows={3}
                  className={inputCls}
                />
              </Field>

              <Field label="Type de Hook">
                <select
                  value={hookType}
                  onChange={(e) => setHookType(e.target.value)}
                  className={inputCls}
                >
                  {HOOK_TYPES.map((h) => (
                    <option key={h}>{h}</option>
                  ))}
                </select>
              </Field>

              <Field label="Ton">
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className={inputCls}
                >
                  {TONES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Field>

              <Field label="Durée">
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className={inputCls}
                >
                  {DURATIONS.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </Field>

              <Field label="Brief créatif / Contexte">
                <textarea
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  rows={5}
                  className={inputCls}
                />
              </Field>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm font-semibold text-violet-200">
                  Aide au prompt
                </div>
                <div className="mt-2 text-sm text-white/60">
                  Ajoute le lieu, le type de plan, le style créateur, la scène,
                  le produit en main, l’ambiance et le format UGC.
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {PROMPT_HELPERS.map((helper) => (
                    <button
                      key={helper}
                      type="button"
                      onClick={() => addHelper(helper)}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/85 hover:bg-white/10"
                    >
                      + {helper}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className={cn(
                  "rounded-xl px-5 py-3 font-semibold text-white transition",
                  loading
                    ? "cursor-not-allowed bg-white/10 text-white/60"
                    : "bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-500 hover:to-fuchsia-400"
                )}
              >
                {loading ? "Génération..." : "Générer 10 scripts"}
              </button>

              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                  {error}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Panel title="Hooks générés">
              <ListBlock items={result?.hookIdeas} />
            </Panel>

            <Panel title="Angles créatifs">
              <ListBlock items={result?.creativeAngles} />
            </Panel>

            <Panel title="Plan de test global">
              <TextBlock value={result?.testingPlanSummary} />
            </Panel>

            <Panel title="Scripts générés">
              {variants.length > 0 ? (
                <>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {variants.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setActiveScriptIndex(index)}
                        className={cn(
                          "rounded-xl px-3 py-2 text-sm font-semibold",
                          activeScriptIndex === index
                            ? "bg-purple-600 text-white"
                            : "border border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                        )}
                      >
                        Script {index + 1}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                    <Panel title="Prompt Engine">
                      <TextBlock value={activeVariant?.promptEngine} />
                    </Panel>

                    <Panel title="Hook">
                      <TextBlock value={activeVariant?.hook} />
                    </Panel>

                    <Panel title="Hook détecté">
                      <TextBlock value={activeVariant?.hookDetected} />
                    </Panel>

                    <Panel title="Script AIDA">
                      <TextBlock value={scriptText} />
                    </Panel>

                    <Panel title="Beats">
                      <ListBlock items={activeVariant?.beats} />
                    </Panel>

                    <Panel title="Beats timing">
                      <ListBlock items={activeVariant?.beatsTiming} />
                    </Panel>

                    <Panel title="Proof">
                      <ListBlock items={activeVariant?.proof} />
                    </Panel>

                    <Panel title="Pourquoi ça marche">
                      <ListBlock items={activeVariant?.whyItWorks} />
                    </Panel>

                    <Panel title="Variantes Ads">
                      <ListBlock items={activeVariant?.adsVariants} />
                    </Panel>

                    <Panel title="Shotlist">
                      <ListBlock items={activeVariant?.shotlist} />
                    </Panel>

                    <Panel title="CTA">
                      <TextBlock value={activeVariant?.cta?.primary} />
                    </Panel>

                    <Panel title="CTA optimisé">
                      <TextBlock value={activeVariant?.cta?.optimized} />
                    </Panel>

                    <Panel title="Stratégie plateforme">
                      <TextBlock value={activeVariant?.platformStrategy} />
                    </Panel>

                    <Panel title="Angle psychologique">
                      <TextBlock value={activeVariant?.psychologicalAngle} />
                    </Panel>

                    <Panel title="Direction créative">
                      <TextBlock value={activeVariant?.creativeDirection} />
                    </Panel>

                    <Panel title="Plan de test">
                      <TextBlock value={activeVariant?.testingPlan} />
                    </Panel>

                    <Panel title="KPI">
                      <TextBlock value={activeVariant?.kpi} />
                    </Panel>
                  </div>
                </>
              ) : (
                <div className="text-sm text-white/45">
                  Les 10 scripts Agency apparaîtront ici après génération.
                </div>
              )}
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}
