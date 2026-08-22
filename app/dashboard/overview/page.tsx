"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AnalysisFlow from "./components/AnalysisFlow";
import { getRecentCreatives, type RecentCreative } from "@/lib/recentCreatives";

function VideoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path
        d="M15 10.5V8.8C15 7.11984 15 6.27976 14.673 5.63803C14.3854 5.07354 13.9265 4.6146 13.362 4.32698C12.7202 4 11.8802 4 10.2 4H6.8C5.11984 4 4.27976 4 3.63803 4.32698C3.07354 4.6146 2.6146 5.07354 2.32698 5.63803C2 6.27976 2 7.11984 2 8.8V15.2C2 16.8802 2 17.7202 2.32698 18.362C2.6146 18.9265 3.07354 19.3854 3.63803 19.673C4.27976 20 5.11984 20 6.8 20H10.2C11.8802 20 12.7202 20 13.362 19.673C13.9265 19.3854 14.3854 18.9265 14.673 18.362C15 17.7202 15 16.8802 15 15.2V13.5L19.1972 16.4979C20.3186 17.2989 20.8793 17.6994 21.3446 17.6767C21.7497 17.6569 22.1211 17.4451 22.344 17.1061C22.6 16.7168 22.6 16.0278 22.6 14.6497V9.35027C22.6 7.97218 22.6 7.28314 22.344 6.89391C22.1211 6.55487 21.7497 6.34311 21.3446 6.32331C20.8793 6.30056 20.3186 6.70108 19.1972 7.50212L15 10.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AudioIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path
        d="M12 3C10.3431 3 9 4.34315 9 6V12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12V6C15 4.34315 13.6569 3 12 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M5 11V12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12V11"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M12 19V22"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M9 22H15"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path
        d="M10.5 13.5L13.5 10.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M7.75736 15.7426L5.63604 17.864C3.68342 19.8166 3.68342 22.9824 5.63604 24.935C7.58866 26.8876 10.7545 26.8876 12.7071 24.935L14.8284 22.8137"
        transform="translate(0 -6)"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M16.2426 8.25736L18.364 6.13604C20.3166 4.18342 23.4824 4.18342 25.435 6.13604C27.3876 8.08866 27.3876 11.2545 25.435 13.2071L23.3137 15.3284"
        transform="translate(-6 0)"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M12 5V19M5 12H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M5 12H19M13 6L19 12L13 18"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function platformName(platform: string) {
  const normalized = platform.toLowerCase();

  if (normalized.includes("youtube")) return "YouTube";
  if (normalized.includes("tiktok")) return "TikTok";
  if (normalized.includes("instagram")) return "Instagram";
  if (normalized.includes("meta") || normalized.includes("facebook")) return "Meta";

  return platform || "Créative";
}

function youtubeThumbnail(url: string) {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/
  );

  return match?.[1]
    ? `https://i.ytimg.com/vi/${match[1]}/hqdefault.jpg`
    : "";
}

function CreativePreview({ creative }: { creative: RecentCreative }) {
  const direct = creative.creativeUrl || "";
  const source = creative.sourceUrl || "";
  const isImage =
    creative.creativeType === "image" ||
    /\.(png|jpe?g|webp|gif|avif)(\?|$)/i.test(direct);

  const ytThumb = youtubeThumbnail(source);
  const imageSrc = isImage ? direct : ytThumb;

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
          <VideoIcon />
        </span>
        <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.15em] text-white/25">
          {platformName(creative.platform)}
        </p>
      </div>
    </div>
  );
}

