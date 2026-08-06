"use client";

export type AnalysisResult = {
  transcript?: string;
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
  viralScore?: string;
  whyItWorks?: string[];
  howToBeat?: string[];
  adsAngles?: string[];
  creativeType?: string;
};

type Props = {
  result: AnalysisResult;
  fallbackCreativeType?: string;
};

function Card({ title, items }: { title: string; items?: string[] }) {
  const values = items?.length ? items : ["Aucun élément disponible."];

  return (
    <article className="rounded-3xl border border-white/10 bg-[#151526] p-6">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <div className="mt-5 space-y-3">
        {values.map((item, index) => (
          <div
            key={`${title}-${index}`}
            className="rounded-2xl border border-white/10 bg-black/15 p-4"
          >
            <p className="text-sm leading-6 text-white/75">{item}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

export default function AnalysisResults({
  result,
  fallbackCreativeType,
}: Props) {
  return (
    <section className="mt-8 space-y-6">
      <div className="rounded-3xl border border-purple-400/20 bg-[#151526] p-6 md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-purple-400">
              Creative Intelligence
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white">
              Analyse complète de la publicité
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/55">
              Décryptage du hook, de la structure, de l’angle marketing et des
              mécanismes psychologiques.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/65">
              {result.creativeType || fallbackCreativeType || "Créatif"}
            </span>
            <span className="rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-3 py-1.5 text-xs font-semibold text-fuchsia-200">
              Score viral : {result.viralScore || "Non évalué"}
            </span>
          </div>
        </div>

        <div className="mt-7 grid gap-4 lg:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-black/15 p-5 lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-300">
              Résumé stratégique
            </p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/75">
              {result.summary || "Résumé non disponible."}
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-black/15 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fuchsia-300">
              Hook
            </p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/75">
              {result.hook || "Hook non détecté."}
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-black/15 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-300">
              Angle marketing
            </p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/75">
              {result.angle || "Angle non détecté."}
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-black/15 p-5 lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
              Structure de la publicité
            </p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/75">
              {result.structure || "Structure non détectée."}
            </p>
          </article>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Analyse psychologique" items={result.psychology} />
        <Card
          title="Pourquoi cette publicité fonctionne"
          items={result.whyItWorks}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Forces" items={result.strengths} />
        <Card title="Faiblesses" items={result.weaknesses} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Idées à reproduire" items={result.recreateIdeas} />
        <Card title="Hooks similaires" items={result.similarHooks} />
        <Card title="Angles similaires" items={result.similarAngles} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Comment faire mieux" items={result.howToBeat} />
        <Card
          title="Nouveaux angles publicitaires"
          items={result.adsAngles}
        />
      </div>

      <article className="rounded-3xl border border-purple-400/20 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/[0.06] p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-300">
          Prompt de script
        </p>
        <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="whitespace-pre-wrap text-sm leading-7 text-white/75">
            {result.scriptPrompt || "Aucun prompt de script disponible."}
          </p>
        </div>
      </article>

      {result.transcript ? (
        <article className="rounded-3xl border border-white/10 bg-[#151526] p-6">
          <h3 className="text-lg font-semibold text-white">
            Transcription détectée
          </h3>
          <div className="mt-5 max-h-96 overflow-y-auto rounded-2xl border border-white/10 bg-black/15 p-5">
            <p className="whitespace-pre-wrap text-sm leading-7 text-white/65">
              {result.transcript}
            </p>
          </div>
        </article>
      ) : null}
    </section>
  );
}
