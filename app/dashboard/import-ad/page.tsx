"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import AnalysisResults, { type AnalysisResult } from "./AnalysisResults";

type CapturedAd = {
  sourcePlatform?: string;
  platform?: string;
  source?: string;
  sourceUrl?: string;
  libraryId?: string;
  advertiserName?: string;
  adText?: string;
  callToAction?: string;
  landingPage?: string;
  publishedAt?: string;
  creativeUrl?: string;
  creativeType?: "video" | "image" | "unknown" | string;
  capturedAt?: string;
};

type AnalysisStatus =
  | "preparing"
  | "ready"
  | "analyzing"
  | "success"
  | "error";

function decodeUtf8Base64(value: string): string {
  const normalized = value
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .replace(/\s/g, "+");

  const binary = window.atob(normalized);

  const bytes = Uint8Array.from(binary, (character) =>
    character.charCodeAt(0)
  );

  return new TextDecoder().decode(bytes);
}

function decodePayload(payload: string | null): CapturedAd | null {
  if (!payload || typeof window === "undefined") {
    return null;
  }

  const attempts = [
    payload,
    (() => {
      try {
        return decodeURIComponent(payload);
      } catch {
        return payload;
      }
    })()
  ];

  for (const candidate of attempts) {
    try {
      const json = decodeUtf8Base64(candidate);
      const parsed = JSON.parse(json);

      if (parsed && typeof parsed === "object") {
        return parsed as CapturedAd;
      }
    } catch {
      // Essai suivant.
    }

    try {
      const parsed = JSON.parse(candidate);

      if (parsed && typeof parsed === "object") {
        return parsed as CapturedAd;
      }
    } catch {
      // Essai suivant.
    }
  }

  return null;
}

function isImageUrl(url: string): boolean {
  return /\.(png|jpe?g|webp|gif|avif)(\?|$)/i.test(url);
}

function isBlobUrl(url: string): boolean {
  return url.startsWith("blob:");
}

