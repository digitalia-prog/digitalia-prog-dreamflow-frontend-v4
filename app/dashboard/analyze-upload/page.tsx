"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type AnalyzeMode = "video_url" | "video_file" | "audio_file";

type AnalyzeResponse = {
  transcript?: string;
  summary?: string;
  hook?: string;
  structure?: string;
  angle?: string;
  psychology?: string[];
  strengths?: string[];
  weaknesses?: string[];
  recreateIdeas?: string[];
  similarHooks?: string[];
  similarAngles?: string[];
  scriptPrompt?: string;
  viralScore?: string;
  whyItWorks?: string[];
  howToBeat?: string[];
  adsAngles?: string[];
  creativeType?: string;
  error?: string;
  details?: string;
};

function cn(...v: (string | false | null | undefined)[]) {
  return v.filter(Boolean).join(" ");
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[22px] border border-white/[0.07] bg-white/[0.025] p-5 shadow-[0_16px_50px_rgba(0,0,0,0.12)]">
      <h3 className="mb-4 text-sm font-semibold tracking-[-0.015em] text-white">{title}</h3>
      {children}
    </div>
  );
}

function ListBlock({ items }: { items?: string[] }) {
  if (!Array.isArray(items) || items.length === 0) {
    return <div className="text-white/40">-</div>;
  }
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={`${item}-${i}`} className="rounded-2xl border border-white/[0.06] bg-black/[0.12] px-3.5 py-3 text-sm leading-6 text-white/75">
          • {item}
        </div>
      ))}
    </div>
  );
}

function TextBlock({ value }: { value?: string }) {
  if (!value || !value.trim()) {
    return <div className="text-sm text-white/40">-</div>;
  }
  return <div className="whitespace-pre-wrap text-sm leading-6 text-white/72">{value}</div>;
}

function isUploadOnlyPlatform(platform: string) {
  return ["Instagram Reels", "Facebook Ads", "Google Ads"].includes(platform);
}

function mapResponseToResult(data: any): AnalyzeResponse {
  return {
    transcript: data?.transcript,
    summary: data?.summary,
    hook: data?.hook,
    structure: data?.structure,
    angle: data?.angle,
    psychology: Array.isArray(data?.psychology) ? data.psychology : [],
    strengths: Array.isArray(data?.strengths) ? data.strengths : [],
    weaknesses: Array.isArray(data?.weaknesses) ? data.weaknesses : [],
    recreateIdeas: Array.isArray(data?.recreateIdeas) ? data.recreateIdeas : [],
    similarHooks: Array.isArray(data?.similarHooks) ? data.similarHooks : [],
    similarAngles: Array.isArray(data?.similarAngles) ? data.similarAngles : [],
    scriptPrompt: data?.scriptPrompt,
    viralScore: data?.viralScore,
    whyItWorks: Array.isArray(data?.whyItWorks) ? data.whyItWorks : [],
    howToBeat: Array.isArray(data?.howToBeat) ? data.howToBeat : [],
    adsAngles: Array.isArray(data?.adsAngles) ? data.adsAngles : [],
    creativeType: data?.creativeType,
  };
}

function modeFromQuery(value: string | null): AnalyzeMode | null {
  if (value === "url" || value === "video_url") return "video_url";
  if (value === "video" || value === "video_file") return "video_file";
  if (value === "audio" || value === "audio_file") return "audio_file";
  return null;
}

