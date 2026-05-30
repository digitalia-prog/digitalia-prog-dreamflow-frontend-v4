"use client";

import { useState } from "react";

type TextItem =
  | string
  | {
      heading?: string;
      title?: string;
      content?: string;
      text?: string;
      description?: string;
    };

type MediaResult = {
  source?: string;
  transcript?: string;
  cleanedTranscript?: string;

  coreMessage?: string;
  whyItMatters?: string;
  founderNarrative?: string;
  executiveSummary?: string;

  strongIdeas?: TextItem[];
  mediaHeadlines?: TextItem[];
  keyQuotes?: TextItem[];
  prAngles?: TextItem[];
  strategicOpportunities?: TextItem[];
  missingInformation?: TextItem[];

  editorialStructure?: {
    title?: string;
    subtitle?: string;
    sections?: TextItem[];
  };

  mediaKit?: {
    companyDescription?: string;
    mission?: string;
    vision?: string;
    positioning?: string;
  };

  mediaArticle?: string;
  founderInterview?: string;
  mediaBrochure?: string;
  linkedinPost?: string;
  shortExtracts?: TextItem[];
};

function formatItem(item: TextItem) {
  if (typeof item === "string") return item;

  const title = item.heading || item.title || "";
  const body = item.content || item.text || item.description || "";

  if (title && body) return `${title}\n${body}`;
  if (title) return title;
  if (body) return body;

  return JSON.stringify(item, null, 2);
}

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
        throw new Error(
          data?.details || data?.error || "Erreur API Media Engine"
        );
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
            intelligence média : message central, récit founder, titres presse,
            angles PR, article, brochure, LinkedIn et extraits courts.
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
                placeholder="Ajoute le contexte : nom de la société, qui parle, objectif, ton souhaité, angle média..."
                className="mt-3 min-h-[150px] w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-violet-400"
              />
            </>
          )}

          <div className="mt-5 flex items-center justify-between gap-4">
            <p className="text-xs text-white/40">
              {mode === "text"
                ? "Flux texte : OpenAI direct."
                : "Flux audio/vidéo : Whisper OpenAI → transcript → Founder Intelligence."}
            </p>

            <button
              onClick={handleGenerate}
              disabled={loading || (!notes.trim() && !file)}
              className="rounded-2xl bg-violet-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Génération..." : "Générer le rapport média"}
            </button>
          </div>
        </section>

        {result && (
          <section className="mt-8 grid gap-5">
            <div className="rounded-3xl border border-violet-400/20 bg-violet-500/10 p-6">
              <p className="text-xs uppercase tracking-[0.25em] text-violet-200">
                Founder Intelligence Report
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                Synthèse stratégique
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/60">
                Cette section extrait la valeur stratégique de l’interview :
                message central, narration founder, angles média et opportunités
                de positionnement.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <ResultBlock
                title="Core Message"
                content={result.coreMessage}
                highlight
              />

              <ResultBlock
                title="Pourquoi c'est important"
                content={result.whyItMatters}
                highlight
              />
            </div>

            <ResultBlock
              title="Founder Narrative"
              content={result.founderNarrative}
              highlight
            />

            <ResultBlock
              title="Executive Summary"
              content={result.executiveSummary}
              highlight
            />

            <div className="grid gap-5 md:grid-cols-2">
              <ResultList title="Media Headlines" items={result.mediaHeadlines} />
              <ResultList title="Key Quotes" items={result.keyQuotes} />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <ResultList title="PR Angles" items={result.prAngles} />
              <ResultList
                title="Strategic Opportunities"
                items={result.strategicOpportunities}
              />
            </div>

            <MediaKitBlock mediaKit={result.mediaKit} />

            <EditorialStructureBlock
              editorialStructure={result.editorialStructure}
            />

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-xs uppercase tracking-[0.25em] text-white/40">
                Production Content
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                Contenus générés
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/60">
                Ces contenus sont prêts à être retravaillés, validés, publiés ou
                adaptés en page média.
              </p>
            </div>

            <ResultBlock title="Article média" content={result.mediaArticle} />
            <ResultBlock
              title="Interview founder"
              content={result.founderInterview}
            />
            <ResultBlock title="Brochure média" content={result.mediaBrochure} />
            <ResultBlock title="Post LinkedIn" content={result.linkedinPost} />

            <div className="grid gap-5 md:grid-cols-2">
              <ResultList title="Idées fortes" items={result.strongIdeas} />
              <ResultList title="Extraits courts" items={result.shortExtracts} />
            </div>

            <ResultList
              title="Informations manquantes"
              items={result.missingInformation}
            />

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-xs uppercase tracking-[0.25em] text-white/40">
                Source
              </p>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <ResultBlock
                  title="Transcript source"
                  content={result.transcript}
                />
                <ResultBlock
                  title="Transcript nettoyé"
                  content={result.cleanedTranscript}
                />
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function ResultBlock({
  title,
  content,
  highlight = false,
}: {
  title: string;
  content?: string;
  highlight?: boolean;
}) {
  if (!content) return null;

  return (
    <div
      className={`rounded-3xl border p-6 ${
        highlight
          ? "border-violet-400/20 bg-violet-500/10"
          : "border-white/10 bg-white/[0.03]"
      }`}
    >
      <h2 className="mb-3 text-xl font-semibold text-violet-200">{title}</h2>
      <p className="whitespace-pre-wrap text-sm leading-7 text-white/70">
        {content}
      </p>
    </div>
  );
}

function ResultList({ title, items }: { title: string; items?: TextItem[] }) {
  if (!items?.length) return null;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <h2 className="mb-3 text-xl font-semibold text-violet-200">{title}</h2>
      <ul className="space-y-3 text-sm text-white/70">
        {items.map((item, index) => (
          <li
            key={index}
            className="whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/20 p-3 leading-6"
          >
            {formatItem(item)}
          </li>
        ))}
      </ul>
    </div>
  );
}

function MediaKitBlock({
  mediaKit,
}: {
  mediaKit?: {
    companyDescription?: string;
    mission?: string;
    vision?: string;
    positioning?: string;
  };
}) {
  if (
    !mediaKit?.companyDescription &&
    !mediaKit?.mission &&
    !mediaKit?.vision &&
    !mediaKit?.positioning
  ) {
    return null;
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <h2 className="mb-5 text-xl font-semibold text-violet-200">Media Kit</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <MiniBlock title="Description" content={mediaKit.companyDescription} />
        <MiniBlock title="Mission" content={mediaKit.mission} />
        <MiniBlock title="Vision" content={mediaKit.vision} />
        <MiniBlock title="Positionnement" content={mediaKit.positioning} />
      </div>
    </div>
  );
}

function EditorialStructureBlock({
  editorialStructure,
}: {
  editorialStructure?: {
    title?: string;
    subtitle?: string;
    sections?: TextItem[];
  };
}) {
  if (
    !editorialStructure?.title &&
    !editorialStructure?.subtitle &&
    !editorialStructure?.sections?.length
  ) {
    return null;
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <h2 className="mb-5 text-xl font-semibold text-violet-200">
        Structure éditoriale
      </h2>

      <div className="space-y-4">
        <MiniBlock title="Titre" content={editorialStructure.title} />
        <MiniBlock title="Sous-titre" content={editorialStructure.subtitle} />

        {!!editorialStructure.sections?.length && (
          <div>
            <p className="mb-2 text-sm font-semibold text-white/80">
              Sections
            </p>
            <ul className="space-y-2 text-sm text-white/70">
              {editorialStructure.sections.map((section, index) => (
                <li
                  key={index}
                  className="whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/20 p-3 leading-6"
                >
                  {formatItem(section)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function MiniBlock({
  title,
  content,
}: {
  title: string;
  content?: string;
}) {
  if (!content) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-white/40">
        {title}
      </p>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-white/70">
        {content}
      </p>
    </div>
  );
}
