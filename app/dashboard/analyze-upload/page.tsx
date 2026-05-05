"use client";

import { useMemo, useState } from "react";

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

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#14121c] p-5">
      <h3 className="mb-4 text-base font-semibold text-white">{title}</h3>
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
        <div
          key={`${item}-${i}`}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/85"
        >
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

  return <div className="whitespace-pre-wrap text-sm text-white/85">{value}</div>;
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

export default function AnalyzeUploadPage() {
  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-violet-500";

  const [mode, setMode] = useState<AnalyzeMode>("video_url");
  const [url, setUrl] = useState("");
  const [platform, setPlatform] = useState("TikTok");
  const [language, setLanguage] = useState("Français");
  const [offer, setOffer] = useState("");
  const [audience, setAudience] = useState("");
  const [extraNotes, setExtraNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fallbackMessage, setFallbackMessage] = useState("");
  const [result, setResult] = useState<AnalyzeResponse | null>(null);

  const uploadOnlyPlatform = isUploadOnlyPlatform(platform);

  const acceptValue = useMemo(() => {
    if (mode === "video_file") {
      return "video/*,.mp4,.mov,.webm,.mkv,.avi,.mpeg";
    }

    if (mode === "audio_file") {
      return "audio/*,.mp3,.wav,.m4a,.mpga,.mpeg,.webm";
    }

    return "";
  }, [mode]);

  async function onAnalyze() {
    setLoading(true);
    setError("");
    setFallbackMessage("");
    setResult(null);

    try {
      if (mode === "video_url") {
        if (!url.trim()) {
          throw new Error("Ajoute un lien vidéo.");
        }

        if (uploadOnlyPlatform) {
          setMode("video_file");
          setFile(null);
          setFallbackMessage(
            "Instagram non supporté via lien. Upload la vidéo."
          );
          return;
        }

        const response = await fetch("/api/analyze-video", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url,
            platform,
            language,
            offer,
            audience,
            notes: extraNotes,
          }),
        });

        const data = await response.json();

        if (data?.fallback === "upload") {
          setMode("video_file");
          setFile(null);
          setFallbackMessage(
            data?.error ||
              "Cette plateforme protège parfois l’accès direct. Importe la vidéo pour lancer une analyse complète, sans stockage."
          );
          return;
        }

        if (!response.ok) {
          throw new Error(data?.details || data?.error || "Analyse impossible");
        }

        setResult(mapResponseToResult(data));
        return;
      }

      if (!file) {
        throw new Error(
          mode === "video_file"
            ? "Ajoute un fichier vidéo."
            : "Ajoute un fichier audio."
        );
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("platform", platform);
      formData.append("language", language);
      formData.append("offer", offer);
      formData.append("audience", audience);
      formData.append("extraNotes", extraNotes);
      formData.append("uploadType", mode === "video_file" ? "video" : "audio");

      const response = await fetch("/api/analyze-upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.details || data?.error || "Analyse impossible");
      }

      setResult(mapResponseToResult(data));
    } catch (e: any) {
      setError(String(e?.message ?? e ?? "Erreur inconnue"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-2xl border border-white/10 bg-[#14121c] p-6">
          <h1 className="mb-2 text-3xl font-bold text-white">
            Analyse créative — lien vidéo / fichier vidéo / fichier audio
          </h1>
          <p className="text-white/60">
            Analyse marketing IA complète : hook, structure, angle, psychologie,
            points forts, points faibles, score viral et brief à recréer.
          </p>
        </div>

        <Block title="Mode d’analyse">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setMode("video_url");
                setFile(null);
              }}
              className={cn(
                "rounded-xl px-4 py-3 text-sm font-semibold transition",
                mode === "video_url"
                  ? "bg-violet-600 text-white"
                  : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              Lien vidéo
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("video_file");
                setFile(null);
              }}
              className={cn(
                "rounded-xl px-4 py-3 text-sm font-semibold transition",
                mode === "video_file"
                  ? "bg-violet-600 text-white"
                  : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              Fichier vidéo
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("audio_file");
                setFile(null);
              }}
              className={cn(
                "rounded-xl px-4 py-3 text-sm font-semibold transition",
                mode === "audio_file"
                  ? "bg-violet-600 text-white"
                  : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              Fichier audio
            </button>
          </div>
        </Block>

        {fallbackMessage && (
          <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">
            <div className="font-semibold">Méthode recommandée</div>
            <div className="mt-1">{fallbackMessage}</div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <Block
            title={
              mode === "video_url"
                ? "Lien vidéo"
                : mode === "video_file"
                ? "Fichier vidéo"
                : "Fichier audio"
            }
          >
            {mode === "video_url" ? (
              <input
                className={inputCls}
                placeholder="https://www.tiktok.com/... ou lien YouTube / Shorts"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            ) : (
              <>
                <input
                  key={mode}
                  type="file"
                  accept={acceptValue}
                  className={inputCls}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <div className="mt-3 text-sm text-white/50">
                  {file
                    ? `Fichier sélectionné : ${file.name}`
                    : mode === "video_file"
                    ? "Formats conseillés : .mp4, .mov, .webm"
                    : "Formats conseillés : .mp3, .wav, .m4a"}
                </div>
              </>
            )}
          </Block>

          <Block title="Plateforme">
            <select
              className={inputCls}
              value={platform}
              onChange={(e) => {
                const nextPlatform = e.target.value;
                setPlatform(nextPlatform);
                setFallbackMessage("");

                if (
                  mode === "video_url" &&
                  isUploadOnlyPlatform(nextPlatform)
                ) {
                  setMode("video_file");
                  setFile(null);
                  setFallbackMessage(
                    "Instagram non supporté via lien. Upload la vidéo."
                  );
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
          </Block>

          <Block title="Langue">
            <select
              className={inputCls}
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option>Français</option>
              <option>Anglais UK</option>
              <option>Anglais US</option>
              <option>Espagnol</option>
              <option>Arabe</option>
              <option>Chinois</option>
            </select>
          </Block>

          <Block title="Produit / Offre (optionnel)">
            <input
              className={inputCls}
              value={offer}
              onChange={(e) => setOffer(e.target.value)}
              placeholder="Ex: Coque MagSafe iPhone"
            />
          </Block>

          <Block title="Audience (optionnel)">
            <input
              className={inputCls}
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="Ex: E-commerçants débutants"
            />
          </Block>
        </div>

        <Block title="Notes complémentaires (optionnel)">
          <textarea
            className={cn(inputCls, "min-h-[140px]")}
            value={extraNotes}
            onChange={(e) => setExtraNotes(e.target.value)}
            placeholder="Ajoute ici le contexte, le type de créa, ce que tu veux analyser en priorité, l’angle marketing, etc."
          />
        </Block>

        <button
          onClick={onAnalyze}
          disabled={loading}
          className={cn(
            "rounded-xl px-6 py-3 font-semibold",
            loading
              ? "bg-white/10 text-white/50"
              : "bg-violet-600 hover:bg-violet-500"
          )}
        >
          {loading
            ? "Analyse en cours..."
            : mode === "video_url"
            ? "Analyser le lien vidéo"
            : mode === "video_file"
            ? "Analyser la vidéo"
            : "Analyser l’audio"}
        </button>

        {error && <div className="text-red-400">{error}</div>}

        {result && (
          <div className="grid gap-6 md:grid-cols-2">
            <Block title="Transcript">
              <TextBlock value={result.transcript} />
            </Block>

            <Block title="Résumé">
              <TextBlock value={result.summary} />
            </Block>

            <Block title="Hook">
              <TextBlock value={result.hook} />
            </Block>

            <Block title="Structure">
              <TextBlock value={result.structure} />
            </Block>

            <Block title="Angle">
              <TextBlock value={result.angle} />
            </Block>

            <Block title="Psychologie">
              <ListBlock items={result.psychology} />
            </Block>

            <Block title="Points forts">
              <ListBlock items={result.strengths} />
            </Block>

            <Block title="Points faibles">
              <ListBlock items={result.weaknesses} />
            </Block>

            <Block title="Idées à reproduire">
              <ListBlock items={result.recreateIdeas} />
            </Block>

            <Block title="Hooks similaires">
              <ListBlock items={result.similarHooks} />
            </Block>

            <Block title="Angles similaires">
              <ListBlock items={result.similarAngles} />
            </Block>

            <Block title="Score viral">
              <TextBlock value={result.viralScore} />
            </Block>

            <Block title="Pourquoi ça performe">
              <ListBlock items={result.whyItWorks} />
            </Block>

            <Block title="Comment battre cette créa">
              <ListBlock items={result.howToBeat} />
            </Block>

            <Block title="Angles Ads">
              <ListBlock items={result.adsAngles} />
            </Block>

            <Block title="Type de créa">
              <TextBlock value={result.creativeType} />
            </Block>

            <div className="md:col-span-2">
              <Block title="Brief pour recréer une vidéo similaire">
                <TextBlock value={result.scriptPrompt} />
              </Block>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
