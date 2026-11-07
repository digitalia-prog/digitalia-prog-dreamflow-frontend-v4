"use client";

import VideoIntelligenceTimeline from "@/components/VideoIntelligenceTimeline";

export type AnalysisResult = {
  transcript?: string;
  transcriptSegments?: Array<{start:number;end:number;text:string}>;
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
  sourceEvidence?: {
    websiteMentions?: string[];
    descriptionCtas?: string[];
    sourceLabel?: "description";
  };
  visualAnalysisAvailable?: boolean;
  visualAnalysisNote?: string;
  durationSeconds?: number;
  frameCount?: number;
  visualTimeline?: Array<{
    frameIndex: number;
    timestampSeconds: number;
    timecode: string;
    label: string;
    observation: string;
    assessment: "strong" | "medium" | "weak" | "neutral";
    attentionRisk: "low" | "medium" | "high" | "unknown";
    evidence: "observed" | "estimated";
  }>;
  visualHook?: {
    observation?: string;
    assessment?: string;
    evidence?: string;
  };
  pacing?: {
    observation?: string;
    assessment?: string;
    evidence?: string;
  };
  proofAnalysis?: {
    status?: "observed" | "not_observed" | "unknown";
    observation?: string;
    evidenceSource?: "visual" | "audio" | "imported" | "none";
  };
  ctaAnalysis?: {
    status?: "explicit" | "implicit" | "absent" | "unknown";
    text?: string;
    timecode?: string;
    evidenceSource?: "visual" | "audio" | "imported" | "none";
    explanation?: string;
  };
  onScreenText?: string[];
  priorityFixes?: Array<{
    priority: number;
    diagnosis: string;
    evidence: string;
    action: string;
    test: string;
  }>;
  dataIntegrity?: {
    observed?: string[];
    estimated?: string[];
    imported?: string[];
    unavailableMetrics?: string[];
  };
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
              Diagnostic créatif · données disponibles
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/55">
              Analyse du transcript, du contexte transmis par l’extension et, si
              disponibles, des images réellement décodées.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/65">
              {result.creativeType || fallbackCreativeType || "Créatif"}
            </span>

          </div>
        </div>

        {(result.sourceEvidence?.websiteMentions?.length || result.sourceEvidence?.descriptionCtas?.length) ? (
          <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-500/[0.06] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
              Preuves issues de la description · non vérifiées dans la vidéo
            </p>
            {result.sourceEvidence?.websiteMentions?.length ? (
              <p className="mt-2 text-sm leading-6 text-white/70">
                Site(s) cité(s) : {result.sourceEvidence.websiteMentions.join(" · ")}. Cela ne confirme pas l'identité de l'annonceur.
              </p>
            ) : null}
            {result.sourceEvidence?.descriptionCtas?.length ? (
              <p className="mt-2 text-sm leading-6 text-white/70">
                CTA écrit(s) : {result.sourceEvidence.descriptionCtas.join(" · ")}. Leur présence à l'écran ou à l'oral n'a pas été démontrée.
              </p>
            ) : null}
          </div>
        ) : null}

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

      {(result.visualTimeline?.length || result.transcriptSegments?.length || result.transcript) ? (
        <VideoIntelligenceTimeline scenes={result.visualTimeline} speech={result.transcriptSegments} transcript={result.transcript} />
      ) : null}

      <article className="rounded-3xl border border-cyan-400/20 bg-[#121826] p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Creative Debugger · Analyse visuelle
            </p>
            <h3 className="mt-2 text-xl font-bold text-white">
              Ce que la vidéo montre réellement
            </h3>
          </div>
          <span className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
            result.visualAnalysisAvailable
              ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-200"
              : "border-amber-400/20 bg-amber-500/10 text-amber-200"
          }`}>
            {result.visualAnalysisAvailable ? "Captures réelles analysées" : "Visuel indisponible : analyse textuelle"}
          </span>
        </div>

        <p className="mt-4 text-sm leading-6 text-white/60">
          {result.visualAnalysisNote ||
            "L’analyse distingue les observations réelles, les estimations créatives et les données importées."}
        </p>

        {result.visualAnalysisAvailable && result.visualTimeline?.length ? (
          <p className="mt-4 text-xs text-white/50">Les scènes horodatées sont regroupées dans la timeline des preuves ci-dessus.</p>
        ) : null}

        {result.visualAnalysisAvailable ? (
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40">Hook visuel</p>
              <p className="mt-2 text-sm leading-6 text-white/70">
                {result.visualHook?.observation || "Non déterminable."}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40">Rythme</p>
              <p className="mt-2 text-sm leading-6 text-white/70">
                {result.pacing?.observation || "Non déterminable."}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40">CTA vérifié</p>
              <p className="mt-2 text-sm leading-6 text-white/70">
                {result.ctaAnalysis?.status || "unknown"}
                {result.ctaAnalysis?.text ? ` · ${result.ctaAnalysis.text}` : ""}
              </p>
              <p className="mt-2 text-xs leading-5 text-white/45">
                Source : {result.ctaAnalysis?.evidenceSource || "none"}
                {result.ctaAnalysis?.timecode ? ` · ${result.ctaAnalysis.timecode}` : ""}
              </p>
            </div>
          </div>
        ) : null}
      </article>

      {result.priorityFixes?.length ? (
        <article className="rounded-3xl border border-fuchsia-400/20 bg-[#151526] p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-300">
            3 corrections prioritaires
          </p>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {result.priorityFixes.map((fix) => (
              <div key={fix.priority} className="rounded-2xl border border-white/10 bg-black/15 p-5">
                <p className="text-xs font-semibold text-fuchsia-200">Priorité {fix.priority}</p>
                <p className="mt-2 text-sm font-semibold text-white">{fix.diagnosis}</p>
                <p className="mt-2 text-sm leading-6 text-white/60">{fix.evidence}</p>
                <p className="mt-3 text-sm leading-6 text-white/75">À faire : {fix.action}</p>
                {fix.test ? (
                  <p className="mt-2 text-xs leading-5 text-cyan-200/75">Test : {fix.test}</p>
                ) : null}
              </div>
            ))}
          </div>
        </article>
      ) : null}

      {result.dataIntegrity ? (
        <article className="rounded-3xl border border-white/10 bg-[#11111B] p-6">
          <h3 className="text-lg font-semibold text-white">Transparence des données</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-emerald-400/10 bg-emerald-500/[0.04] p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-200">Observé / importé</p>
              <p className="mt-2 text-sm leading-6 text-white/60">
                {[...(result.dataIntegrity.observed || []), ...(result.dataIntegrity.imported || [])]
                  .filter(Boolean)
                  .join(" · ") || "Aucune donnée disponible."}
              </p>
            </div>
            <div className="rounded-2xl border border-amber-400/10 bg-amber-500/[0.04] p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-200">Estimé / non disponible</p>
              <p className="mt-2 text-sm leading-6 text-white/60">
                {[...(result.dataIntegrity.estimated || []), ...(result.dataIntegrity.unavailableMetrics || [])]
                  .filter(Boolean)
                  .join(" · ") || "Aucune estimation."}
              </p>
            </div>
          </div>
        </article>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Analyse psychologique" items={result.psychology} />
        <Card
          title="Hypothèses créatives · performance non mesurée"
          items={result.whyItWorks}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Forces" items={result.strengths} />
        <Card title="Faiblesses" items={result.weaknesses} />
      </div>

      <details className="rounded-3xl border border-white/10 bg-[#151526] p-5 md:p-6">
        <summary className="cursor-pointer text-sm font-semibold text-violet-200">Pistes créatives complémentaires : hooks, angles et brief de script</summary>
        <div className="mt-5 space-y-5">
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

        </div>
      </details>

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
