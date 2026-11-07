"use client";

/**
 * One evidence timeline shared by video upload, URL and extension results.
 * Source labels intentionally distinguish sampled visual observations from
 * automatic speech recognition. Neither source measures viewer retention.
 */
export type VisualMoment = {
  frameIndex?: number;
  timestampSeconds?: number;
  timecode?: string;
  label?: string;
  observation?: string;
  evidence?: string;
};

export type SpeechMoment = { start: number; end: number; text: string };

type TimelineEvent = {
  at: number;
  order: number;
  kind: "visual" | "audio";
  title: string;
  description: string;
  end?: number;
};

type Props = {
  scenes?: VisualMoment[] | null;
  speech?: SpeechMoment[] | null;
  transcript?: string;
  currentSecond?: number;
  onSeek?: (second: number) => void;
};

export function parseVisualTimecode(value?: string): number | null {
  if (!value) return null;
  const parts = value.trim().split(":");
  if (parts.length !== 2 && parts.length !== 3) return null;
  if (!parts.every((part) => /^\d+(?:\.\d+)?$/.test(part))) return null;
  const numbers = parts.map(Number);
  if (numbers.some((n) => !Number.isFinite(n) || n < 0)) return null;
  if (parts.length === 2 && numbers[1] >= 60) return null;
  if (parts.length === 3 && (numbers[1] >= 60 || numbers[2] >= 60)) return null;
  const seconds = parts.length === 3
    ? numbers[0] * 3600 + numbers[1] * 60 + numbers[2]
    : numbers[0] * 60 + numbers[1];
  return Number.isFinite(seconds) ? seconds : null;
}

export function formatTimelineTime(value: number): string {
  const seconds = Math.max(0, Math.floor(value));
  const hh = Math.floor(seconds / 3600);
  const mm = Math.floor((seconds % 3600) / 60);
  const ss = seconds % 60;
  return hh > 0
    ? `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`
    : `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

export function toTimelineEvents(scenes?: VisualMoment[] | null, speech?: SpeechMoment[] | null): TimelineEvent[] {
  const entries: TimelineEvent[] = [];
  (scenes || []).forEach((scene, index) => {
    const at = typeof scene.timestampSeconds === "number" && Number.isFinite(scene.timestampSeconds) && scene.timestampSeconds >= 0
      ? scene.timestampSeconds : parseVisualTimecode(scene.timecode);
    if (at === null || at < 0 || !scene.observation?.trim()) return;
    entries.push({ at, order: index, kind: "visual", title: scene.label?.trim() || "Observation visuelle", description: scene.observation.trim() });
  });
  (speech || []).forEach((segment, index) => {
    if (!Number.isFinite(segment.start) || !Number.isFinite(segment.end) || segment.start < 0 || segment.end < segment.start || !segment.text?.trim()) return;
    entries.push({ at: segment.start, end: segment.end, order: index, kind: "audio", title: "Paroles transcrites", description: segment.text.trim() });
  });
  return entries.sort((a, b) => a.at - b.at || (a.kind === b.kind ? a.order - b.order : a.kind === "visual" ? -1 : 1));
}

export default function VideoIntelligenceTimeline({ scenes, speech, transcript, currentSecond, onSeek }: Props) {
  const entries = toTimelineEvents(scenes, speech);
  const hasSpeechWithoutTime = Boolean(transcript?.trim()) && !(speech || []).length;
  if (!entries.length && !hasSpeechWithoutTime) return null;

  return (
    <section className="rounded-2xl border border-violet-400/20 bg-black/20 p-4 text-white" aria-label="Timeline des preuves vidéo et audio">
      <h3 className="text-sm font-semibold text-white">Timeline des observations et des paroles</h3>
      <p className="mt-1 text-xs leading-5 text-white/50">
        Les scènes sont issues de captures IA échantillonnées. Les paroles proviennent d’une transcription automatique.
        {onSeek ? " Clique sur un événement pour avancer dans la vidéo." : " Aucun lecteur vidéo synchronisé n’est disponible pour cette source."}
      </p>
      {entries.length ? (
        <ol className="mt-3 max-h-[440px] space-y-2 overflow-y-auto pr-1">
          {entries.map((entry, i) => {
            const active = typeof currentSecond === "number" && (entry.kind === "audio"
              ? currentSecond >= entry.at && currentSecond <= (entry.end ?? entry.at)
              : Math.abs(currentSecond - entry.at) < 1.5);
            const className = `block w-full rounded-xl border p-3 text-left text-xs leading-5 ${active ? "border-violet-400/70 bg-violet-500/10" : "border-white/10 bg-white/[0.025]"} ${onSeek ? "transition hover:border-violet-400/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-300" : ""}`;
            const content = (
              <>
                <span className="font-mono text-violet-300">{formatTimelineTime(entry.at)}{entry.kind === "audio" && entry.end !== undefined ? `–${formatTimelineTime(entry.end)}` : ""}</span>
                <span className="ml-2 text-[10px] font-semibold text-white/45">{entry.kind === "audio" ? "TRANSCRIPTION AUTO" : "CAPTURE IA"}</span>
                <strong className="mt-1 block text-white/90">{entry.title}</strong>
                <span className="mt-1 block whitespace-pre-wrap text-white/70">{entry.description}</span>
              </>
            );
            return (
              <li key={`${entry.kind}-${entry.at}-${entry.order}-${i}`}>
                {onSeek
                  ? <button type="button" className={className} onClick={() => onSeek(entry.at)} aria-label={`Aller à ${formatTimelineTime(entry.at)} : ${entry.title}`}>{content}</button>
                  : <div className={className}>{content}</div>}
              </li>
            );
          })}
        </ol>
      ) : null}
      {hasSpeechWithoutTime ? (
        <p className="mt-3 rounded-lg border border-white/10 p-3 text-xs text-white/60">
          Transcription disponible, mais aucun horodatage fiable des paroles n’a été fourni. La timeline n’invente pas de repères temporels.
        </p>
      ) : null}
    </section>
  );
}