export default function ImportAdPage() {
  const searchParams = useSearchParams();

  const payload = searchParams.get("payload");
  const platformFromUrl = searchParams.get("platform");
  const sourceFromUrl = searchParams.get("source");

  const ad = useMemo(() => decodePayload(payload), [payload]);

const [mounted, setMounted] = useState(false);

useEffect(() => {
setMounted(true);
}, []);

  const hasStartedAutomatically = useRef(false);

  const [status, setStatus] = useState<AnalysisStatus>("preparing");
  const [message, setMessage] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const platform =
    ad?.sourcePlatform ||
    ad?.platform ||
    platformFromUrl ||
    "meta";

  const creativeUrl = ad?.creativeUrl?.trim() || "";
  const sourceUrl = ad?.sourceUrl?.trim() || "";
  const analysisUrl = creativeUrl || sourceUrl;

  const creativeIsImage =
    ad?.creativeType === "image" ||
    (creativeUrl ? isImageUrl(creativeUrl) : false);

  async function startAnalysis() {
    if (!ad) {
      setStatus("error");
      setMessage(
        "Impossible de lire les données envoyées par l’extension."
      );
      return;
    }

    if (!analysisUrl) {
      setStatus("error");
      setMessage(
        "La publicité a bien été détectée, mais aucune URL exploitable n’a été transmise."
      );
      return;
    }

    if (isBlobUrl(analysisUrl)) {
      setStatus("error");
      setMessage(
        "Meta a transmis une URL vidéo temporaire. La publicité est bien détectée, mais cette URL ne peut pas encore être analysée depuis un autre onglet."
      );
      return;
    }

    setStatus("analyzing");
    setMessage("UGC Growth prépare et analyse la publicité…");
    setAnalysisResult(null);

    try {
      const response = await fetch("/api/analyze-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url: analysisUrl,
          sourceUrl,
          sourcePlatform: platform,
          platform,
          advertiserName: ad.advertiserName || "",
          libraryId: ad.libraryId || "",
          adText: ad.adText || "",
          callToAction: ad.callToAction || "",
          landingPage: ad.landingPage || "",
          publishedAt: ad.publishedAt || "",
          creativeUrl,
          creativeType: ad.creativeType || "unknown",
          metadata: {
            source:
              ad.source ||
              sourceFromUrl ||
              "extension",
            capturedAt: ad.capturedAt || "",
            libraryId: ad.libraryId || ""
          }
        })
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.error ||
            result?.detail ||
            result?.message ||
            "L’analyse n’a pas pu être lancée."
        );
      }

      setAnalysisResult(result);
      setStatus("success");
      setMessage("La publicité a été envoyée au moteur d’analyse.");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue pendant l’analyse."
      );
    }
  }

  useEffect(() => {
    if (!ad) {
      setStatus("error");
      return;
    }

    setStatus("ready");

    if (hasStartedAutomatically.current) {
      return;
    }

    hasStartedAutomatically.current = true;

    const timeout = window.setTimeout(() => {
      void startAnalysis();
    }, 700);

    return () => {
      window.clearTimeout(timeout);
    };
    // Le lancement doit avoir lieu une seule fois après décodage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ad]);

  if (!mounted) {
return (
<main className="mx-auto flex min-h-[70vh] w-full max-w-4xl items-center px-4 py-10">
<div className="w-full rounded-3xl border border-white/10 bg-[#151526] p-7">
<p className="text-sm text-white/60">
UGC Growth prépare l'import publicitaire...
</p>
</div>
</main>
);
}

if (!ad) {
    return (
      <main className="mx-auto flex min-h-[70vh] w-full max-w-4xl items-center px-4 py-10">
        <div className="w-full rounded-3xl border border-red-500/20 bg-red-500/10 p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
            Import impossible
          </p>

          <h1 className="mt-3 text-2xl font-semibold text-white">
            Publicité introuvable
          </h1>

          <p className="mt-3 text-sm leading-6 text-white/60">
            Les données envoyées par l’extension sont absentes ou
            invalides. Recharge l’extension Chrome, retourne dans Meta Ads
            Library et clique de nouveau sur « Analyser avec UGC Growth ».
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-purple-400">
          UGC Growth · Import publicitaire
        </p>

        <h1 className="mt-3 text-3xl font-bold text-white">
          Publicité Meta détectée
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">
          Les données ont été envoyées automatiquement depuis la
          bibliothèque publicitaire.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl border border-white/10 bg-[#151526] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">
              Données capturées
            </h2>

            <span className="rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1 text-xs font-medium uppercase text-purple-200">
              {platform}
            </span>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wider text-white/35">
                Annonceur
              </p>
              <p className="mt-1 text-sm text-white">
                {ad.advertiserName || "Non détecté"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-white/35">
                ID Meta
              </p>
              <p className="mt-1 text-sm text-white">
                {ad.libraryId || "Non détecté"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-white/35">
                Appel à l’action
              </p>
              <p className="mt-1 text-sm text-white">
                {ad.callToAction || "Non détecté"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-white/35">
                Date de diffusion
              </p>
              <p className="mt-1 text-sm text-white">
                {ad.publishedAt || "Non détectée"}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs uppercase tracking-wider text-white/35">
              Texte publicitaire
            </p>

            <div className="mt-2 max-h-80 overflow-y-auto rounded-2xl border border-white/10 bg-black/15 p-4">
              <p className="whitespace-pre-wrap text-sm leading-6 text-white/70">
                {ad.adText || "Aucun texte détecté"}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-white/35">
                Landing page
              </p>

              {ad.landingPage ? (
                <a
                  href={ad.landingPage}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 block break-all text-sm text-purple-300 hover:text-purple-200"
                >
                  {ad.landingPage}
                </a>
              ) : (
                <p className="mt-1 text-sm text-white/45">
                  Non détectée
                </p>
              )}
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-white/35">
                Page source
              </p>

              {sourceUrl ? (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 block break-all text-sm text-purple-300 hover:text-purple-200"
                >
                  Ouvrir la publicité dans Meta Ads Library
                </a>
              ) : (
                <p className="mt-1 text-sm text-white/45">
                  Non détectée
                </p>
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-[#12121D] p-6">
            <h2 className="text-lg font-semibold text-white">
              Créatif détecté
            </h2>

            <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black/25">
              {creativeUrl && creativeIsImage ? (
                <img
                  src={creativeUrl}
                  alt="Créatif publicitaire détecté"
                  className="aspect-video w-full object-contain"
                />
              ) : creativeUrl ? (
                <video
                  src={creativeUrl}
                  controls
                  playsInline
                  className="aspect-video w-full object-contain"
                />
              ) : (
                <div className="flex aspect-video items-center justify-center p-6 text-center text-sm text-white/40">
                  Aucun média directement accessible.
                </div>
              )}
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-center gap-3">
                <span
                  className={`h-3 w-3 rounded-full ${
                    status === "success"
                      ? "bg-emerald-400"
                      : status === "error"
                        ? "bg-red-400"
                        : status === "analyzing"
                          ? "animate-pulse bg-purple-400"
                          : "bg-white/30"
                  }`}
                />

                <p className="text-sm font-medium text-white">
                  {status === "analyzing"
                    ? "Analyse automatique en cours"
                    : status === "success"
                      ? "Import envoyé avec succès"
                      : status === "error"
                        ? "L’analyse nécessite une vérification"
                        : "Préparation de l’import"}
                </p>
              </div>

              {message ? (
                <p className="mt-3 text-sm leading-6 text-white/60">
                  {message}
                </p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => void startAnalysis()}
              disabled={status === "analyzing"}
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-5 py-3 text-sm font-semibold text-white transition hover:from-purple-500 hover:to-fuchsia-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "analyzing"
                ? "Analyse en cours…"
                : status === "error"
                  ? "Réessayer l’analyse"
                  : "Relancer l’analyse"}
            </button>
          </div>

          {analysisResult ? (
            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5">
              <p className="text-sm font-semibold text-emerald-100">
                Réponse reçue du moteur
              </p>

              <p className="mt-2 text-sm leading-6 text-emerald-100/70">
                L’import fonctionne. Nous connecterons ensuite cette réponse
                à l’écran complet des résultats d’analyse.
              </p>
            </div>
          ) : null}
        </aside>
      </section>
      {analysisResult ? (
        <AnalysisResults
          result={analysisResult}
          fallbackCreativeType={ad.creativeType}
        />
      ) : null}

    </main>
  );
}