export default function AnalyzeUploadPage() {
  const searchParams = useSearchParams();
  const inputCls = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-violet-500";

  const [mode, setMode] = useState<AnalyzeMode>("video_url");
  const [url, setUrl] = useState("");
  const [platform, setPlatform] = useState("TikTok");
  const [language, setLanguage] = useState("Français");
  const [offer, setOffer] = useState("");
  const [audience, setAudience] = useState("");
  const [extraNotes, setExtraNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fallbackMessage, setFallbackMessage] = useState("");
  const [result, setResult] = useState<AnalyzeResponse | null>(null);

  useEffect(() => {
    const queryMode = modeFromQuery(searchParams.get("mode"));
    if (queryMode) {
      setMode(queryMode);
      setFile(null);
      setError("");
      setFallbackMessage("");
    }
  }, [searchParams]);

  const uploadOnlyPlatform = isUploadOnlyPlatform(platform);

  const acceptValue = useMemo(() => {
    if (mode === "video_file") return "video/*,.mp4,.mov,.webm,.mkv,.avi,.mpeg";
    if (mode === "audio_file") return "audio/*,.mp3,.wav,.m4a,.mpga,.mpeg,.webm";
    return "";
  }, [mode]);

  const pageTitle = mode === "video_url" ? "Analysez une publicité depuis son URL" : mode === "video_file" ? "Importez une vidéo à analyser" : "Importez un audio à analyser";
  const pageDescription = mode === "video_url"
    ? "Collez un lien TikTok ou YouTube. UGC Growth détecte le hook, la structure, la psychologie et les angles marketing."
    : mode === "video_file"
    ? "Déposez une publicité ou une vidéo. UGC Growth la transcrit puis génère une analyse créative complète."
    : "Déposez une interview, un podcast ou un fichier audio. UGC Growth le transforme en recommandations exploitables.";

  async function onAnalyze() {
    const parseApiResponse = async (response: Response) => {
      const raw = await response.text();

      if (!raw.trim()) {
        if (!response.ok) throw new Error(`Erreur serveur (${response.status}).`);
        return {};
      }

      try {
        return JSON.parse(raw);
      } catch {
        const compact = raw.replace(/\s+/g, " ").trim();
        const payloadTooLarge =
          response.status === 413 ||
          /request entity too large|payload too large|function_payload_too_large/i.test(compact);

        if (payloadTooLarge) {
          throw new Error(
            "Fichier trop volumineux pour l’upload direct en production. La requête dépasse la limite d’upload de l’hébergement. Utilise un fichier plus léger ou un lien vidéo pendant qu’on active le flux gros fichiers."
          );
        }

        const preview = compact.slice(0, 180);
        throw new Error(
          response.ok
            ? "Le serveur a renvoyé une réponse illisible."
            : `Erreur serveur (${response.status})${preview ? ` : ${preview}` : "."}`
        );
      }
    };

    setLoading(true);
    setError("");
    setFallbackMessage("");
    setResult(null);

    try {
      if (mode === "video_url") {
        if (!url.trim()) throw new Error("Ajoute un lien vidéo.");
        if (uploadOnlyPlatform) {
          setMode("video_file");
          setFile(null);
          setFallbackMessage("Instagram non supporté via lien. Upload la vidéo.");
          return;
        }

        const response = await fetch("/api/analyze-video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, platform, language, offer, audience, notes: extraNotes }),
        });

        const data = await parseApiResponse(response);
        if (data?.fallback === "upload") {
          setMode("video_file");
          setFile(null);
          setFallbackMessage(data?.error || "Cette plateforme protège parfois l’accès direct. Importe la vidéo pour lancer une analyse complète, sans stockage.");
          return;
        }
        if (!response.ok) throw new Error(data?.details || data?.error || "Analyse impossible");
        setResult(mapResponseToResult(data));
        return;
      }

      if (!file) {
        throw new Error(mode === "video_file" ? "Ajoute un fichier vidéo." : "Ajoute un fichier audio.");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("platform", platform);
      formData.append("language", language);
      formData.append("offer", offer);
      formData.append("audience", audience);
      formData.append("extraNotes", extraNotes);
      formData.append("uploadType", mode === "video_file" ? "video" : "audio");

      const response = await fetch("/api/analyze-upload", { method: "POST", body: formData });
      const data = await parseApiResponse(response);
      if (!response.ok) throw new Error(data?.details || data?.error || "Analyse impossible");
      setResult(mapResponseToResult(data));
    } catch (e: any) {
      setError(String(e?.message ?? e ?? "Erreur inconnue"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="text-white">
      <div className="mx-auto w-full max-w-7xl space-y-7">
        <section className="overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#101018] shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
          <div className="border-b border-white/[0.06] bg-gradient-to-br from-violet-600/[0.12] via-fuchsia-500/[0.04] to-transparent px-6 py-7 sm:px-8 sm:py-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/15 bg-violet-500/[0.08] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-300">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_9px_rgba(139,92,246,0.8)]" /> Creative Intelligence · Analyse
            </div>
            <h1 className="max-w-3xl text-3xl font-bold tracking-[-0.035em] text-white sm:text-4xl">{pageTitle}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/42 sm:text-[15px]">{pageDescription}</p>
          </div>

          <div className="p-5 sm:p-7">
            {fallbackMessage && (
              <div className="mb-6 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">
                <div className="font-semibold">Méthode recommandée</div>
                <div className="mt-1">{fallbackMessage}</div>
              </div>
            )}

            <div className="rounded-[24px] border border-white/[0.07] bg-black/[0.14] p-5 sm:p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold tracking-[-0.02em] text-white">{mode === "video_url" ? "URL de la publicité" : mode === "video_file" ? "Fichier vidéo" : "Fichier audio"}</h2>
                  <p className="mt-1 text-xs leading-5 text-white/30">{mode === "video_url" ? "TikTok, YouTube ou Shorts." : mode === "video_file" ? "Formats conseillés : MP4, MOV ou WEBM." : "Formats conseillés : MP3, WAV ou M4A."}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(["video_url", "video_file", "audio_file"] as AnalyzeMode[]).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setMode(item);
                        setFile(null);
                        setFallbackMessage("");
                      }}
                      className={cn(
                        "rounded-xl border px-3 py-2 text-xs font-semibold transition",
                        mode === item ? "border-violet-400/20 bg-violet-500/15 text-violet-200" : "border-white/[0.06] bg-white/[0.025] text-white/40 hover:bg-white/[0.05] hover:text-white/75"
                      )}
                    >
                      {item === "video_url" ? "URL" : item === "video_file" ? "Vidéo" : "Audio"}
                    </button>
                  ))}
                </div>
              </div>

              {mode === "video_url" ? (
                <input className={inputCls} placeholder="Collez un lien TikTok, YouTube ou Shorts..." value={url} onChange={(e) => setUrl(e.target.value)} />
              ) : (
                <label className="group block cursor-pointer rounded-[24px] border border-dashed border-white/[0.10] bg-black/[0.12] p-9 text-center transition hover:border-violet-400/25 hover:bg-violet-500/[0.025]">
                  <input key={mode} type="file" accept={acceptValue} className="sr-only" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] border border-violet-400/10 bg-violet-500/10 text-xl text-violet-200 transition group-hover:scale-105">{mode === "video_file" ? "▶" : "♪"}</div>
                  <div className="mt-4 font-semibold text-white">{file ? file.name : mode === "video_file" ? "Cliquez pour sélectionner une vidéo" : "Cliquez pour sélectionner un fichier audio"}</div>
                  <div className="mt-2 text-sm text-white/45">{file ? "Le fichier est prêt pour l’analyse." : mode === "video_file" ? "MP4, MOV, WEBM, MKV, AVI ou MPEG" : "MP3, WAV, M4A, MPGA, MPEG ou WEBM"}</div>
                </label>
              )}
            </div>

            <div className="mt-5 overflow-hidden rounded-[24px] border border-white/[0.07] bg-white/[0.018]">
              <button type="button" onClick={() => setShowAdvanced((current) => !current)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-white/[0.02]">
                <div>
                  <div className="text-sm font-semibold text-white/80">Options avancées</div>
                  <div className="mt-1 text-xs text-white/28">Plateforme, langue, produit, audience et notes.</div>
                </div>
                <span className={cn("text-xl text-white/50 transition-transform", showAdvanced && "rotate-180")}>⌄</span>
              </button>

              {showAdvanced && (
                <div className="border-t border-white/[0.06] p-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-white/80">Plateforme</label>
                      <select
                        className={inputCls}
                        value={platform}
                        onChange={(e) => {
                          const nextPlatform = e.target.value;
                          setPlatform(nextPlatform);
                          setFallbackMessage("");
                          if (mode === "video_url" && isUploadOnlyPlatform(nextPlatform)) {
                            setMode("video_file");
                            setFile(null);
                            setFallbackMessage("Instagram non supporté via lien. Upload la vidéo.");
                          }
                        }}
                      >
                        <option>TikTok</option>
                        <option>Instagram Reels</option>
                        <option>YouTube Shorts</option>
                        <option>YouTube</option>
                        <option>Facebook Ads</option>
                        <option>Google Ads</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-white/80">Langue</label>
                      <select className={inputCls} value={language} onChange={(e) => setLanguage(e.target.value)}>
                        <option>Français</option>
                        <option>Anglais UK</option>
                        <option>Anglais US</option>
                        <option>Espagnol</option>
                        <option>Arabe</option>
                        <option>Chinois</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-white/80">Produit analysé (optionnel)</label>
                      <input className={inputCls} value={offer} onChange={(e) => setOffer(e.target.value)} placeholder="Ex : Coque MagSafe iPhone" />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-white/80">Audience cible (optionnel)</label>
                      <input className={inputCls} value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Ex : E-commerçants débutants" />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-semibold text-white/80">Notes complémentaires (optionnel)</label>
                      <textarea className={cn(inputCls, "min-h-[120px] resize-y")} value={extraNotes} onChange={(e) => setExtraNotes(e.target.value)} placeholder="Ajoute le contexte, le type de créa, ce que tu veux analyser en priorité ou l’angle marketing." />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {error && <div className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</div>}

            <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {[
                "Hook + angle",
                "Psychologie",
                "Forces + faiblesses",
                "Comment la battre",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-2xl border border-white/[0.055] bg-white/[0.018] px-3 py-2.5 text-[10px] font-medium text-white/35"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-400/70" />
                  {item}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={onAnalyze}
              disabled={loading}
              className={cn(
                "mt-6 flex min-h-14 w-full items-center justify-center rounded-2xl px-6 py-4 text-sm font-bold transition",
                loading ? "cursor-not-allowed border border-white/[0.06] bg-white/[0.04] text-white/30" : "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-[0_16px_38px_rgba(109,40,217,0.22)] hover:-translate-y-0.5 hover:from-violet-500 hover:to-fuchsia-500"
              )}
            >
              {loading ? "Analyse en cours..." : mode === "video_url" ? "Lancer l’analyse de l’URL" : mode === "video_file" ? "Lancer l’analyse de la vidéo" : "Lancer l’analyse de l’audio"}
            </button>

            <p className="mt-3 text-center text-[10px] text-white/22">Votre contenu est utilisé uniquement pour générer l’analyse.</p>
          </div>
        </section>

        {result && (
          <section className="space-y-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-300/55">
                Creative Intelligence
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">
                Résultats de l&apos;analyse
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
            <Block title="Transcript"><TextBlock value={result.transcript} /></Block>
            <Block title="Résumé"><TextBlock value={result.summary} /></Block>
            <Block title="Hook"><TextBlock value={result.hook} /></Block>
            <Block title="Structure"><TextBlock value={result.structure} /></Block>
            <Block title="Angle"><TextBlock value={result.angle} /></Block>
            <Block title="Psychologie"><ListBlock items={result.psychology} /></Block>
            <Block title="Points forts"><ListBlock items={result.strengths} /></Block>
            <Block title="Points faibles"><ListBlock items={result.weaknesses} /></Block>
            <Block title="Idées à reproduire"><ListBlock items={result.recreateIdeas} /></Block>
            <Block title="Hooks similaires"><ListBlock items={result.similarHooks} /></Block>
            <Block title="Angles similaires"><ListBlock items={result.similarAngles} /></Block>
            <Block title="Score viral"><TextBlock value={result.viralScore} /></Block>
            <Block title="Pourquoi ça performe"><ListBlock items={result.whyItWorks} /></Block>
            <Block title="Comment battre cette créa"><ListBlock items={result.howToBeat} /></Block>
            <Block title="Angles Ads"><ListBlock items={result.adsAngles} /></Block>
            <Block title="Type de créa"><TextBlock value={result.creativeType} /></Block>
            <div className="md:col-span-2"><Block title="Brief pour recréer une vidéo similaire"><TextBlock value={result.scriptPrompt} /></Block></div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
