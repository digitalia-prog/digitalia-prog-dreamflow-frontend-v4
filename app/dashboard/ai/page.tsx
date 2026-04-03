"use client";

import React, { useMemo, useState } from "react";

type Mode = "AGENCY";
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
};

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

export default function AiPage() {
  const [mode] = useState<Mode>("AGENCY");
  const [lang, setLang] = useState<Lang>("FR");
  const [platform, setPlatform] = useState("TikTok");
  const [objective, setObjective] = useState("Vente");
  const [audience, setAudience] = useState("E-commerçants (débutants) sur TikTok");
  const [offer, setOffer] = useState("Coaching UGC Growth");
  const [price, setPrice] = useState("49€/mois");
  const [angle, setAngle] = useState("ROI rapide & scripts prêts à filmer");
  const [objection, setObjection] = useState("J'ai pas le temps / je sais pas quoi dire");
  const [hookType, setHookType] = useState("Question choc");
  const [tone, setTone] = useState("UGC naturel (simple)");
  const [duration, setDuration] = useState("30s");
  const [market, setMarket] = useState("France");
  const [adsBudget, setAdsBudget] = useState("500-2000€");
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

  const addHelper = (helper: string) => {
    setBrief((prev) => {
      if (prev.includes(helper)) return prev;
      return prev.trim() ? `${prev}, ${helper}` : helper;
    });
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    setActiveScriptIndex(0);

    try {
      const res = await fetch("/api/generate", {
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

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Erreur génération");
        return;
      }

      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Erreur réseau ou API");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-col gap-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-sm text-white/60">UGC Growth • SaaS</div>
          <h1 className="mt-2 text-3xl font-bold">Script Engine — Agency</h1>
          <p className="mt-2 text-white/70">
            Remplis les champs → Générer = hooks, script AIDA, beats, proof, shotlist, CTA, testing plan et KPI.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="grid gap-4">
              <div>
                <label className="mb-2 block text-sm text-white/70">Mode</label>
                <select
                  value={mode}
                  disabled
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white"
                >
                  <option value="AGENCY">AGENCY</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">Langue</label>
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value as Lang)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white"
                >
                  <option value="FR">FR</option>
                  <option value="EN">EN</option>
                  <option value="ES">ES</option>
                  <option value="AR">AR</option>
                  <option value="ZH">ZH</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">Plateforme</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white"
                >
                  <option>TikTok</option>
                  <option>Instagram Reels</option>
                  <option>YouTube Shorts</option>
                  <option>Facebook Ads</option>
                  <option>Google Ads</option>
                  <option>Landing page</option>
                  <option>Email</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">Objectif</label>
                <select
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white"
                >
                  <option>Vente</option>
                  <option>Awareness</option>
                  <option>Lead</option>
                  <option>Trafic</option>
                  <option>Conversion</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">Audience</label>
                <input
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">Offre / Produit</label>
                <input
                  value={offer}
                  onChange={(e) => setOffer(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">Prix</label>
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">Marché</label>
                <select
                  value={market}
                  onChange={(e) => setMarket(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white"
                >
                  <option>France</option>
                  <option>USA</option>
                  <option>UK</option>
                  <option>Arabic</option>
                  <option>Global</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">Budget Ads</label>
                <select
                  value={adsBudget}
                  onChange={(e) => setAdsBudget(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white"
                >
                  <option>0-500€</option>
                  <option>500-2000€</option>
                  <option>2000€+</option>
                  <option>5000€+</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">Angle marketing</label>
                <textarea
                  value={angle}
                  onChange={(e) => setAngle(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">Objection principale</label>
                <textarea
                  value={objection}
                  onChange={(e) => setObjection(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">Type de Hook</label>
                <select
                  value={hookType}
                  onChange={(e) => setHookType(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white"
                >
                  <option>Question choc</option>
                  <option>Story</option>
                  <option>Pain point</option>
                  <option>Direct claim</option>
                  <option>Contrarian</option>
                  <option>Curiosity</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">Ton</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white"
                >
                  <option>UGC naturel (simple)</option>
                  <option>Direct response</option>
                  <option>Storytelling</option>
                  <option>Premium</option>
                  <option>Funny</option>
                  <option>Performance Ads</option>
                  <option>Authority / Expert</option>
                  <option>Emotional</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">Durée</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white"
                >
                  <option>15s</option>
                  <option>30s</option>
                  <option>45s</option>
                  <option>60s</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Brief créatif / Contexte (recommandé)
                </label>
                <textarea
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  rows={5}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white"
                />
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold text-violet-200">AIDE AU PROMPT</div>
                <div className="mt-2 text-sm text-white/70">
                  Ajoute par exemple : lieu, type de plan, style créateur, ambiance, personne présente, scène réelle, produit en main, mouvement caméra, format UGC.
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

              <div className="text-sm text-white/60">
                Pour de meilleurs résultats, ajoute le plus de détails utiles possible : lieu, style de vidéo, angle caméra, ton, personne présente, objet en main, décor, situation réelle.
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-60"
              >
                {loading ? "Génération..." : "Générer 10 scripts"}
              </button>

              {error ? (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                  {error}
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm font-semibold text-white/90">Hooks générés</div>
              <div className="mt-3 text-white/80">
                {result?.hookIdeas?.length ? result.hookIdeas.join(" • ") : "-"}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm font-semibold text-white/90">Angles créatifs</div>
              <div className="mt-3 text-white/80">
                {result?.creativeAngles?.length ? result.creativeAngles.join(" • ") : "-"}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm font-semibold text-white/90">Plan de test global</div>
              <div className="mt-3 text-white/80">
                {result?.testingPlanSummary || "-"}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm font-semibold text-white/90">Scripts générés</div>

              {variants.length > 0 ? (
                <>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {variants.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setActiveScriptIndex(index)}
                        className={`rounded-xl px-3 py-2 text-sm font-semibold ${
                          activeScriptIndex === index
                            ? "bg-purple-600 text-white"
                            : "border border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                        }`}
                      >
                        Script {index + 1}
                      </button>
                    ))}
                  </div>

                  <div className="mt-5 space-y-5">
                    <Block title="Prompt Engine" value={activeVariant?.promptEngine || "-"} />
                    <Block title="Hook" value={activeVariant?.hook || "-"} />
                    <Block title="Hook détecté" value={activeVariant?.hookDetected || "-"} />
                    <Block title="Script" value={scriptText || "-"} />
                    <ListBlock title="Beats" items={activeVariant?.beats || []} />
                    <ListBlock title="Beats Timing" items={activeVariant?.beatsTiming || []} />
                    <ListBlock title="Proof" items={activeVariant?.proof || []} />
                    <ListBlock title="Pourquoi ça marche" items={activeVariant?.whyItWorks || []} />
                    <ListBlock title="Variantes Ads" items={activeVariant?.adsVariants || []} />
                    <ListBlock title="Shotlist" items={activeVariant?.shotlist || []} />
                    <Block title="CTA" value={activeVariant?.cta?.primary || "-"} />
                    <Block title="CTA optimisé" value={activeVariant?.cta?.optimized || "-"} />
                    <Block title="Stratégie plateforme" value={activeVariant?.platformStrategy || "-"} />
                    <Block title="Angle psychologique" value={activeVariant?.psychologicalAngle || "-"} />
                    <Block title="Direction créative" value={activeVariant?.creativeDirection || "-"} />
                    <Block title="Plan de test" value={activeVariant?.testingPlan || "-"} />
                    <Block title="KPI" value={activeVariant?.kpi || "-"} />
                  </div>
                </>
              ) : (
                <div className="mt-3 text-white/70">-</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Block({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <div className="text-sm font-semibold text-white/90">{title}</div>
      <div className="mt-2 whitespace-pre-wrap text-white/80">{value}</div>
    </div>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="text-sm font-semibold text-white/90">{title}</div>
      <ul className="mt-2 space-y-1 text-white/80">
        {items.length ? items.map((item, index) => <li key={index}>• {item}</li>) : <li>-</li>}
      </ul>
    </div>
  );
}
