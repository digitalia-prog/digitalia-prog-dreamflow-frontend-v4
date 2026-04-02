"use client";

import React, { useState } from "react";

type Lang = "FR" | "EN" | "ES" | "AR" | "ZH";

type GenerateResponse = {
  hookIdeas?: string[];
  creativeAngles?: string[];
  testingPlanSummary?: string;
  variants?: Array<{
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
  }>;
  raw?: string;
};

export default function CreatorEnginePage() {
  const [lang, setLang] = useState<Lang>("FR");
  const [platform, setPlatform] = useState("TikTok");
  const [objective, setObjective] = useState("Vente");
  const [audience, setAudience] = useState("");
  const [product, setProduct] = useState("");
  const [price, setPrice] = useState("");
  const [angle, setAngle] = useState("");
  const [objection, setObjection] = useState("");
  const [hookType, setHookType] = useState("Direct claim");
  const [tone, setTone] = useState("UGC naturel");
  const [duration, setDuration] = useState("30s");
  const [brief, setBrief] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<GenerateResponse | null>(null);

  const variant = result?.variants?.[0];

  const scriptText = [
    variant?.script?.aida?.attention,
    variant?.script?.aida?.interest,
    variant?.script?.aida?.desire,
    variant?.script?.aida?.action,
  ]
    .filter(Boolean)
    .join("\n\n");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "CREATOR",
          lang,
          platform,
          objective,
          audience,
          product,
          price,
          angle,
          objection,
          hookType,
          tone,
          duration,
          brief,
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
        <div>
          <div className="text-sm text-white/60">UGC Growth • Creator</div>
          <h1 className="mt-2 text-3xl font-bold">Creator Script Engine</h1>
          <p className="mt-2 max-w-2xl text-white/70">
            Version simple pour générer rapidement un script prêt à filmer.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              className="rounded-xl border border-white/10 bg-black/20 px-4 py-3"
            >
              <option value="FR">Français</option>
              <option value="EN">English</option>
              <option value="ES">Español</option>
              <option value="AR">Arabic</option>
              <option value="ZH">Chinese</option>
            </select>

            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="rounded-xl border border-white/10 bg-black/20 px-4 py-3"
            >
              <option value="TikTok">TikTok</option>
              <option value="Instagram Reels">Instagram Reels</option>
              <option value="YouTube Shorts">YouTube Shorts</option>
              <option value="Facebook Ads">Facebook Ads</option>
              <option value="Google Ads">Google Ads</option>
            </select>

            <select
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="rounded-xl border border-white/10 bg-black/20 px-4 py-3"
            >
              <option value="Vente">Vente</option>
              <option value="Awareness">Awareness</option>
              <option value="Lead">Lead</option>
              <option value="Trafic">Trafic</option>
            </select>

            <input
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="Audience"
              className="rounded-xl border border-white/10 bg-black/20 px-4 py-3"
            />

            <input
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="Produit / Offre"
              className="rounded-xl border border-white/10 bg-black/20 px-4 py-3"
            />

            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Prix"
              className="rounded-xl border border-white/10 bg-black/20 px-4 py-3"
            />

            <input
              value={angle}
              onChange={(e) => setAngle(e.target.value)}
              placeholder="Angle marketing"
              className="rounded-xl border border-white/10 bg-black/20 px-4 py-3"
            />

            <input
              value={objection}
              onChange={(e) => setObjection(e.target.value)}
              placeholder="Objection principale"
              className="rounded-xl border border-white/10 bg-black/20 px-4 py-3"
            />

            <select
              value={hookType}
              onChange={(e) => setHookType(e.target.value)}
              className="rounded-xl border border-white/10 bg-black/20 px-4 py-3"
            >
              <option value="Direct claim">Direct claim</option>
              <option value="Question choc">Question choc</option>
              <option value="Pain point">Pain point</option>
              <option value="Story">Story</option>
              <option value="Contrarian">Contrarian</option>
              <option value="Curiosity">Curiosity</option>
            </select>

            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="rounded-xl border border-white/10 bg-black/20 px-4 py-3"
            >
              <option value="UGC naturel">UGC naturel</option>
              <option value="Simple">Simple</option>
              <option value="Direct">Direct</option>
              <option value="Premium">Premium</option>
              <option value="Convaincant">Convaincant</option>
            </select>

            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 md:col-span-2"
            >
              <option value="15s">15s</option>
              <option value="30s">30s</option>
              <option value="45s">45s</option>
              <option value="60s">60s</option>
            </select>

            <textarea
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              rows={5}
              placeholder="Contexte / brief / ce que tu veux vendre / angle vidéo"
              className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 md:col-span-2"
            />

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="rounded-xl bg-purple-600 px-5 py-3 font-semibold hover:bg-purple-700 disabled:opacity-60 md:col-span-2"
            >
              {loading ? "Génération..." : "Générer un script"}
            </button>
          </div>

          {error ? (
            <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
              {error}
            </div>
          ) : null}
        </div>

        {result ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="space-y-6">
              <div>
                <div className="text-lg font-semibold">Prompt Engine</div>
                <div className="mt-2 whitespace-pre-wrap text-white/80">
                  {variant?.promptEngine || "—"}
                </div>
              </div>

              <div>
                <div className="text-lg font-semibold">Hook</div>
                <div className="mt-2 text-white/80">
                  {variant?.hook || result.hookIdeas?.[0] || "—"}
                </div>
              </div>

              <div>
                <div className="text-lg font-semibold">Script</div>
                <div className="mt-2 whitespace-pre-wrap text-white/80">
                  {scriptText || result.raw || "—"}
                </div>
              </div>

              <div>
                <div className="text-lg font-semibold">Shotlist</div>
                <ul className="mt-2 space-y-1 text-white/80">
                  {(variant?.shotlist || []).map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-lg font-semibold">CTA</div>
                <div className="mt-2 text-white/80">
                  {variant?.cta?.primary || "—"}
                </div>
              </div>

              <div>
                <div className="text-lg font-semibold">Angles créatifs</div>
                <ul className="mt-2 space-y-1 text-white/80">
                  {(result.creativeAngles || []).map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-lg font-semibold">Stratégie plateforme</div>
                <div className="mt-2 whitespace-pre-wrap text-white/80">
                  {variant?.platformStrategy || "—"}
                </div>
              </div>

              <div>
                <div className="text-lg font-semibold">Angle psychologique</div>
                <div className="mt-2 whitespace-pre-wrap text-white/80">
                  {variant?.psychologicalAngle || "—"}
                </div>
              </div>

              <div>
                <div className="text-lg font-semibold">Direction créative</div>
                <div className="mt-2 whitespace-pre-wrap text-white/80">
                  {variant?.creativeDirection || "—"}
                </div>
              </div>

              <div>
                <div className="text-lg font-semibold">Plan de test</div>
                <div className="mt-2 whitespace-pre-wrap text-white/80">
                  {variant?.testingPlan || result.testingPlanSummary || "—"}
                </div>
              </div>

              <div>
                <div className="text-lg font-semibold">KPI</div>
                <div className="mt-2 text-white/80">{variant?.kpi || "—"}</div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
