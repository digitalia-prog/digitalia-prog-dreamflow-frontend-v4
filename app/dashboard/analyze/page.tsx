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
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-8">

        <div className="rounded-2xl border border-white/10 bg-[#14121c] p-6">
          <h1 className="text-3xl font-bold mb-2">
            Analyse vidéo — Ads / UGC
          </h1>

          <p className="text-white/60">
            Analyse une publicité TikTok / Reels / Ads à partir d’un lien ou d’un transcript.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">

          <Block title="Lien vidéo">
            <input
              className={inputCls}
              placeholder="https://www.tiktok.com/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </Block>

          <Block title="Plateforme">
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
            </select>
          </Block>

          <Block title="Produit / Offre (optionnel)">
            <input
              className={inputCls}
              value={offer}
              onChange={(e) => setOffer(e.target.value)}
              placeholder="Ex: Aspirateur sans fil"
            />
          </Block>

          <Block title="Audience (optionnel)">
            <input
              className={inputCls}
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="Ex: Familles pressées"
            />
          </Block>

        </div>

        <Block title="Transcript / description de la vidéo">
          <textarea
            className={textareaCls}
            placeholder="Colle le script ou la description de la pub ici"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Block>

        <button
          onClick={onAnalyze}
          disabled={loading}
          className={cn(
            "px-6 py-3 rounded-xl font-semibold",
            loading
              ? "bg-white/10 text-white/50"
              : "bg-violet-600 hover:bg-violet-500"
          )}
        >
          {loading ? "Analyse..." : "Analyser la vidéo"}
        </button>

        {error && (
          <div className="text-red-400">{error}</div>
        )}

        {result && (
          <div className="space-y-6">

            <Block title="Résumé">
              {result.summary || "-"}
            </Block>

            <Block title="Hook principal">
              {result.hook || "-"}
            </Block>

            <Block title="Structure">
              {result.structure || "-"}
            </Block>

            <Block title="Angle marketing">
              {result.angle || "-"}
            </Block>

            <Block title="Psychologie utilisée">
              <ListBlock items={result.psychology} />
            </Block>

            <Block title="Points forts">
              <ListBlock items={result.strengths} />
            </Block>

            <Block title="Points faibles">
              <ListBlock items={result.weaknesses} />
            </Block>

            <Block title="Idées à reproduire">
              <ListBlock items={result.recreateIdeas} />
            </Block>

            <Block title="Hooks similaires">
              <ListBlock items={result.similarHooks} />
            </Block>

            <Block title="Angles similaires">
              <ListBlock items={result.similarAngles} />
            </Block>

            <Block title="Prompt pour recréer une vidéo">
              {result.scriptPrompt || "-"}
            </Block>

          </div>
        )}
      </div>
    </main>
  );
}
