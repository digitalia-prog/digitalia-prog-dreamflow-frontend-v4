"use client";

import { useState } from "react";

type MediaResult = {
  source?: string;
  transcript?: string;
  cleanedTranscript?: string;
  strongIdeas?: string[];
  editorialStructure?: {
    title?: string;
    sections?: string[];
  };
  mediaArticle?: string;
  founderInterview?: string;
  mediaBrochure?: string;
  linkedinPost?: string;
  shortExtracts?: string[];
};

export default function MediaPage() {
  const [mode, setMode] = useState<"text" | "upload">("text");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<MediaResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    if (!notes.trim() && !file) return;

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("notes", notes);
    if (file) formData.append("file", file);

    try {
      const res = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.details || data?.error || "Erreur API Media Engine");
      }

      setResult(data);
    } catch (error: any) {
      console.error(error);
      alert(error?.message || "Erreur pendant la génération média.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#070711] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-violet-300">
            UGC Growth · Media Intelligence
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            Founder & Media Engine
          </h1>
          <p className="mt-4 max-w-3xl text-white/60">
            Transforme des notes, une interview audio ou une vidéo founder en
            article média, interview, brochure, post LinkedIn et extraits courts.
          </p>
        </div>

        <div className="mb-6 flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-2">
          <button
            onClick={() => setMode("text")}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition ${
              mode === "text"
                ? "bg-violet-500 text-white"
                : "text-white/50 hover:bg-white/5"
            }`}
          >
            Texte / Notes founder
          </button>

          <button
            onClick={() => setMode("upload")}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition ${
              mode === "upload"
                ? "bg-violet-500 text-white"
                : "text-white/50 hover:bg-white/5"
            }`}
          >
            Audio / Vidéo interview
          </button>
        </div>

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-violet-950/30">
          {mode === "text" ? (
            <>
              <label className="text-sm font-medium text-white/80">
                Notes texte / interview brute
              </label>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Colle ici une interview, une idée brute, une note founder, un brief média..."
                className="mt-3 min-h-[260px] w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-violet-400"
              />
            </>
          ) : (
            <>
              <label className="text-sm font-medium text-white/80">
                Upload audio / vidéo
              </label>

              <div className="mt-3 rounded-2xl border border-dashed border-violet-400/40 bg-black/30 p-6">
                <input
                  type="file"
                  accept="audio/*,video/*,.mp3,.wav,.m4a,.mp4,.mov,.webm,.ogg"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-white/70 file:mr-4 file:rounded-xl file:border-0 file:bg-violet-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-violet-400"
                />

                {file && (
                  <p className="mt-3 text-xs text-violet-200">
                    Fichier sélectionné : {file.name}
                  </p>
                )}
              </div>

              <label className="mt-5 block text-sm font-medium text-white/80">
                Notes complémentaires optionnelles
              </label>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ajoute le contexte : qui parle, objectif, ton souhaité, angle média..."
                className="mt-3 min-h-[150px] w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-violet-400"
              />
            </>
          )}

          <div className="mt-5 flex items-center justify-between gap-4">
            <p className="text-xs text-white/40">
              {mode === "text"
                ? "Flux texte : OpenAI direct."
                : "Flux audio/vidéo : worker existant → transcript → Media Engine."}
            </p>

            <button
              onClick={handleGenerate}
              disabled={loading || (!notes.trim() && !file)}
              className="rounded-2xl bg-violet-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Génération..." : "Générer le contenu média"}
            </button>
          </div>
        </section>

        {result && (
          <section className="mt-8 grid gap-5">
            <ResultBlock title="Transcript source" content={result.transcript} />
            <ResultBlock title="Transcript nettoyé" content={result.cleanedTranscript} />
            <ResultList title="Idées fortes" items={result.strongIdeas} />
            <ResultBlock title="Article média" content={result.mediaArticle} />
            <ResultBlock title="Interview founder" content={result.founderInterview} />
            <ResultBlock title="Brochure média" content={result.mediaBrochure} />
            <ResultBlock title="Post LinkedIn" content={result.linkedinPost} />
            <ResultList title="Extraits courts" items={result.shortExtracts} />
          </section>
        )}
      </div>
    </main>
  );
}

function ResultBlock({ title, content }: { title: string; content?: string }) {
  if (!content) return null;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <h2 className="mb-3 text-xl font-semibold text-violet-200">{title}</h2>
      <p className="whitespace-pre-wrap text-sm leading-7 text-white/70">
        {content}
      </p>
    </div>
  );
}

function ResultList({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <h2 className="mb-3 text-xl font-semibold text-violet-200">{title}</h2>
      <ul className="list-disc space-y-2 pl-5 text-sm text-white/70">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
