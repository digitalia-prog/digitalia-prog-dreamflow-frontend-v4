"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  getRecentCreatives,
  type RecentCreative,
} from "@/lib/recentCreatives";

function platformName(platform: string) {
  const value = (platform || "").toLowerCase();
  if (value.includes("meta") || value.includes("facebook")) return "Meta";
  if (value.includes("instagram")) return "Instagram";
  if (value.includes("tiktok")) return "TikTok";
  if (value.includes("youtube")) return "YouTube";
  return platform || "Créative";
}

function youtubeThumbnail(url: string) {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/
  );
  return match?.[1] ? `https://i.ytimg.com/vi/${match[1]}/hqdefault.jpg` : "";
}

function formatDate(value: string) {
  if (!value) return "Récemment";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Récemment";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function CreativePreview({ creative }: { creative: RecentCreative }) {
  const direct = creative.creativeUrl || "";
  const source = creative.sourceUrl || "";
  const isImage =
    creative.creativeType === "image" ||
    /\.(png|jpe?g|webp|gif|avif)(\?|$)/i.test(direct);
  const imageSrc = isImage ? direct : youtubeThumbnail(source);

  if (imageSrc) {
    return (
      <img
        src={imageSrc}
        alt=""
        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.025]"
      />
    );
  }

  if (direct && !direct.startsWith("blob:")) {
    return (
      <video
        src={direct}
        muted
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-500/15 via-[#151521] to-fuchsia-500/10">
      <div className="text-center">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.05] text-violet-300">
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="4" width="18" height="16" rx="3" />
            <path d="m10 8 6 4-6 4V8Z" />
          </svg>
        </span>
        <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.15em] text-white/25">
          {platformName(creative.platform)}
        </p>
      </div>
    </div>
  );
}

export default function CreativeLibraryPage() {
  const [creatives, setCreatives] = useState<RecentCreative[]>([]);
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState("all");

  useEffect(() => {
    const refresh = () => setCreatives(getRecentCreatives());
    refresh();

    window.addEventListener("storage", refresh);
    window.addEventListener("ugc-growth-recent-creatives-updated", refresh);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("ugc-growth-recent-creatives-updated", refresh);
    };
  }, []);

  const platforms = useMemo(() => {
    const values = Array.from(
      new Set(creatives.map((creative) => platformName(creative.platform)))
    );
    return values.sort((a, b) => a.localeCompare(b));
  }, [creatives]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return creatives.filter((creative) => {
      const creativePlatform = platformName(creative.platform);
      const platformMatch = platform === "all" || creativePlatform === platform;
      if (!platformMatch) return false;

      if (!normalized) return true;

      return [
        creative.advertiserName,
        creative.adText,
        creativePlatform,
        creative.creativeType,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized);
    });
  }, [creatives, platform, query]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/15 bg-violet-500/[0.08] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-300">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.85)]" />
              Creative Library
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/35">
              {creatives.length} créa{creatives.length > 1 ? "s" : ""}
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-[-0.035em] text-white md:text-4xl">
            Bibliothèque créative
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45 md:text-[15px]">
            Retrouvez les publicités capturées par l&apos;extension et déjà envoyées
            dans Creative Intelligence.
          </p>
        </div>

        <Link
          href="/dashboard/analyze-upload"
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(109,40,217,0.24)] transition hover:-translate-y-0.5 hover:from-violet-500 hover:to-fuchsia-500"
        >
          <span className="text-lg leading-none">+</span>
          Nouvelle analyse
        </Link>
      </header>

      <section className="rounded-[24px] border border-white/[0.07] bg-white/[0.02] p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
          <label className="relative block">
            <span className="sr-only">Rechercher</span>
            <svg
              viewBox="0 0 24 24"
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="6" />
              <path d="m16 16 4 4" />
            </svg>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher un annonceur, une plateforme, un texte..."
              className="h-12 w-full rounded-2xl border border-white/[0.07] bg-black/[0.14] pl-11 pr-4 text-sm text-white/80 outline-none placeholder:text-white/25 focus:border-violet-400/30"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPlatform("all")}
              className={`rounded-2xl border px-4 py-3 text-xs font-semibold transition ${
                platform === "all"
                  ? "border-violet-400/20 bg-violet-500/[0.12] text-violet-200"
                  : "border-white/[0.06] bg-black/[0.12] text-white/35 hover:text-white/65"
              }`}
            >
              Toutes
            </button>
            {platforms.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setPlatform(item)}
                className={`rounded-2xl border px-4 py-3 text-xs font-semibold transition ${
                  platform === item
                    ? "border-violet-400/20 bg-violet-500/[0.12] text-violet-200"
                    : "border-white/[0.06] bg-black/[0.12] text-white/35 hover:text-white/65"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      {filtered.length > 0 ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((creative) => {
            const href = creative.sourceUrl || creative.creativeUrl || "";
            return (
              <a
                key={`${creative.id}-${creative.savedAt}`}
                href={href || undefined}
                target={href ? "_blank" : undefined}
                rel={href ? "noreferrer" : undefined}
                className="group overflow-hidden rounded-[22px] border border-white/[0.07] bg-white/[0.025] transition duration-200 hover:-translate-y-0.5 hover:border-violet-400/20 hover:bg-white/[0.04]"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#0d0d15]">
                  <CreativePreview creative={creative} />
                  <div className="absolute left-3 top-3 rounded-full border border-white/[0.1] bg-black/60 px-2.5 py-1 text-[9px] font-semibold text-white/80 backdrop-blur-md">
                    {platformName(creative.platform)}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/75 to-transparent" />
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="truncate text-sm font-semibold text-white/85">
                        {creative.advertiserName || "Créative analysée"}
                      </h2>
                      <p className="mt-1 line-clamp-2 min-h-8 text-[11px] leading-4 text-white/30">
                        {creative.adText || "Analyse Creative Intelligence disponible"}
                      </p>
                    </div>
                    <span className="shrink-0 text-white/20 transition group-hover:translate-x-0.5 group-hover:text-violet-300">
                      →
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-white/[0.055] pt-3">
                    <span className="inline-flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-[0.12em] text-emerald-300/65">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Analysée
                    </span>
                    <span className="text-[9px] text-white/22">
                      {formatDate(creative.savedAt || creative.capturedAt)}
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </section>
      ) : (
        <section className="rounded-[28px] border border-dashed border-white/[0.08] bg-white/[0.015] px-6 py-16 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/10 bg-violet-500/[0.07] text-xl text-violet-300">
            ✦
          </span>
          <h2 className="mt-4 text-lg font-semibold text-white/80">
            {creatives.length === 0
              ? "Votre bibliothèque est encore vide"
              : "Aucune créative ne correspond à ce filtre"}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/35">
            {creatives.length === 0
              ? "Analysez une publicité depuis l’extension UGC Growth. Elle apparaîtra automatiquement ici."
              : "Essayez une autre plateforme ou effacez votre recherche."}
          </p>
          {creatives.length === 0 ? (
            <Link
              href="/dashboard/extensions"
              className="mt-5 inline-flex rounded-2xl border border-violet-400/15 bg-violet-500/[0.08] px-4 py-2.5 text-xs font-semibold text-violet-200 transition hover:bg-violet-500/[0.14]"
            >
              Ouvrir Extensions
            </Link>
          ) : null}
        </section>
      )}

      <p className="pb-2 text-[10px] leading-5 text-white/20">
        Bibliothèque V1 · sauvegarde locale dans ce navigateur. La persistance
        multi-appareils viendra avec la sauvegarde compte/DB.
      </p>
    </div>
  );
}
