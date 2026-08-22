export type RecentCreative = {
  id: string;
  platform: string;
  advertiserName: string;
  sourceUrl: string;
  creativeUrl: string;
  creativeType: string;
  adText: string;
  capturedAt: string;
  savedAt: string;
};

const STORAGE_KEY = "ugc-growth-recent-creatives-v1";
const MAX_ITEMS = 60;

function safeArray(value: unknown): RecentCreative[] {
  if (!Array.isArray(value)) return [];

  return value.filter((item): item is RecentCreative => {
    return Boolean(
      item &&
        typeof item === "object" &&
        typeof (item as RecentCreative).id === "string" &&
        typeof (item as RecentCreative).platform === "string"
    );
  });
}

export function getRecentCreatives(): RecentCreative[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return safeArray(JSON.parse(raw)).slice(0, MAX_ITEMS);
  } catch {
    return [];
  }
}

export function saveRecentCreative(
  creative: Omit<RecentCreative, "id" | "savedAt">
): RecentCreative {
  const savedAt = new Date().toISOString();

  const item: RecentCreative = {
    ...creative,
    id:
      creative.sourceUrl ||
      creative.creativeUrl ||
      `${creative.platform}-${savedAt}`,
    savedAt,
  };

  if (typeof window === "undefined") return item;

  try {
    const current = getRecentCreatives();

    const deduped = current.filter(
      (existing) =>
        existing.id !== item.id &&
        existing.sourceUrl !== item.sourceUrl &&
        existing.creativeUrl !== item.creativeUrl
    );

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([item, ...deduped].slice(0, MAX_ITEMS))
    );

    window.dispatchEvent(new Event("ugc-growth-recent-creatives-updated"));
  } catch {
    // La sauvegarde locale ne doit jamais bloquer une analyse.
  }

  return item;
}

export function clearRecentCreatives() {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("ugc-growth-recent-creatives-updated"));
  } catch {
    // Rien à faire.
  }
}
