"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

type AnalysisFlowProps = {
  open: boolean;
  onClose: () => void;
};

type AnalysisType = "ad" | "video" | "audio";
type ImportMode = "upload" | "link";

type Platform = {
  id: string;
  name: string;
  description: string;
  badge: string;
};

const platforms: Platform[] = [
  {
    id: "meta",
    name: "Meta Ads Library",
    description: "Analysez une publicité Facebook ou Instagram.",
    badge: "META",
  },
  {
    id: "tiktok",
    name: "TikTok Creative Center",
    description: "Analysez une création publicitaire TikTok.",
    badge: "TIKTOK",
  },
  {
    id: "youtube",
    name: "YouTube Ads",
    description: "Analysez une publicité vidéo diffusée sur YouTube.",
    badge: "YOUTUBE",
  },
  {
    id: "google",
    name: "Google Ads",
    description: "Analysez une création issue d'une campagne Google.",
    badge: "GOOGLE",
  },
  {
    id: "linkedin",
    name: "LinkedIn Ads",
    description: "Analysez une publicité B2B diffusée sur LinkedIn.",
    badge: "LINKEDIN",
  },
  {
    id: "pinterest",
    name: "Pinterest Ads",
    description: "Analysez une création publicitaire Pinterest.",
    badge: "PINTEREST",
  },
];

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M19 12H5M11 18L5 12L11 6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
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

function AdIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path
        d="M4 13V8.5C4 7.11929 5.11929 6 6.5 6H9L16 3V18L9 15H6.5C5.11929 15 4 13.8807 4 12.5V13Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M9 15L10.5 21H7.5L6 15"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M19 7C20.3333 8.33333 20.3333 12.6667 19 14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <rect
        x="3"
        y="5"
        width="13"
        height="14"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M16 10L21 7V17L16 14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AudioIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <rect
        x="9"
        y="3"
        width="6"
        height="12"
        rx="3"
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
        d="M12 19V22M9 22H15"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path
        d="M12 16V4M7 9L12 4L17 9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 14V18C5 19.1046 5.89543 20 7 20H17C18.1046 20 19 19.1046 19 18V14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path
        d="M10 14L14 10"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M7.5 16.5L5.5 18.5C3.567 20.433 3.567 23.567 5.5 25.5"
        transform="translate(0 -7)"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M16.5 7.5L18.5 5.5C20.433 3.567 23.567 3.567 25.5 5.5"
        transform="translate(-7 0)"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AnalysisFlow({ open, onClose }: AnalysisFlowProps) {
  const router = useRouter();
  const [analysisType, setAnalysisType] = useState<AnalysisType | null>(null);
  const [platform, setPlatform] = useState<Platform | null>(null);

  useEffect(() => {
    if (!open) {
      setAnalysisType(null);
      setPlatform(null);
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  function goBack() {
    if (platform) {
      setPlatform(null);
      return;
    }

    if (analysisType) {
      setAnalysisType(null);
    }
  }

  function selectAnalysisType(type: AnalysisType) {
    if (type === "video" || type === "audio") {
      onClose();
      router.push("/dashboard/analyze-upload");
      return;
    }

    setAnalysisType(type);
  }

  function selectImportMode(mode: ImportMode) {
    onClose();

    if (mode === "upload") {
      router.push("/dashboard/analyze-upload");
      return;
    }

    router.push("/dashboard/analyze");
  }

  const isFirstStep = !analysisType;
  const isPlatformStep = analysisType === "ad" && !platform;
  const isImportStep = analysisType === "ad" && platform;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="analysis-flow-title"
        className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-[#151522] shadow-2xl shadow-black/60"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/80 to-transparent" />

        <header className="flex items-start justify-between border-b border-white/10 px-6 py-5 md:px-8">
          <div className="flex items-start gap-3">
            {!isFirstStep && (
              <button
                type="button"
                onClick={goBack}
                aria-label="Revenir à l'étape précédente"
                className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <BackIcon />
              </button>
            )}

            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-[0.18em] text-purple-400">
                UGC Growth
              </p>

              <h2
                id="analysis-flow-title"
                className="text-xl font-semibold text-white md:text-2xl"
              >
                {isFirstStep && "Nouvelle analyse"}
                {isPlatformStep && "Choisissez une plateforme"}
                {isImportStep && platform?.name}
              </h2>

              <p className="mt-2 text-sm text-white/50">
                {isFirstStep && "Que souhaitez-vous analyser ?"}
                {isPlatformStep &&
                  "Sélectionnez la source de votre publicité."}
                {isImportStep &&
                  "Choisissez comment envoyer votre contenu à UGC Growth."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer la fenêtre"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <CloseIcon />
          </button>
        </header>

        <div className="p-4 md:p-6">
          {isFirstStep && (
            <div className="grid gap-3 md:grid-cols-3">
              <FlowCard
                title="Une publicité"
                description="Analysez une campagne Meta, TikTok, Google, YouTube, LinkedIn ou Pinterest."
                badge="RECOMMANDÉ"
                icon={<AdIcon />}
                onClick={() => selectAnalysisType("ad")}
              />

              <FlowCard
                title="Une vidéo"
                description="Importez une vidéo depuis votre ordinateur."
                badge="MP4, MOV, WEBM"
                icon={<VideoIcon />}
                onClick={() => selectAnalysisType("video")}
              />

              <FlowCard
                title="Un audio"
                description="Importez une interview, un podcast ou un fichier audio."
                badge="MP3, WAV, M4A"
                icon={<AudioIcon />}
                onClick={() => selectAnalysisType("audio")}
              />
            </div>
          )}

          {isPlatformStep && (
            <div className="grid gap-3 md:grid-cols-2">
              {platforms.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPlatform(item)}
                  className="group flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-purple-400/40 hover:bg-purple-500/[0.08] focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-purple-400/15 bg-purple-500/10 text-xs font-bold text-purple-200">
                    {item.badge.slice(0, 2)}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="font-semibold text-white">
                      {item.name}
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-white/45">
                      {item.description}
                    </span>
                  </span>

                  <span className="shrink-0 text-white/30 transition group-hover:translate-x-1 group-hover:text-purple-300">
                    <ArrowIcon />
                  </span>
                </button>
              ))}
            </div>
          )}

          {isImportStep && (
            <div className="grid gap-3 md:grid-cols-2">
              <FlowCard
                title="Importer une vidéo"
                description={`Téléversez la création ${platform?.name ?? ""} depuis votre ordinateur.`}
                badge="RECOMMANDÉ"
                icon={<UploadIcon />}
                onClick={() => selectImportMode("upload")}
              />

              <FlowCard
                title="Coller un lien"
                description={`Collez l'URL de la publicité ${platform?.name ?? ""}.`}
                badge="URL"
                icon={<LinkIcon />}
                onClick={() => selectImportMode("link")}
              />
            </div>
          )}
        </div>

        <footer className="flex flex-col gap-3 border-t border-white/10 bg-black/10 px-6 py-4 sm:flex-row sm:items-center sm:justify-between md:px-8">
          <p className="text-xs leading-5 text-white/35">
            Le moteur d&apos;analyse existant reste inchangé.
          </p>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-white/65 transition hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            Annuler
          </button>
        </footer>
      </div>
    </div>
  );
}

type FlowCardProps = {
  title: string;
  description: string;
  badge: string;
  icon: ReactNode;
  onClick: () => void;
};

function FlowCard({
  title,
  description,
  badge,
  icon,
  onClick,
}: FlowCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-52 w-full flex-col rounded-2xl border border-white/10 bg-white/[0.025] p-5 text-left transition duration-200 hover:-translate-y-0.5 hover:border-purple-400/40 hover:bg-purple-500/[0.08] focus:outline-none focus:ring-2 focus:ring-purple-400"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-purple-400/15 bg-purple-500/10 text-purple-300 transition group-hover:bg-purple-500/20">
        {icon}
      </span>

      <span className="mt-6 flex items-center gap-2">
        <span className="font-semibold text-white">{title}</span>
        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white/40">
          {badge}
        </span>
      </span>

      <span className="mt-2 block text-sm leading-6 text-white/45">
        {description}
      </span>

      <span className="mt-auto flex w-full items-center justify-between pt-6 text-sm font-medium text-purple-200">
        Continuer
        <span className="transition group-hover:translate-x-1">
          <ArrowIcon />
        </span>
      </span>
    </button>
  );
}
