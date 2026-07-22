"use client";

import { useState } from "react";
import AnalysisFlow from "./components/AnalysisFlow";

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

export default function OverviewPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  return (
    <>
      <div className="mx-auto w-full max-w-7xl space-y-8">
        <header className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-purple-400">
            Creative Intelligence Platform
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            UGC Growth Dashboard
          </h1>

          <p className="max-w-2xl text-sm leading-6 text-white/55 md:text-base">
            Analysez vos contenus publicitaires, identifiez les angles créatifs
            et générez des recommandations exploitables grâce à l&apos;IA.
          </p>
        </header>

        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#151526] p-6 shadow-2xl shadow-black/20 md:p-10">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-purple-600/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-fuchsia-600/10 blur-3xl" />

          <div className="relative z-10 max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-200">
              <span className="h-2 w-2 rounded-full bg-purple-400" />
              Analyse créative assistée par IA
            </div>

            <h2 className="max-w-2xl text-2xl font-semibold leading-tight text-white md:text-3xl">
              Transformez une publicité en analyse, recommandations et scripts.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60 md:text-base">
              Importez une vidéo, un fichier audio ou collez un lien. UGC Growth
              vous guide ensuite vers le moteur adapté.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={openModal}
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-purple-950/30 transition duration-200 hover:-translate-y-0.5 hover:from-purple-500 hover:to-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-[#151526]"
              >
                <PlusIcon />
                Nouvelle analyse
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  <ArrowIcon />
                </span>
              </button>

              <p className="text-sm text-white/40">
                Vidéo, audio ou lien publicitaire
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-[#12121D] p-5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-300">
              <VideoIcon />
            </div>

            <h3 className="font-semibold text-white">
              Analyse créative
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/45">
              Analysez le hook, la structure, les angles marketing, le CTA et la
              psychologie du contenu.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#12121D] p-5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-300">
              <AudioIcon />
            </div>

            <h3 className="font-semibold text-white">
              Transcription intelligente
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/45">
              Transformez une vidéo ou un audio en contenu structuré et prêt à
              être exploité.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#12121D] p-5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-300">
              <LinkIcon />
            </div>

            <h3 className="font-semibold text-white">
              Génération stratégique
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/45">
              Créez des variantes, des recommandations, des scripts et des
              livrables marketing.
            </p>
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
