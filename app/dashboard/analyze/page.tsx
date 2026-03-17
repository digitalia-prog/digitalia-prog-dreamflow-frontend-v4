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
  const [scriptLoading, setScriptLoading] = useState(false);
  const [error, setError] = useState("");
  const [scriptError, setScriptError] = useState("");
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [script, setScript] = useState<string>("");

  async function onAnalyze() {
    setLoading(true);
    setError("");
    setResult(null);
    setScript("");
    setScriptError("");

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

  async function generateScript() {
    if (!result) return;

    setScriptLoading(true);
    setScriptError("");
    setScript("");

    try {
      const response = await fetch("/api/generate-script", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          analysis: result,
          platform,
          offer,
          audience,
          notes,
          url,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.details || data?.error || "Génération impossible");
      }

      setScript(data?.script || "");
    } catch (e: any) {
      setScriptError(String(e?.message ?? e ?? "Erreur inconnue"));
    } finally {
      setScriptLoading(false);
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

        <div className="flex flex-wrap items-center gap-4">
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

          {result && (
            <button
              onClick={generateScript}
              disabled={scriptLoading}
              className={cn(
                "px-6 py-3 rounded-xl font-semibold",
                scriptLoading
                  ? "bg-white/10 text-white/50"
                  : "bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
              )}
            >
              {scriptLoading
                ? "Génération du script..."
                : "Générer un script avec cette analyse 🚀"}
            </button>
          )}
        </div>

        {error && <div className="text-red-400">{error}</div>}
        {scriptError && <div className="text-red-400">{scriptError}</div>}

        {result && (
          <div className="mt-2 grid gap-6 md:grid-cols-2">
            <Block title="Résumé">{result.summary || "-"}</Block>
            <Block title="Hook">{result.hook || "-"}</Block>
            <Block title="Structure">{result.structure || "-"}</Block>
            <Block title="Angle">{result.angle || "-"}</Block>

            <Block title="Psychologie">
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

            <Block title="Hooks à tester">
              <ListBlock items={result.similarHooks} />
            </Block>

            <Block title="Angles à tester">
              <ListBlock items={result.similarAngles} />
            </Block>

            <div className="md:col-span-2">
              <Block title="Concept vidéo prêt à tourner">
                <div className="whitespace-pre-wrap text-sm text-white/85">
                  {result.scriptPrompt || "-"}
                </div>
              </Block>
            </div>
          </div>
        )}

        {script && (
          <div className="mt-4">
            <Block title="Script prêt à tourner 🎬">
              <div className="whitespace-pre-wrap text-sm text-white/90">
                {script}
              </div>
            </Block>
          </div>
        )}
      </div>
    </main>
  );
}
