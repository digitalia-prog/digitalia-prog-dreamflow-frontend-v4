"use client";

import { useMemo, useState } from "react";
import { groupRows, metrics, parseDelimited, rowsFromMapping, suggestColumns, type AdRow, type ColumnMap, type Key } from "../../../../lib/adniaAdsData";

const fields: { key: Key; label: string; required?: boolean }[] = [
  { key: "campaign", label: "Campagne" },
  { key: "ad", label: "Nom de la publicité" },
  { key: "adId", label: "Identifiant publicité" },
  { key: "spend", label: "Dépenses", required: true },
  { key: "impressions", label: "Impressions", required: true },
  { key: "clicks", label: "Clics", required: true },
  { key: "conversions", label: "Conversions" },
  { key: "revenue", label: "Valeur de conversion / CA" },
];
const money = (value: number | null, currency: string) => value === null ? "N/D" : new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(value);
const num = (value: number | null, digits = 0) => value === null ? "N/D" : new Intl.NumberFormat("fr-FR", { maximumFractionDigits: digits }).format(value);

export default function PerformanceAdsPage() {
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState("Meta Ads");
  const [currency, setCurrency] = useState("EUR");
  const [clickType, setClickType] = useState("Clics sur lien / destination");
  const [source, setSource] = useState<{ headers: string[]; rows: Record<string, string>[] } | null>(null);
  const [mapping, setMapping] = useState<ColumnMap>({} as ColumnMap);
  const [data, setData] = useState<AdRow[]>([]);
  const [rejected, setRejected] = useState(0);
  const [error, setError] = useState("");
  const totals = useMemo(() => metrics(data), [data]);
  const groups = useMemo(() => groupRows(data), [data]);
  async function upload(file?: File) {
    setError(""); setData([]); setSource(null);
    if (!file) return;
    if (file.size > 10_000_000) { setError("Limite : fichier de 10 Mo maximum."); return; }
    try {
      const result = parseDelimited(await file.text());
      setSource(result); setMapping(suggestColumns(result.headers)); setName(file.name);
    } catch (e) { setError(e instanceof Error ? e.message : "Fichier illisible."); }
  }
  function calculate() {
    if (!source) return;
    setError("");
    try {
      const result = rowsFromMapping(source.rows, mapping);
      if (!result.rows.length) throw new Error("Aucune ligne valide. Vérifie les colonnes et les séparateurs numériques.");
      setData(result.rows); setRejected(result.rejected);
    } catch (e) { setError(e instanceof Error ? e.message : "Calcul impossible."); }
  }
  const cards = [
    { label: "Dépenses", value: money(totals.spend, currency) },
    { label: "Impressions", value: num(totals.impressions) },
    { label: clickType, value: num(totals.clicks) },
    { label: "CTR", value: totals.ctr === null ? "N/D" : `${num(totals.ctr, 2)} %` },
    { label: "CPC", value: money(totals.cpc, currency) },
    { label: "CPM", value: money(totals.cpm, currency) },
    { label: "Conversions", value: num(totals.conversions, 2) },
    { label: "CPA", value: money(totals.cpa, currency) },
    { label: "Valeur des conversions", value: money(totals.revenue, currency) },
    { label: "ROAS", value: totals.roas === null ? "N/D" : `${num(totals.roas, 2)} ×` },
  ];
  return (
    <main className="space-y-6 text-white">
      <header className="rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-700/30 to-black/20 p-6">
        <div className="text-sm text-violet-200">ADNIA · Agency · Performance Ads</div>
        <h1 className="mt-2 text-3xl font-bold">DATA publicitaire réelle</h1>
        <p className="mt-3 text-sm text-white/70">Importe un export CSV/TSV de Meta Ads, TikTok Ads ou Google Ads. Les indicateurs sont calculés depuis les chiffres importés, jamais estimés depuis une vidéo.</p>
      </header>
      <section className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-xl font-semibold">1. Importer les statistiques</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <label className="space-y-1 text-sm"><span>Régie / provenance</span><select value={platform} onChange={e => setPlatform(e.target.value)} className="block w-full rounded-lg border border-white/20 bg-neutral-900 p-3"><option>Meta Ads</option><option>TikTok Ads</option><option>Google Ads</option><option>Autre export</option></select></label>
          <label className="space-y-1 text-sm"><span>Devise de l'export</span><select value={currency} onChange={e => setCurrency(e.target.value)} className="block w-full rounded-lg border border-white/20 bg-neutral-900 p-3"><option value="EUR">EUR</option><option value="USD">USD</option><option value="GBP">GBP</option><option value="CAD">CAD</option></select></label>
          <label className="space-y-1 text-sm"><span>Nature des clics</span><select value={clickType} onChange={e => setClickType(e.target.value)} className="block w-full rounded-lg border border-white/20 bg-neutral-900 p-3"><option>Clics sur lien / destination</option><option>Tous les clics</option></select></label>
        </div>
        <label className="block rounded-xl border border-dashed border-violet-300/30 bg-black/20 p-4 text-sm">
          <span className="block pb-2">Fichier CSV ou TSV, 10 Mo maximum</span>
          <input type="file" accept=".csv,.tsv,text/csv,text/tab-separated-values" onChange={e => void upload(e.target.files?.[0])} className="w-full text-sm" />
        </label>
        <p className="text-xs text-white/50">Calcul dans le navigateur uniquement : ce premier écran n'envoie ni ne sauvegarde le fichier sur un serveur. Vérifie la devise et la période avant comparaison.</p>
        {source && <>
          <div className="text-sm text-violet-200">{name} · {source.rows.length} lignes · {source.headers.length} colonnes</div>
          <h3 className="font-semibold">2. Associer les colonnes de ton export</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {fields.map(f => <label key={f.key} className="space-y-1 text-sm"><span>{f.label}{f.required && " *"}</span><select value={mapping[f.key] || ""} onChange={e => {setMapping(m => ({...m, [f.key]: e.target.value})); setData([]);}} className="block w-full min-w-0 rounded-lg border border-white/20 bg-neutral-900 p-2"><option value="">Non disponible</option>{source.headers.map(h => <option key={h} value={h}>{h}</option>)}</select></label>)}
          </div>
          <button onClick={calculate} className="rounded-xl bg-violet-600 px-5 py-3 font-semibold hover:bg-violet-500">Calculer la performance réelle</button>
        </>}
        {error && <p role="alert" className="rounded-lg border border-red-400/40 bg-red-900/20 p-3 text-sm text-red-200">{error}</p>}
      </section>
      {data.length > 0 && <>
        <section className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-xl font-semibold">Performance importée · {platform}</h2>
          <p className="text-xs text-white/60">{data.length} lignes exploitées{rejected ? ` · ${rejected} lignes ignorées (valeurs invalides ou manquantes)` : ""}. Source : fichier CSV non vérifié par API. Valeurs N/D si métrique absente ou dénominateur nul.</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {cards.map(c => <div key={c.label} className="rounded-xl border border-white/10 bg-black/20 p-3"><div className="text-xs text-white/55">{c.label}</div><div className="mt-2 text-lg font-bold">{c.value}</div></div>)}
          </div>
        </section>
        <section className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-xl font-semibold">Comparaison des créations</h2>
          <p className="text-sm text-white/60">Regroupement par campagne + identifiant (ou nom) de publicité. Les chiffres cumulés utilisent les volumes réels, pas une moyenne de pourcentages.</p>
          <div className="overflow-x-auto"><table className="w-full min-w-[960px] text-left text-sm"><thead><tr className="border-b border-white/15 text-white/65">{["Campagne / création", "Dépenses", "Impr.", "Clics", "CTR", "CPC", "Conversions", "CPA", "ROAS"].map(t => <th key={t} className="p-3">{t}</th>)}</tr></thead><tbody>{groups.map(g => <tr key={g.id} className="border-b border-white/10"><td className="p-3"><div className="font-medium">{g.ad}</div><div className="text-xs text-white/50">{g.campaign}{g.adId ? ` · ID ${g.adId}` : ""}</div></td><td className="p-3">{money(g.metrics.spend,currency)}</td><td className="p-3">{num(g.metrics.impressions)}</td><td className="p-3">{num(g.metrics.clicks)}</td><td className="p-3">{g.metrics.ctr === null ? "N/D" : `${num(g.metrics.ctr,2)} %`}</td><td className="p-3">{money(g.metrics.cpc,currency)}</td><td className="p-3">{num(g.metrics.conversions,2)}</td><td className="p-3">{money(g.metrics.cpa,currency)}</td><td className="p-3">{g.metrics.roas === null ? "N/D" : `${num(g.metrics.roas,2)} ×`}</td></tr>)}</tbody></table></div>
        </section>
        <p className="text-sm text-white/60">La comparaison ne prouve pas la causalité d'un hook ou d'un montage : audiences, budgets, placements, périodes et fenêtres d'attribution peuvent différer. Le rapprochement automatique avec une vidéo analysée reste à développer.</p>
      </>}
    </main>
  );
}
