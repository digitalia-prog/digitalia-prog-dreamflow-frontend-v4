"use client";

/** Data coverage is explicit: analysis of an accessible transcript is not a video analysis. */
export type VideoCoverage = {
  transcript?: string;
  visualAnalysisAvailable?: boolean;
  visualTimeline?: Array<unknown>;
  visualAnalysisNote?: string;
  videoIntelligenceV16?: {
    durationSeconds?: number;
    coverageSeconds?: number;
    samples?: Array<{ second: number; changePercent: number | null }>;
  } | null;
  transcriptSegments?: Array<unknown>;
};

type Props = {
  result: VideoCoverage;
  input: "file" | "url" | "extension" | "audio";
  hasLocalPlayer?: boolean;
  platform?: string;
};

export default function VideoIntelligenceCoverage({ result, input, hasLocalPlayer = false, platform = "" }: Props) {
  const hasTranscript = Boolean(result.transcript?.trim());
  const hasVisual = result.visualAnalysisAvailable === true;
  const hasTechnicalData = Boolean(result.videoIntelligenceV16?.samples?.length);
  const hasScenes = hasVisual && Boolean(result.visualTimeline?.length);
  const videoBlocked = !hasVisual && (input === "url" || input === "extension");
  const data = [
    { label: "Paroles / transcript", available: hasTranscript, detail: hasTranscript ? "Transcription récupérée" : "Non disponible" },
    { label: "Images interprétées par IA", available: hasVisual, detail: hasScenes ? `${result.visualTimeline?.length} observations horodatées` : hasVisual ? "Analyse visuelle accessible" : "Non disponible" },
    { label: "Data vidéo (variation à 1 Hz)", available: hasTechnicalData, detail: hasTechnicalData ? `${result.videoIntelligenceV16?.coverageSeconds ?? 0} s analysées techniquement` : "Non mesurée sur cette source" },
    { label: "Lecteur synchronisé", available: hasLocalPlayer, detail: hasLocalPlayer ? "Fichier ouvert dans le navigateur" : "Fichier vidéo non accessible localement" },
    { label: "CTR, ROAS, rétention réelle", available: false, detail: "Aucune connexion au compte publicitaire" },
  ];

  return (
    <section className="rounded-3xl border border-violet-400/25 bg-[#151526] p-5 text-white md:p-7" aria-label="État des données Video Intelligence">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">Video Intelligence · État des données</p>
          <h3 className="mt-2 text-lg font-bold">Ce qui a réellement été analysé</h3>
        </div>
        <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/75">
          {input === "file" ? "Fichier importé" : input === "extension" ? "Extension" : input === "audio" ? "Fichier audio" : "Lien URL"}
        </span>
      </div>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {data.map((item) => (
          <div key={item.label} className="rounded-xl border border-white/10 bg-black/20 p-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className={item.available ? "text-emerald-300" : "text-amber-300"} aria-hidden="true">{item.available ? "✓" : "—"}</span>
              {item.label}
            </div>
            <p className="mt-1 text-xs leading-5 text-white/55">{item.detail}</p>
          </div>
        ))}
      </div>
      {videoBlocked ? (
        <div className="mt-4 rounded-xl border border-amber-400/25 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100">
          <p className="font-semibold">Analyse partielle : images et données techniques indisponibles</p>
          <p className="mt-1 text-amber-100/75">
            {platform.toLowerCase().includes("youtube") && /youtube|429|anti-bot/i.test(result.visualAnalysisNote || "")
              ? "YouTube a empêché la récupération automatique du fichier vidéo. L'extension a transmis le lien et le contexte, pas les images exploitables par Railway."
              : "Le fichier vidéo n'a pas pu être récupéré pour l'analyse visuelle."}
          </p>
          <p className="mt-2 text-amber-100/75">Pour obtenir le lecteur, la timeline et les mesures à 1 Hz, importe un fichier vidéo que tu peux utiliser.</p>
          <a href="/dashboard/analyze-upload?mode=video" className="mt-3 inline-flex rounded-lg bg-violet-600 px-4 py-2 font-semibold text-white hover:bg-violet-500">
            Importer un fichier vidéo
          </a>
        </div>
      ) : null}
      <p className="mt-4 text-xs leading-5 text-white/45">
        Les données à 1 Hz mesurent des variations de pixels, pas une rétention de spectateurs. Les scènes IA restent échantillonnées.
        Aucune performance réelle n'est inventée.
      </p>
    </section>
  );
}