export default function OverviewPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recentCreatives, setRecentCreatives] = useState<RecentCreative[]>([]);

  useEffect(() => {
    const refreshRecents = () => {
      setRecentCreatives(getRecentCreatives());
    };

    refreshRecents();

    window.addEventListener("storage", refreshRecents);
    window.addEventListener("ugc-growth-recent-creatives-updated", refreshRecents);

    return () => {
      window.removeEventListener("storage", refreshRecents);
      window.removeEventListener("ugc-growth-recent-creatives-updated", refreshRecents);
    };
  }, []);

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  return (
    <>
      <div className="mx-auto w-full max-w-7xl space-y-8">
        <header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/15 bg-violet-500/[0.08] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-300">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.85)]" />
                Creative Intelligence
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/[0.05] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-emerald-300/80">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Engine opérationnel
              </span>
            </div>

            <h1 className="max-w-3xl text-3xl font-bold tracking-[-0.035em] text-white md:text-4xl">
              Votre cockpit créatif
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45 md:text-[15px]">
              Analysez une créa, comprenez pourquoi elle persuade, puis transformez
              cette intelligence en nouveaux angles et scripts à tester.
            </p>
          </div>

          <button
            type="button"
            onClick={openModal}
            className="group inline-flex min-h-12 shrink-0 items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(109,40,217,0.24)] transition hover:-translate-y-0.5 hover:from-violet-500 hover:to-fuchsia-500"
          >
            <PlusIcon />
            Nouvelle analyse
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">
              <ArrowIcon />
            </span>
          </button>
        </header>

        <section className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#11111b] shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
          <div className="pointer-events-none absolute right-[-90px] top-[-120px] h-72 w-72 rounded-full bg-violet-600/[0.16] blur-[90px]" />
          <div className="pointer-events-none absolute bottom-[-150px] left-[20%] h-64 w-64 rounded-full bg-fuchsia-600/[0.07] blur-[100px]" />

          <div className="relative grid lg:grid-cols-[1.3fr_0.7fr]">
            <div className="p-6 md:p-8">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.035] px-3 py-1.5 text-[11px] font-medium text-white/50">
                <span className="text-violet-300">✦</span>
                Du contenu brut à une stratégie exploitable
              </div>

              <h2 className="max-w-2xl text-2xl font-semibold leading-[1.15] tracking-[-0.03em] text-white md:text-3xl">
                Une créa entre. Une intelligence créative en sort.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/45">
                Importez une vidéo, un audio ou un contenu capturé par l&apos;extension.
                UGC Growth décompose le hook, l&apos;angle, la structure, la psychologie
                et les opportunités d&apos;amélioration.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={openModal}
                  className="group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-[#0b0b12] transition hover:-translate-y-0.5 hover:bg-violet-50"
                >
                  <PlusIcon />
                  Analyser une créa
                </button>

                <Link
                  href="/dashboard/ai"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-5 py-3 text-sm font-medium text-white/70 transition hover:bg-white/[0.07] hover:text-white"
                >
                  Ouvrir Script Engine
                  <ArrowIcon />
                </Link>
              </div>
            </div>

            <div className="border-t border-white/[0.07] bg-black/[0.14] p-5 md:p-6 lg:border-l lg:border-t-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">
                Pipeline UGC Growth
              </p>

              <div className="mt-5 space-y-2.5">
                {[
                  ["01", "Importer", "Vidéo, audio, extension"],
                  ["02", "Comprendre", "Hook, angle, psychologie"],
                  ["03", "Battre", "Faiblesses et opportunités"],
                  ["04", "Générer", "Hooks, angles et scripts"],
                ].map(([step, title, description]) => (
                  <div
                    key={step}
                    className="flex items-center gap-3 rounded-2xl border border-white/[0.055] bg-white/[0.025] p-3"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-[10px] font-bold text-violet-300">
                      {step}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-semibold text-white/80">
                        {title}
                      </span>
                      <span className="mt-0.5 block truncate text-[11px] text-white/30">
                        {description}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold tracking-[-0.02em] text-white">
                  Créatives récentes
                </h2>
                {recentCreatives.length > 0 ? (
                  <span className="rounded-full border border-violet-400/10 bg-violet-500/[0.07] px-2 py-0.5 text-[9px] font-semibold text-violet-300/80">
                    {recentCreatives.length}
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-xs text-white/30">
                Les dernières créas analysées depuis votre navigateur.
              </p>
            </div>

            <Link
              href="/dashboard/library"
              className="hidden text-xs font-medium text-white/35 transition hover:text-violet-300 sm:inline-flex"
            >
              Voir toute la bibliothèque →
            </Link>
          </div>

          {recentCreatives.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {recentCreatives.slice(0, 4).map((creative) => (
                <a
                  key={creative.id}
                  href={creative.sourceUrl || creative.creativeUrl || "#"}
                  target={creative.sourceUrl || creative.creativeUrl ? "_blank" : undefined}
                  rel="noreferrer"
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
                        <h3 className="truncate text-sm font-semibold text-white/85">
                          {creative.advertiserName || "Créative analysée"}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-white/30">
                          {creative.adText || "Analyse Creative Intelligence disponible"}
                        </p>
                      </div>

                      <span className="shrink-0 text-white/20 transition group-hover:translate-x-0.5 group-hover:text-violet-300">
                        <ArrowIcon />
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-white/[0.055] pt-3">
                      <span className="inline-flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-[0.12em] text-emerald-300/65">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Analysée
                      </span>
                      <span className="text-[9px] text-white/20">
                        Creative Intelligence
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[0, 1, 2, 3].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={openModal}
                  className="group overflow-hidden rounded-[22px] border border-dashed border-white/[0.08] bg-white/[0.015] text-left transition hover:border-violet-400/20 hover:bg-violet-500/[0.025]"
                >
                  <div className="flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-white/[0.015] to-violet-500/[0.025]">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.035] text-white/20 transition group-hover:border-violet-400/15 group-hover:text-violet-300/70">
                      <PlusIcon />
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xs font-semibold text-white/45">
                      Votre prochaine créa
                    </h3>
                    <p className="mt-1 text-[10px] leading-4 text-white/20">
                      Elle apparaîtra ici après son analyse.
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold tracking-[-0.02em] text-white">
                Accès rapide
              </h2>
              <p className="mt-1 text-xs text-white/30">
                Les outils principaux de votre workspace.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <button
              type="button"
              onClick={openModal}
              className="group text-left"
            >
              <div className="h-full rounded-[22px] border border-violet-400/15 bg-gradient-to-br from-violet-500/[0.11] to-fuchsia-500/[0.035] p-5 transition duration-200 group-hover:-translate-y-0.5 group-hover:border-violet-400/25 group-hover:bg-violet-500/[0.14]">
                <div className="flex items-start justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-violet-500/15 text-violet-300">
                    <VideoIcon />
                  </span>
                  <span className="text-white/20 transition group-hover:translate-x-0.5 group-hover:text-violet-300">
                    <ArrowIcon />
                  </span>
                </div>
                <h3 className="mt-5 text-sm font-semibold text-white">
                  Analyse créative
                </h3>
                <p className="mt-1.5 text-xs leading-5 text-white/35">
                  Hook, angle, structure, persuasion et psychologie.
                </p>
              </div>
            </button>

            <Link href="/dashboard/ai" className="group">
              <div className="h-full rounded-[22px] border border-white/[0.07] bg-white/[0.025] p-5 transition duration-200 group-hover:-translate-y-0.5 group-hover:border-white/[0.12] group-hover:bg-white/[0.045]">
                <div className="flex items-start justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-fuchsia-500/10 text-fuchsia-300">
                    <AudioIcon />
                  </span>
                  <span className="text-white/20 transition group-hover:translate-x-0.5 group-hover:text-white/55">
                    <ArrowIcon />
                  </span>
                </div>
                <h3 className="mt-5 text-sm font-semibold text-white">
                  Script Engine
                </h3>
                <p className="mt-1.5 text-xs leading-5 text-white/35">
                  Transformez l&apos;insight créatif en scripts prêts à tester.
                </p>
              </div>
            </Link>

            <Link href="/dashboard/media" className="group">
              <div className="h-full rounded-[22px] border border-white/[0.07] bg-white/[0.025] p-5 transition duration-200 group-hover:-translate-y-0.5 group-hover:border-white/[0.12] group-hover:bg-white/[0.045]">
                <div className="flex items-start justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-cyan-500/10 text-cyan-300">
                    <LinkIcon />
                  </span>
                  <span className="text-white/20 transition group-hover:translate-x-0.5 group-hover:text-white/55">
                    <ArrowIcon />
                  </span>
                </div>
                <h3 className="mt-5 text-sm font-semibold text-white">
                  Media Engine
                </h3>
                <p className="mt-1.5 text-xs leading-5 text-white/35">
                  Centralisez les créas et assets de votre workflow.
                </p>
              </div>
            </Link>

            <Link href="/dashboard/campaigns" className="group">
              <div className="h-full rounded-[22px] border border-white/[0.07] bg-white/[0.025] p-5 transition duration-200 group-hover:-translate-y-0.5 group-hover:border-white/[0.12] group-hover:bg-white/[0.045]">
                <div className="flex items-start justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-emerald-500/10 text-emerald-300">
                    <ArrowIcon />
                  </span>
                  <span className="text-white/20 transition group-hover:translate-x-0.5 group-hover:text-white/55">
                    <ArrowIcon />
                  </span>
                </div>
                <h3 className="mt-5 text-sm font-semibold text-white">
                  Campagnes
                </h3>
                <p className="mt-1.5 text-xs leading-5 text-white/35">
                  Organisez les idées et tests qui passent en production.
                </p>
              </div>
            </Link>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[24px] border border-white/[0.07] bg-white/[0.022] p-5 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Workflow Creative Intelligence
                  </h3>
                  <p className="mt-1 text-xs text-white/30">
                    Le chemin court entre une créa observée et un test exploitable.
                  </p>
                </div>
                <span className="hidden rounded-full border border-violet-400/10 bg-violet-500/[0.07] px-3 py-1 text-[10px] font-medium text-violet-300/80 sm:inline-flex">
                  Psychology Core
                </span>
              </div>

              <div className="mt-5 grid gap-2 sm:grid-cols-4">
                {[
                  ["01", "Analyser"],
                  ["02", "Comprendre"],
                  ["03", "Battre"],
                  ["04", "Générer"],
                ].map(([step, label], index) => (
                  <div
                    key={step}
                    className="relative rounded-2xl border border-white/[0.055] bg-black/[0.12] p-3.5"
                  >
                    <div className="text-[10px] font-bold text-violet-300/60">
                      {step}
                    </div>
                    <div className="mt-2 text-xs font-semibold text-white/70">
                      {label}
                    </div>
                    {index < 3 ? (
                      <span className="absolute -right-2 top-1/2 hidden h-px w-4 bg-violet-400/20 sm:block" />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-white/[0.07] bg-gradient-to-br from-white/[0.03] to-violet-500/[0.025] p-5 md:p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">
                Prochaine action
              </p>
              <h3 className="mt-3 text-lg font-semibold tracking-[-0.025em] text-white">
                Trouvez une créa. UGC Growth fait le reste.
              </h3>
              <p className="mt-2 text-xs leading-5 text-white/35">
                Importez-la directement ou utilisez l&apos;extension depuis votre plateforme source.
              </p>
              <button
                type="button"
                onClick={openModal}
                className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-violet-300 transition hover:text-violet-200"
              >
                Commencer une analyse
                <ArrowIcon />
              </button>
            </div>
          </div>
        </section>
      </div>

      <AnalysisFlow
        open={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
}
