"use client";

import { useEffect, useMemo, useState } from "react";

type Mode = "AGENCY" | "CREATOR";
type Lang = "FR" | "EN" | "ES" | "AR" | "ZH";

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

type GenerateResponse = {
  hookIdeas?: string[];
  creativeAngles?: string[];
  testingPlanSummary?: string;
  variants?: Variant[];
  raw?: string;
  parsed?: {
    hookIdeas?: string[];
    creativeAngles?: string[];
    testingPlanSummary?: string;
    variants?: Variant[];
  };
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
];

const DURATIONS = ["15s", "30s", "45s", "60s"];

function cn(...v: (string | false | null | undefined)[]) {
  return v.filter(Boolean).join(" ");
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="text-sm text-white/80">{label}</div>
      {children}
    </div>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#14121c] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <h3 className="mb-4 text-base font-semibold text-white">{title}</h3>
      {children}
    </div>
  );
}

function ListBlock({ items }: { items?: string[] }) {
  if (!items || !items.length) {
    return <div className="text-white/40">-</div>;
  }

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div
          key={`${item}-${i}`}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/85"
        >
          • {item}
        </div>
      ))}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 text-xs uppercase tracking-wide text-violet-300">
      {children}
    </div>
  );
}

export default function AiPage() {
  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-violet-500";
  const selectCls = inputCls;
  const textareaCls = cn(inputCls, "min-h-[96px]");

  const [mode, setMode] = useState<Mode>("AGENCY");
  const [lang, setLang] = useState<Lang>("FR");
  const [platform, setPlatform] = useState<string>("TikTok");
  const [objective, setObjective] = useState<string>("Vente");
  const [audience, setAudience] = useState<string>(
    "E-commerçants (débutants) sur TikTok"
  );
  const [offer, setOffer] = useState<string>("Coaching UGC Growth");
  const [price, setPrice] = useState<string>("49€/mois");
  const [angle, setAngle] = useState<string>(
    "ROI rapide & scripts prêts à filmer"
  );
  const [objection, setObjection] = useState<string>(
    "J’ai pas le temps / je sais pas quoi dire"
  );
  const [hookType, setHookType] = useState<string>("Question choc");
  const [tone, setTone] = useState<string>("UGC naturel (simple)");
  const [duration, setDuration] = useState<string>("30s");
  const [context, setContext] = useState<string>("Générer 10 scripts");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [hookIdeas, setHookIdeas] = useState<string[]>([]);
  const [creativeAngles, setCreativeAngles] = useState<string[]>([]);
  const [testingPlanSummary, setTestingPlanSummary] = useState<string>("");
  const [variants, setVariants] = useState<Variant[]>([]);
  const [activeScriptIndex, setActiveScriptIndex] = useState(0);

  const scriptsCount = useMemo(() => (mode === "AGENCY" ? 10 : 4), [mode]);

  const title = useMemo(
    () =>
      mode === "AGENCY"
        ? "Script Engine — Agency"
        : "Script Engine — Creator",
    [mode]
  );

  useEffect(() => {
    setActiveScriptIndex(0);
  }, [mode]);

  useEffect(() => {
    if (!variants.length) {
      setActiveScriptIndex(0);
      return;
    }
    if (activeScriptIndex > variants.length - 1) {
      setActiveScriptIndex(0);
    }
  }, [variants, activeScriptIndex]);

  async function onGenerate() {
    setLoading(true);
    setError("");
    setHookIdeas([]);
    setCreativeAngles([]);
    setTestingPlanSummary("");
    setVariants([]);
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
          angle,
          objection,
          hookType,
          tone,
          duration,
          context,
        }),
      });

      const data: GenerateResponse = await response.json();

      if (!response.ok) {
        throw new Error(data?.details || data?.error || "Erreur API");
      }

      let payload: any = data?.parsed ?? data ?? {};

      const isEmptyPayload =
        !Array.isArray(payload?.hookIdeas) &&
        !Array.isArray(payload?.creativeAngles) &&
        !Array.isArray(payload?.variants) &&
        typeof payload?.testingPlanSummary !== "string";

      if (isEmptyPayload && typeof data?.raw === "string" && data.raw.trim()) {
        try {
          payload = JSON.parse(data.raw);
        } catch {
          // keep payload as is
        }
      }

      const nextHookIdeas = Array.isArray(payload?.hookIdeas)
        ? payload.hookIdeas
        : [];
      const nextCreativeAngles = Array.isArray(payload?.creativeAngles)
        ? payload.creativeAngles
        : [];
      const nextTestingPlan =
        typeof payload?.testingPlanSummary === "string"
          ? payload.testingPlanSummary
          : "";
      const nextVariants = Array.isArray(payload?.variants)
        ? payload.variants
        : [];

      setHookIdeas(nextHookIdeas);
      setCreativeAngles(nextCreativeAngles);
      setTestingPlanSummary(nextTestingPlan);
      setVariants(nextVariants);
      setActiveScriptIndex(0);

      if (
        !nextHookIdeas.length &&
        !nextCreativeAngles.length &&
        !nextTestingPlan &&
        !nextVariants.length
      ) {
        console.log("API RESPONSE:", data);
        console.log("PAYLOAD USED:", payload);
        setError("La réponse API est vide ou dans un format non reconnu.");
      }
    } catch (e: any) {
      setError(String(e?.message ?? e ?? "Erreur inconnue"));
    } finally {
      setLoading(false);
    }
  }

  const activeVariant =
    variants.length && variants[activeScriptIndex]
      ? variants[activeScriptIndex]
      : null;

  return (
    <main className="min-h-screen bg-[#0b0b12] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-2xl border border-white/10 bg-[#14121c] p-6">
          <h1 className="mb-2 text-3xl font-bold text-white">{title}</h1>
          <p className="text-white/65">
            Remplis les champs → Générer = hooks, script AIDA, beats, proof,
            shotlist, CTA, testing plan et KPI.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
          <div className="rounded-2xl border border-white/10 bg-[#14121c] p-6">
            <div className="grid gap-4">
              <Field label="Mode">
                <select
                  className={selectCls}
                  value={mode}
                  onChange={(e) => {
                    const nextMode = e.target.value as Mode;
                    setMode(nextMode);
                    setContext(
                      nextMode === "AGENCY"
                        ? "Générer 10 scripts"
                        : "Générer 4 scripts"
                    );
                  }}
                >
                  <option value="AGENCY">AGENCY</option>
                  <option value="CREATOR">CREATOR</option>
                </select>
              </Field>

              <Field label="Langue">
                <select
                  className={selectCls}
                  value={lang}
                  onChange={(e) => setLang(e.target.value as Lang)}
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
                  className={selectCls}
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                >
                  {PLATFORMS.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </Field>

              <Field label="Objectif">
                <select
                  className={selectCls}
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                >
                  {OBJECTIVES.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </Field>

              <Field label="Audience">
                <input
                  className={inputCls}
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                />
              </Field>

              <Field label="Offre / Produit">
                <input
                  className={inputCls}
                  value={offer}
                  onChange={(e) => setOffer(e.target.value)}
                />
              </Field>

              <Field label="Prix">
                <input
                  className={inputCls}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </Field>

              <Field label="Angle marketing">
                <textarea
                  className={textareaCls}
                  value={angle}
                  onChange={(e) => setAngle(e.target.value)}
                />
              </Field>

              <Field label="Objection principale">
                <textarea
                  className={textareaCls}
                  value={objection}
                  onChange={(e) => setObjection(e.target.value)}
                />
              </Field>

              <Field label="Type de Hook">
                <select
                  className={selectCls}
                  value={hookType}
                  onChange={(e) => setHookType(e.target.value)}
                >
                  {HOOK_TYPES.map((h) => (
                    <option key={h}>{h}</option>
                  ))}
                </select>
              </Field>

              <Field label="Ton">
                <select
                  className={selectCls}
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                >
                  {TONES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Field>

              <Field label="Durée">
                <select
                  className={selectCls}
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                >
                  {DURATIONS.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </Field>

              <Field label="Contexte (optionnel)">
                <textarea
                  className={textareaCls}
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                />
              </Field>

              <button
                onClick={onGenerate}
                disabled={loading}
                className={cn(
                  "rounded-xl px-5 py-3 font-semibold text-white transition",
                  loading
                    ? "cursor-not-allowed bg-white/10 text-white/60"
                    : "bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-500 hover:to-fuchsia-400"
                )}
              >
                {loading ? "Génération..." : `Générer ${scriptsCount} scripts`}
              </button>

              {error ? <div className="text-sm text-red-400">{error}</div> : null}
            </div>
          </div>

          <div className="space-y-6">
            <Block title="Hooks générés">
              <ListBlock items={hookIdeas} />
            </Block>

            <Block title="Angles créatifs">
              <ListBlock items={creativeAngles} />
            </Block>

            <Block title="Plan de test global">
              {testingPlanSummary ? (
                <div className="whitespace-pre-wrap text-sm text-white/85">
                  {testingPlanSummary}
                </div>
              ) : (
                <div className="text-white/40">-</div>
              )}
            </Block>

            <Block title="Scripts générés">
              {variants.length ? (
                <div className="space-y-5">
                  <div className="flex flex-wrap gap-2">
                    {variants.map((_, index) => {
                      const isActive = index === activeScriptIndex;
                      return (
                        <button
                          key={`tab-${index}`}
                          type="button"
                          onClick={() => setActiveScriptIndex(index)}
                          className={cn(
                            "rounded-xl px-3 py-2 text-sm font-medium transition",
                            isActive
                              ? "bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white"
                              : "border border-white/10 bg-white/5 text-white/75 hover:bg-white/10"
                          )}
                        >
                          Script {index + 1}
                        </button>
                      );
                    })}
                  </div>

                  {activeVariant ? (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="mb-4 text-sm font-semibold text-white/70">
                        Script {activeScriptIndex + 1}
                      </div>

                      <div className="space-y-5">
                        <div>
                          <SectionTitle>Prompt Engine</SectionTitle>
                          <div className="whitespace-pre-wrap text-sm text-white/90">
                            {activeVariant?.promptEngine || "-"}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="text-sm text-white/80">
                            <span className="font-semibold text-white">
                              Stratégie plateforme :
                            </span>{" "}
                            {activeVariant?.platformStrategy || "-"}
                          </div>
                          <div className="text-sm text-white/80">
                            <span className="font-semibold text-white">
                              Angle psychologique :
                            </span>{" "}
                            {activeVariant?.psychologicalAngle || "-"}
                          </div>
                          <div className="text-sm text-white/80">
                            <span className="font-semibold text-white">
                              Direction créative :
                            </span>{" "}
                            {activeVariant?.creativeDirection || "-"}
                          </div>
                        </div>

                        <div>
                          <SectionTitle>Hook</SectionTitle>
                          <div className="text-sm text-white">
                            {activeVariant?.hook || "-"}
                          </div>
                        </div>

                        <div>
                          <SectionTitle>Hook détecté</SectionTitle>
                          <div className="text-sm text-white/90">
                            {activeVariant?.hookDetected || "-"}
                          </div>
                        </div>

                        <div>
                          <SectionTitle>Script (AIDA)</SectionTitle>
                          <div className="space-y-2 text-sm text-white/90">
                            <div>
                              <span className="font-semibold text-white">
                                Attention:
                              </span>{" "}
                              {activeVariant?.script?.aida?.attention || "-"}
                            </div>
                            <div>
                              <span className="font-semibold text-white">
                                Interest:
                              </span>{" "}
                              {activeVariant?.script?.aida?.interest || "-"}
                            </div>
                            <div>
                              <span className="font-semibold text-white">
                                Desire:
                              </span>{" "}
                              {activeVariant?.script?.aida?.desire || "-"}
                            </div>
                            <div>
                              <span className="font-semibold text-white">
                                Action:
                              </span>{" "}
                              {activeVariant?.script?.aida?.action || "-"}
                            </div>
                          </div>
                        </div>

                        <div>
                          <SectionTitle>Beats</SectionTitle>
                          <ListBlock items={activeVariant?.beats} />
                        </div>

                        <div>
                          <SectionTitle>Beats timing</SectionTitle>
                          <ListBlock items={activeVariant?.beatsTiming} />
                        </div>

                        <div>
                          <SectionTitle>Proof</SectionTitle>
                          <ListBlock items={activeVariant?.proof} />
                        </div>

                        <div>
                          <SectionTitle>Pourquoi ça marche</SectionTitle>
                          <ListBlock items={activeVariant?.whyItWorks} />
                        </div>

                        <div>
                          <SectionTitle>Variantes Ads</SectionTitle>
                          <ListBlock items={activeVariant?.adsVariants} />
                        </div>

                        <div>
                          <SectionTitle>Shotlist</SectionTitle>
                          <ListBlock items={activeVariant?.shotlist} />
                        </div>

                        <div>
                          <SectionTitle>CTA</SectionTitle>
                          <div className="text-sm text-white/90">
                            {activeVariant?.cta?.primary || "-"}
                          </div>
                        </div>

                        <div>
                          <SectionTitle>CTA optimisé</SectionTitle>
                          <div className="text-sm text-white/90">
                            {activeVariant?.cta?.optimized || "-"}
                          </div>
                        </div>

                        <div>
                          <SectionTitle>Testing Plan</SectionTitle>
                          <div className="text-sm text-white/90">
                            {activeVariant?.testingPlan || "-"}
                          </div>
                        </div>

                        <div>
                          <SectionTitle>KPI</SectionTitle>
                          <div className="text-sm text-white/90">
                            {activeVariant?.kpi || "-"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-white/40">-</div>
                  )}
                </div>
              ) : (
                <div className="text-white/40">-</div>
              )}
            </Block>
          </div>
        </div>
      </div>
    </main>
  );
}
