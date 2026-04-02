"use client";

import React, { useState } from "react";

type Lang = "FR" | "EN" | "ES" | "AR" | "ZH";

type GenerateResponse = {
  hookIdeas?: string[];
  creativeAngles?: string[];
  variants?: Array<{
    script?: {
      aida?: {
        attention?: string;
        interest?: string;
        desire?: string;
        action?: string;
      };
    };
    shotlist?: string[];
    cta?: {
      primary?: string;
      optimized?: string;
    };
  }>;
  raw?: string;
};

export default function CreatorEnginePage() {
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [platform, setPlatform] = useState("TikTok");
  const [lang, setLang] = useState<Lang>("FR");
  const [brief, setBrief] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [error, setError] = useState("");

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
          product,
          audience,
          platform,
          lang,
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
            <input
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="Produit"
              className="rounded-xl border border-white/10 bg-black/20 px-4 py-3"
            />

            <input
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="Audience"
              className="rounded-xl border border-white/10 bg-black/20 px-4 py-3"
            />

            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="rounded-xl border border-white/10 bg-black/20 px-4 py-3"
            >
              <option value="TikTok">TikTok</option>
              <option value="Instagram">Instagram</option>
              <option value="YouTube">YouTube</option>
            </select>

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

            <textarea
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              placeholder="Brief / angle / objectif"
              rows={5}
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
                <div className="text-lg font-semibold">Hook</div>
                <div className="mt-2 text-white/80">
                  {result.hookIdeas?.[0] || "—"}
                </div>
              </div>

              <div>
                <div className="text-lg font-semibold">Script</div>
                <div className="mt-2 whitespace-pre-wrap text-white/80">
                  {result.variants?.[0]?.script?.aida?.attention ||
                    result.raw ||
                    "—"}
                </div>
              </div>

              <div>
                <div className="text-lg font-semibold">Shotlist</div>
                <ul className="mt-2 space-y-1 text-white/80">
                  {(result.variants?.[0]?.shotlist || []).map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-lg font-semibold">CTA</div>
                <div className="mt-2 text-white/80">
                  {result.variants?.[0]?.cta?.primary || "—"}
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
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
