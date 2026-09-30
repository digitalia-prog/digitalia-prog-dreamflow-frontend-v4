import { createClient } from "@/lib/supabase/client";
export type RecentCreative = {
  id: string; platform: string; advertiserName: string; sourceUrl: string;
  creativeUrl: string; creativeType: string; adText: string; capturedAt: string; savedAt: string;
  kind?: "analysis" | "media" | "scripts" | "legacy";
  result?: unknown;
};
export const LIBRARY_EVENT = "ugc-growth-recent-creatives-updated";
export function safeSourceUrl(value: string): string {
  try { const url = new URL(value); return ["https:", "http:"].includes(url.protocol) ? url.href : ""; }
  catch { return ""; }
}
export function libraryError(error: unknown): string {
  const code = (error as {code?: string})?.code;
  if (["42P01", "PGRST205"].includes(code || "")) return "La bibliothèque cloud n’est pas encore activée. Votre résultat reste affiché : réessayez après son activation.";
  return "Enregistrement ou chargement impossible. Vérifiez votre connexion et votre session, puis réessayez.";
}
async function connection() {
  const db = createClient();
  const {data, error} = await db.auth.getUser();
  if (error || !data.user) throw new Error("Reconnectez-vous pour accéder à votre bibliothèque.");
  return {db, owner: data.user.id};
}
export async function getRecentCreatives(): Promise<RecentCreative[]> {
  const {db, owner} = await connection();
  const items: RecentCreative[] = [];
  for (let offset = 0; ; offset += 100) {
    const {data, error} = await db.from("ugc_creative_library").select("id,saved_at,payload")
      .eq("user_id", owner).order("saved_at", {ascending:false}).order("id").range(offset, offset + 99);
    if (error) throw error;
    for (const row of data || []) items.push({...row.payload, id:row.id, savedAt:row.saved_at});
    if (!data || data.length < 100) break;
  }
  return items;
}
export async function getCreative(id: string): Promise<RecentCreative | null> {
  const {db, owner} = await connection();
  const {data, error} = await db.from("ugc_creative_library").select("id,saved_at,payload").eq("user_id",owner).eq("id",id).maybeSingle();
  if (error) throw error;
  return data ? {...data.payload, id:data.id, savedAt:data.saved_at} : null;
}
export async function saveRecentCreative(creative: Omit<RecentCreative,"id"|"savedAt">, id: string, expectedOwner: string): Promise<void> {
  const {db, owner} = await connection();
  if (owner !== expectedOwner) throw new Error("Le compte a changé. Rechargez cette page.");
  const payload = {...creative, sourceUrl:safeSourceUrl(creative.sourceUrl), creativeUrl:safeSourceUrl(creative.creativeUrl)};
  if (new TextEncoder().encode(JSON.stringify(payload)).length > 1900000) throw new Error("Ce résultat est trop volumineux pour être sauvegardé.");
  const {error} = await db.from("ugc_creative_library").upsert({id,user_id:owner,payload}, {onConflict:"id"});
  if (error) throw error;
  window.dispatchEvent(new Event(LIBRARY_EVENT));
}
export async function deleteCreative(id: string) {
  const {db,owner} = await connection();
  const {error} = await db.from("ugc_creative_library").delete().eq("user_id",owner).eq("id",id);
  if (error) throw error;
  window.dispatchEvent(new Event(LIBRARY_EVENT));
}
// L'ancien stockage n'est jamais importé automatiquement : il n'avait pas de propriétaire.
export function getLegacyCreatives(): RecentCreative[] {
  try {
    const items: unknown = JSON.parse(localStorage.getItem("ugc-growth-recent-creatives-v1") || "[]");
    return Array.isArray(items) ? items.filter((x): x is RecentCreative => x && typeof x.id === "string" && typeof x.platform === "string") : [];
  } catch { return []; }
}
