"use client";

import { useMemo, useState } from "react";
import {
  groupRows, parseDelimited, rowsFromMapping, suggestColumns,
  type AdGroup, type AdRow, type ColumnMap, type Key,
} from "@/lib/adniaAdsData";

const fields: Array<{ key: Key; label: string; required?: boolean }> = [
  { key: "campaign", label: "Campagne" },
  { key: "ad", label: "Nom de la publicité" },
  { key: "adId", label: "Identifiant de la publicité" },
  { key: "spend", label: "Dépenses", required: true },
  { key: "impressions", label: "Impressions", required: true },
  { key: "clicks", label: "Clics", required: true },
  { key: "conversions", label: "Conversions" },
  { key: "revenue", label: "CA attribué / valeur de conversion" },
];
const number = (n: number | null, digits = 0) => n === null ? "N/D" : new Intl.NumberFormat("fr-FR", { maximumFractionDigits: digits }).format(n);
const percent = (n: number | null) => n === null ? "N/D" : `${number(n, 2)} %`;
const money = (n: number | null, currency: string) => n === null ? "N/D" : new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(n);

/** Show real per-ad metrics immediately ABOVE the analysed media. Never infer video identity from filename. */
export default function AdPerformanceForVideo({ videoName }: { videoName: string }) {
  const [source, setSource] = useState<{headers:string[];rows:Record<string,string>[]} | null>(null);
  const [mapping, setMapping] = useState<ColumnMap>({} as ColumnMap);
  const [data, setData] = useState<AdRow[]>([]);
  const [chosenId, setChosenId] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");
  const [rejected, setRejected] = useState(0);
  const [filename, setFilename] = useState("");
  const [platform, setPlatform] = useState("Meta Ads");
  const [currency, setCurrency] = useState("EUR");
  const [period, setPeriod] = useState("");
  const [clickType, setClickType] = useState("Clics sur lien/destination");
  const [expanded, setExpanded] = useState(false);
  const groups = useMemo(() => groupRows(data), [data]);
  const selected: AdGroup | undefined = groups.find(g => g.id === chosenId);
  const real = confirmed ? selected : undefined;

  const resetLink = () => { setChosenId(""); setConfirmed(false); };
  async function upload(file?: File) {
    setError(""); setData([]); setSource(null); resetLink();
    if (!file) { setFilename(""); return; }
    if (file.size > 10_000_000) { setError("Le fichier dépasse 10 Mo."); return; }
    try {
      const parsed = parseDelimited(await file.text());
      setSource(parsed); setMapping(suggestColumns(parsed.headers)); setFilename(file.name);
    } catch (e) { setError(e instanceof Error ? e.message : "Fichier impossible à lire."); }
  }
  function calculate() {
    if (!source) return;
    setError(""); resetLink(); setData([]);
    try {
      if (!mapping.ad && !mapping.adId) {
        throw new Error("Pour associer les statistiques à cette vidéo, indique un nom ou un identifiant de publicité dans l'export.");
      }
      const result = rowsFromMapping(source.rows, mapping);
      if (!result.rows.length) throw new Error("Aucune ligne valide. Vérifie les colonnes de l'export.");
      if (result.rows.some(r => !r.ad && !r.adId)) {
        throw new Error("Certaines lignes n'ont ni nom ni identifiant de publicité : impossible de les associer à une vidéo sans ambiguïté.");
      }
      setData(result.rows); setRejected(result.rejected);
    } catch (e) { setError(e instanceof Error ? e.message : "Calcul impossible."); }
  }
  const cards = real ? [
    ["Dépenses", money(real.metrics.spend, currency)],
    ["Impressions", number(real.metrics.impressions)],
    ["Clics", number(real.metrics.clicks)],
    ["CTR", percent(real.metrics.ctr)],
    ["CPC", money(real.metrics.cpc, currency)],
    ["CPM", money(real.metrics.cpm, currency)],
    ["Conversions", number(real.metrics.conversions, 2)],
    ["CPA", money(real.metrics.cpa, currency)],
    ["ROAS", real.metrics.roas === null ? "N/D" : `${number(real.metrics.roas, 2)} ×`],
    ["CA attribué", money(real.metrics.revenue, currency)],
  ] : [];

  return <section className="rounded-[24px] border border-violet-400/25 bg-gradient-to-br from-violet-500/[0.09] to-black/[0.06] p-5 sm:p-6" aria-label="Performance publicitaire liée à la vidéo">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-300">ADNIA · DATA Ads</div>
        <h3 className="mt-1 text-xl font-bold text-white">Performance réelle de cette vidéo</h3>
        <p className="mt-1 text-xs text-white/55">{videoName || "Vidéo analysée"} · Affichée au-dessus du lecteur et de la timeline.</p>
      </div>
      <button type="button" onClick={() => setExpanded(v => !v)} className="rounded-xl border border-violet-400/30 bg-violet-500/15 px-3 py-2 text-xs font-semibold text-violet-100 hover:bg-violet-500/25">
        {expanded ? "Masquer l'import" : real ? "Changer les données" : "Importer la DATA de cette pub"}
      </button>
    </div>

    {!real && <p className="mt-4 text-sm text-white/60">Aucune statistique de régie associée à cette vidéo. Importe un CSV de Meta Ads, TikTok Ads ou Google Ads et sélectionne la bonne publicité. Aucune métrique n'est déduite de la vidéo.</p>}
    {real && <>
      <p className="mt-4 text-xs text-violet-200">Source : {platform} · Publicité : <strong>{real.ad}</strong>{real.adId ? ` · ID ${real.adId}` : ""}{period ? ` · Période déclarée : ${period}` : " · Période non renseignée"} · {clickType} · Export CSV déclaré, non vérifié par API</p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map(([label, value]) => <div key={label} className="rounded-xl border border-white/10 bg-black/20 p-3"><div className="text-xs text-white/55">{label}</div><div className="mt-1 text-lg font-semibold text-white">{value}</div></div>)}
      </div>
      <p className="mt-3 text-xs text-white/55">Données issues uniquement de l'export et associées manuellement à la création. Ces indicateurs ne prouvent pas la causalité du hook, ni une rétention réelle. « N/D » signifie indisponible.</p>
    </>}

    {expanded && <div className="mt-5 space-y-4 border-t border-white/10 pt-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-xs text-white/75">Régie
          <select value={platform} onChange={e => setPlatform(e.target.value)} className="mt-1 block w-full rounded-lg border border-white/20 bg-neutral-900 p-2 text-sm text-white">
            <option>Meta Ads</option><option>TikTok Ads</option><option>Google Ads</option><option>Autre export</option>
          </select>
        </label>
        <label className="text-xs text-white/75">Devise des montants
          <select value={currency} onChange={e => setCurrency(e.target.value)} className="mt-1 block w-full rounded-lg border border-white/20 bg-neutral-900 p-2 text-sm text-white">
            <option value="EUR">EUR</option><option value="USD">USD</option><option value="GBP">GBP</option><option value="CAD">CAD</option>
          </select>
        </label>
        <label className="text-xs text-white/75">Type de clics dans l'export
          <select value={clickType} onChange={e => setClickType(e.target.value)} className="mt-1 block w-full rounded-lg border border-white/20 bg-neutral-900 p-2 text-sm text-white">
            <option>Clics sur lien/destination</option><option>Tous les clics</option>
          </select>
        </label>
      </div>
      <label className="block text-xs text-white/75">Période couverte par l'export (facultatif, sans contrôle automatique)
        <input value={period} onChange={e => setPeriod(e.target.value)} placeholder="Ex. 1 au 31 octobre 2026" className="mt-1 block w-full rounded-lg border border-white/20 bg-neutral-900 p-2 text-sm text-white" />
      </label>
      <label className="block rounded-xl border border-dashed border-violet-400/30 bg-black/15 p-4 text-sm text-white/75">Fichier de statistiques CSV / TSV (10 Mo max)
        <input type="file" accept=".csv,.tsv,text/csv,text/tab-separated-values" onChange={e => void upload(e.target.files?.[0])} className="mt-2 block w-full text-xs" />
      </label>
      {source && <>
        <p className="text-xs text-violet-200">{filename} · {source.rows.length} lignes · Associe les colonnes de ton export.</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {fields.map(f => <label key={f.key} className="text-xs text-white/75">{f.label}{f.required ? " *" : ""}
            <select value={mapping[f.key] || ""} onChange={e => { setMapping(old => ({...old, [f.key]:e.target.value})); setData([]); resetLink(); }} className="mt-1 block w-full min-w-0 rounded-lg border border-white/20 bg-neutral-900 p-2 text-sm text-white">
              <option value="">Non disponible</option>{source.headers.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </label>)}
        </div>
        <button type="button" onClick={calculate} className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500">Lire les performances de l'export</button>
      </>}
      {data.length > 0 && <>
        <p className="text-xs text-white/55">{data.length} lignes valides{rejected ? ` · ${rejected} lignes ignorées` : ""}. Choisis la publicité qui correspond exactement à la vidéo.</p>
        <label className="block text-sm text-white/80">Publicité à associer à la vidéo
          <select value={chosenId} onChange={e => { setChosenId(e.target.value); setConfirmed(false); }} className="mt-1 block w-full rounded-lg border border-white/20 bg-neutral-900 p-3 text-white">
            <option value="">Sélectionne une publicité</option>
            {groups.map(g => <option key={g.id} value={g.id}>{g.ad}{g.adId ? ` [${g.adId}]` : ""} — {g.campaign}</option>)}
          </select>
        </label>
        {selected && <label className="flex items-start gap-2 text-sm text-white/85">
          <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} className="mt-1 accent-violet-500" />
          <span>Je confirme que cette publicité (nom / ID) correspond bien à la vidéo analysée. Sans cette confirmation, aucune performance ne lui est attribuée.</span>
        </label>}
      </>}
      {error && <p role="alert" className="rounded-lg border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
      <p className="text-xs text-white/45">Lecture locale uniquement : aucun CSV n'est envoyé au serveur ni sauvegardé dans le rapport. Le rapprochement est temporaire pendant l'ouverture de cette page.</p>
    </div>}
  </section>;
}
