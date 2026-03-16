"use client";

import { useState } from "react";

type AnalyzeResponse = {
  summary?: string;
  hook?: string;
  structure?: string;
  angle?: string;
  psychology?: string[];
  strengths?: string[];
  weaknesses?: string[];
  recreateIdeas?: string[];
  similarHooks?: string[];
  similarAngles?: string[];
  scriptPrompt?: string;
  error?: string;
  details?: string;
};

function cn(...v: (string | false | null | undefined)[]) {
  return v.filter(Boolean).join(" ");
}

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#14121c] p-5">
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

export default function AnalyzePage() {
  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-violet-500";
  const textareaCls = cn(inputCls, "min-h-[140px]");

  const [url, setUrl] = useState("");
  const [platform, setPlatform] = useState("TikTok");
  const [offer, setOffer] = useState("");
  const [audience, setAudience] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AnalyzeResponse | null>(null);

  async function onAnalyze() {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/analyze-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          platform,
          offer,
          audience,
          notes,
        }),
      });

      const data: AnalyzeResponse = await response.json();

      if (!response.ok) {
        throw new Error(data?.details || data?.error || "Analyse impossible");
      }

      setResult(data);
    } catch (e: any) {
      setError(String(e?.message ?? e ?? "Erreur inconnue"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0b0b12] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-2xl border border-white/10 bg-[#14121c] p-6">
          <h1 className="mb-2 text-3xl font-bold text-white">
            Analyse vidéo — Ads / UGC
          </h1>
          <p className="text-white/65">
            Colle un lien et le texte ou transcript d’une vidéo pour obtenir une
            analyse marketing claire et exploitable.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
          <div className="rounded-2xl border border-white/10 bg-[#14121c] p-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <div className="text-sm text-white/80">Lien vidéo</div>
                <input
                  className={inputCls}
                  placeholder="https://www.tiktok.com/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="text-sm text-white/80">Plateforme</div>
                <select
                  className={inputCls}
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                >
                  <option>TikTok</option>
                  <option>Instagram Reels</option>
                  <option>YouTube Shorts</option>
                  <option>Facebook Ads</option>
                  <option>Google Ads</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-white/80">
                  Offre / Produit (optionnel)
                </div>
                <input
                  className={inputCls}
                  placeholder="Ex : Coque MagSafe iPhone"
                  value={offer}
                  onChange={(e) => setOffer(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="text-sm text-white/80">
                  Audience cible (optionnel)
                </div>
                <input
                  className={inputCls}
                  placeholder="Ex : E-commerçants débutants"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="text-sm text-white/80">
                  Texte / transcript / description
                </div>
                <textarea
                  className={textareaCls}
                  placeholder="Colle ici le hook, le script parlé, la description ou le transcript de la vidéo."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <button
                onClick={onAnalyze}
                disabled={loading}
                className={cn(
                  "rounded-xl px-5 py-3 font-semibold text-white transition",
                  loading
                    ? "cursor-not-allowed bg-white/10 text-white/60"
                    : "bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-500 hover:to-fuchsia-400"
                )}
              >
                {loading ? "Analyse en cours..." : "Analyser la vidéo"}
              </button>

              {error ? <div className="text-sm text-red-400">{error}</div> : null}
            </div>
          </div>

          <div className="space-y-6">
            <Block title="Résumé">
              <div className="whitespace-pre-wrap text-sm text-white/85">
                {result?.summary || "-"}
              </div>
            </Block>

            <div className="grid gap-6 md:grid-cols-2">
              <Block title="Hook principal">
                <div className="text-sm text-white/85">{result?.hook || "-"}</div>
              </Block>

              <Block title="Structure">
                <div className="text-sm text-white/85">
                  {result?.structure || "-"}
                </div>
              </Block>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Block title="Angle marketing">
                <div className="text-sm text-white/85">{result?.angle || "-"}</div>
              </Block>

              <Block title="Psychologie utilisée">
                <ListBlock items={result?.psychology} />
              </Block>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Block title="Points forts">
                <ListBlock items={result?.strengths} />
              </Block>

              <Block title="Points faibles">
                <ListBlock items={result?.weaknesses} />
              </Block>
            </div>

            <Block title="Idées à reproduire">
              <ListBlock items={result?.recreateIdeas} />
            </Block>

            <div className="grid gap-6 md:grid-cols-2">
              <Block title="Hooks similaires">
                <ListBlock items={result?.similarHooks} />
              </Block>

              <Block title="Angles similaires">
                <ListBlock items={result?.similarAngles} />
              </Block>
            </div>

            <Block title="Brief pour recréer une vidéo similaire">
              <div className="whitespace-pre-wrap text-sm text-white/85">
                {result?.scriptPrompt || "-"}
              </div>
            </Block>
          </div>
        </div>
      </div>
    </main>
  );
}
