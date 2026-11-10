/** Import publicitaire : calculs locaux. Aucune métrique n'est générée par l'IA. */
export type MetricKey = "spend" | "impressions" | "clicks" | "conversions" | "revenue";
export type Key = "campaign" | "ad" | "adId" | MetricKey;
export type ColumnMap = Record<Key, string>;
export type AdRow = {
  campaign: string; ad: string; adId: string;
  spend: number; impressions: number; clicks: number;
  conversions: number | null; revenue: number | null;
};
export type AdMetrics = {
  spend: number; impressions: number; clicks: number;
  conversions: number | null; revenue: number | null;
  ctr: number | null; cpc: number | null; cpm: number | null;
  cpa: number | null; roas: number | null;
};
export type AdGroup = { id: string; campaign: string; ad: string; adId: string; rows: number; metrics: AdMetrics };
const aliases: Record<Key, string[]> = {
  campaign: ["campaign name", "nom de la campagne", "campaign", "campagne"],
  ad: ["ad name", "nom de la publicite", "nom de la publicité", "ad", "annonce", "nom annonce", "nom de l annonce"],
  adId: ["ad id", "identifiant de la publicite", "identifiant de la publicité", "id de l annonce", "creative id", "id publicite"],
  spend: ["amount spent", "montant depense", "montant dépensé", "spend", "cost", "cout", "coût", "total cost", "cost (eur)", "dépenses", "depenses"],
  impressions: ["impressions", "impr.", "impr", "impression"],
  clicks: ["link clicks", "clics sur un lien", "clics sur le lien", "clicks", "clics", "clicks (destination)", "destination clicks"],
  conversions: ["conversions", "conversion", "purchases", "achats", "results", "résultats", "resultats", "all conv."],
  revenue: ["purchase conversion value", "purchases conversion value", "conversion value", "conv. value", "valeur de conversion", "valeur des achats", "purchase value", "total complete payment value", "revenue", "chiffre d affaires", "chiffre d'affaires", "sales value"],
};
function fold(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
export function suggestColumns(headers: string[]): ColumnMap {
  const result = {} as ColumnMap;
  for (const key of Object.keys(aliases) as Key[]) {
    const set = aliases[key].map(fold);
    result[key] = headers.find(h => set.some(a => fold(h) === a || fold(h).startsWith(a + " "))) || "";
  }
  return result;
}
export function parseDelimited(text: string): { headers: string[]; rows: Record<string, string>[] } {
  const source = text.replace(/^\uFEFF/, "");
  const firstLine = source.split(/\r?\n/, 1)[0] || "";
  const count = (d: string) => {
    let quotes = false, n = 0;
    for (let i = 0; i < firstLine.length; i++) {
      if (firstLine[i] === '"') {
        if (quotes && firstLine[i + 1] === '"') i++;
        else quotes = !quotes;
      } else if (!quotes && firstLine[i] === d) n++;
    }
    return n;
  };
  const delimiter = ["\t", ";", ","].sort((a, b) => count(b) - count(a))[0];
  if (!count(delimiter)) throw new Error("Fichier CSV/TSV non reconnu : séparateur introuvable.");
  const cells: string[][] = [];
  let row: string[] = [], cell = "", quoted = false;
  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    if (ch === '"') {
      if (quoted && source[i + 1] === '"') { cell += '"'; i++; }
      else quoted = !quoted;
    } else if (!quoted && ch === delimiter) {
      row.push(cell.trim()); cell = "";
    } else if (!quoted && (ch === "\n" || ch === "\r")) {
      row.push(cell.trim()); cell = "";
      if (row.some(Boolean)) cells.push(row);
      row = [];
      if (ch === "\r" && source[i + 1] === "\n") i++;
    } else cell += ch;
  }
  if (quoted) throw new Error("CSV incomplet : guillemet non refermé.");
  row.push(cell.trim());
  if (row.some(Boolean)) cells.push(row);
  if (cells.length < 2) throw new Error("Aucune ligne de données dans le fichier.");
  const headers = cells[0];
  if (headers.some(h => !h) || new Set(headers).size !== headers.length) throw new Error("Colonnes CSV vides ou en double.");
  if (cells.length > 30001) throw new Error("Fichier trop grand : limite de 30 000 lignes.");
  return { headers, rows: cells.slice(1).map(cells => Object.fromEntries(headers.map((h, i) => [h, cells[i] || ""]))) };
}
export function parseNumber(input: string): number | null {
  let s = input.trim().replace(/[\s\u00a0\u202f€$£]/g, "").replace(/[%]/g, "");
  if (!s || s === "-" || s === "—" || s.toLowerCase() === "n/a") return null;
  let negative = false;
  if (/^\(.*\)$/.test(s)) { negative = true; s = s.slice(1, -1); }
  if (!/^[+-]?[0-9.,]+$/.test(s)) return null;
  const comma = s.lastIndexOf(","), dot = s.lastIndexOf(".");
  if (comma >= 0 && dot >= 0) {
    const decimal = comma > dot ? "," : ".";
    const thousands = decimal === "," ? "." : ",";
    s = s.replaceAll(thousands, "").replace(decimal, ".");
  } else if (comma >= 0 || dot >= 0) {
    const sep = comma >= 0 ? "," : ".";
    const parts = s.split(sep);
    if (parts.length > 2) {
      if (!parts.slice(1).every(p => p.length === 3)) return null;
      s = parts.join("");
    } else if (parts[1]?.length === 3 && parts[0].length >= 1 && parts[0].length <= 3) {
      s = parts.join("");
    } else s = s.replace(sep, ".");
  }
  const n = Number(s);
  return Number.isFinite(n) ? (negative ? -n : n) : null;
}
export function rowsFromMapping(raw: Record<string, string>[], map: ColumnMap): { rows: AdRow[]; rejected: number } {
  if (!["spend", "impressions", "clicks"].every(k => Boolean(map[k as MetricKey]))) {
    throw new Error("Associe obligatoirement Dépenses, Impressions et Clics.");
  }
  const rows: AdRow[] = [];
  let rejected = 0;
  for (const r of raw) {
    const spend = parseNumber(r[map.spend] || "");
    const impressions = parseNumber(r[map.impressions] || "");
    const clicks = parseNumber(r[map.clicks] || "");
    const campaign = (r[map.campaign] || "").trim();
    const ad = (r[map.ad] || "").trim();
    const adId = (r[map.adId] || "").trim();
    if ([campaign, ad, adId].some(x => /^(total|totaux|somme|grand total|all campaigns)$/i.test(x))) continue;
    if (spend === null || spend < 0 || impressions === null || impressions < 0 || clicks === null || clicks < 0 || !Number.isInteger(impressions) || !Number.isInteger(clicks)) { rejected++; continue; }
    const conversions = map.conversions ? parseNumber(r[map.conversions] || "") : null;
    const revenue = map.revenue ? parseNumber(r[map.revenue] || "") : null;
    if (conversions !== null && conversions < 0 || revenue !== null && revenue < 0) { rejected++; continue; }
    rows.push({campaign, ad, adId, spend, impressions, clicks, conversions, revenue});
  }
  return { rows, rejected };
}
export function metrics(rows: AdRow[]): AdMetrics {
  const sum = (key: "spend" | "impressions" | "clicks") => rows.reduce((acc, r) => acc + r[key], 0);
  const spend = sum("spend"), impressions = sum("impressions"), clicks = sum("clicks");
  const conversions = rows.length && rows.every(r => r.conversions !== null) ? rows.reduce((acc, r) => acc + r.conversions!, 0) : null;
  const revenue = rows.length && rows.every(r => r.revenue !== null) ? rows.reduce((acc, r) => acc + r.revenue!, 0) : null;
  return {
    spend, impressions, clicks, conversions, revenue,
    ctr: impressions > 0 ? 100 * clicks / impressions : null,
    cpc: clicks > 0 ? spend / clicks : null,
    cpm: impressions > 0 ? 1000 * spend / impressions : null,
    cpa: conversions !== null && conversions > 0 ? spend / conversions : null,
    roas: revenue !== null && spend > 0 ? revenue / spend : null,
  };
}
export function groupRows(rows: AdRow[]): AdGroup[] {
  const groups = new Map<string, AdRow[]>();
  for (const row of rows) {
    const key = JSON.stringify([row.campaign, row.adId || row.ad || "Ensemble"]);
    const bucket = groups.get(key);
    if (bucket) bucket.push(row);
    else groups.set(key, [row]);
  }
  return [...groups].map(([id, members]) => ({
    id, campaign: members[0].campaign || "Sans campagne", ad: members[0].ad || "Non renseignée",
    adId: members[0].adId, rows: members.length, metrics: metrics(members),
  })).sort((a, b) => b.metrics.spend - a.metrics.spend);
}
