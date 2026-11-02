/** V1.8 - Sources déclarées dans la description, jamais assimilées à une image analysée. */
export type DescriptionEvidence = {
  websiteMentions: string[];
  descriptionCtas: string[];
  sourceLabel: "description";
};

const IGNORED_DOMAINS = new Set([
  "youtube.com", "youtu.be", "tiktok.com", "instagram.com", "facebook.com",
  "fb.com", "x.com", "twitter.com", "bit.ly", "tinyurl.com", "linktr.ee",
  "google.com", "google.fr", "wa.me", "whatsapp.com",
]);

function compact(value: string): string {
  return value.replace(/\s+/g, " ").trim().slice(0, 140);
}

function normalizedHost(value: string): string | null {
  try {
    const hostname = new URL(value).hostname.toLowerCase().replace(/^www\./, "");
    if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(hostname)) return null;
    return hostname;
  } catch {
    return null;
  }
}

/** Explicit website mentions and CTA expressions *in description text only*. */
export function extractDescriptionEvidence(rawText: unknown): DescriptionEvidence {
  const text = typeof rawText === "string" ? rawText.slice(0, 12000) : "";
  const websites: string[] = [];
  for (const match of text.matchAll(/https?:\/\/[^\s<>"'()]+/gi)) {
    const hostname = normalizedHost(match[0].replace(/[.,;!?]+$/, ""));
    if (!hostname || IGNORED_DOMAINS.has(hostname)) continue;
    if (!websites.includes(hostname)) websites.push(hostname);
    if (websites.length >= 6) break;
  }

  const candidates: string[] = [];
  const patterns = [
    /\bregarder\s+(?:le\s+film\s+)?sur\s+[\p{L}\p{N}][\p{L}\p{N}' -]{1,42}(?=\s*[:.!?]|\s+https?:\/\/|$)/giu,
    /\babonne[- ]toi\s+à\s+la\s+chaîne(?:\s+YouTube)?\s+de\s+[\p{L}\p{N}][\p{L}\p{N}' -]{1,42}(?=\s*[:.!?]|\s+https?:\/\/|$)/giu,
    /\babonnez[- ]vous\s+à\s+la\s+chaîne(?:\s+YouTube)?\s+de\s+[\p{L}\p{N}][\p{L}\p{N}' -]{1,42}(?=\s*[:.!?]|\s+https?:\/\/|$)/giu,
    /\b(?:découvrez|réservez|commandez|achetez)\s+(?:sur\s+)?[\p{L}\p{N}][\p{L}\p{N}' -]{1,42}(?=\s*[:.!?]|\s+https?:\/\/|$)/giu,
  ];
  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      const phrase = compact(match[0]);
      if (phrase.length > 5 && !candidates.some((v) => v.toLowerCase() === phrase.toLowerCase())) {
        candidates.push(phrase);
      }
      if (candidates.length >= 5) break;
    }
    if (candidates.length >= 5) break;
  }
  return { websiteMentions: websites, descriptionCtas: candidates, sourceLabel: "description" };
}
