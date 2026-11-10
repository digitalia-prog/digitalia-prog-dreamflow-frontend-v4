/** ADNIA — rattachement prudent des citations audio aux segments Whisper.
 * Aucune estimation de timecode : uniquement des extraits textuels présents
 * exactement dans une plage de segments réellement renvoyés par le worker.
 */
export type TimedSpeechSegment = { start: number; end: number; text: string };
export const normalizeEvidenceText = (text: string): string =>
  String(text || "").normalize("NFKC").toLowerCase()
    .replace(/[\p{P}\p{S}]+/gu, " ")
    .replace(/\s+/g, " ").trim();

function clock(seconds: number): string {
  const t = Math.max(0, Math.floor(seconds));
  const hrs = Math.floor(t / 3600);
  const mins = Math.floor((t % 3600) / 60);
  const secs = t % 60;
  return (hrs ? String(hrs).padStart(2, "0") + ":" : "") +
    String(mins).padStart(2, "0") + ":" + String(secs).padStart(2, "0");
}

export function findVerifiedAudioTimecode(
  excerpt: string, transcript: string, segments: TimedSpeechSegment[],
): string | null {
  const needle = normalizeEvidenceText(excerpt);
  if (needle.length < 8 || !normalizeEvidenceText(transcript).includes(needle)) return null;
  const valid = (Array.isArray(segments) ? segments : []).slice(0, 300).filter(s =>
    s && Number.isFinite(s.start) && Number.isFinite(s.end) &&
    s.start >= 0 && s.end >= s.start && typeof s.text === "string" && s.text.trim()
  );
  if (!valid.length) return null;
  const matches: Array<{ start: number; end: number; parts: number }> = [];
  // On accepte une citation couvrant jusqu'à 3 segments contigus, jamais une
  // phrase reconstruite à partir de passages éloignés dans l'enregistrement.
  for (let i = 0; i < valid.length; i++) {
    let combined = "";
    for (let j = i; j < Math.min(valid.length, i + 3); j++) {
      if (j > i && (valid[j].start - valid[j - 1].end) > 1.5) break;
      combined += (combined ? " " : "") + valid[j].text;
      if (normalizeEvidenceText(combined).includes(needle)) {
        matches.push({ start: valid[i].start, end: valid[j].end, parts: j - i + 1 });
        break;
      }
    }
  }
  if (!matches.length) return null;
  // Un segment individuel prime sur une plage plus large ; si la citation est
  // répétée à plusieurs endroits, on refuse de choisir un instant arbitraire.
  const minParts = Math.min(...matches.map(m => m.parts));
  const best = matches.filter(m => m.parts === minParts);
  if (best.length !== 1) return null;
  const item = best[0];
  return `${clock(item.start)}–${clock(Math.ceil(item.end))}`;
}
