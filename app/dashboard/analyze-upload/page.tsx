"use client";

import { useMemo, useState } from "react";

type UploadKind = "video" | "audio";

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

export default function AnalyzeUploadPage() {
  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-violet-500";

  const [uploadType, setUploadType] = useState<UploadKind>("video");
  const [platform, setPlatform] = useState("TikTok");
  const [offer, setOffer] = useState("");
  const [audience, setAudience] = useState("");
  const [extraNotes, setExtraNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AnalyzeResponse | null>(null);

  const acceptValue = useMemo(() => {
    return uploadType === "video"
      ? "video/*,.mp4,.mov,.webm,.mkv,.avi,.mpeg"
      : "audio/*,.mp3,.wav,.m4a,.mpga,.mpeg,.webm";
  }, [uploadType]);

  async function onAnalyzeUpload() {
    if (!file) {
      setError(
        uploadType === "video"
          ? "Ajoute une vidéo."
          : "Ajoute un fichier audio."
      );
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("platform", platform);
      formData.append("offer", offer);
      formData.append("audience", audience);
      formData.append("extraNotes", extraNotes);
      formData.append("uploadType", uploadType);

      const response = await fetch("/api/analyze-upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.details || data?.error || "Analyse impossible");
      }

      setResult({
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
      });
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
            Analyse upload — Vidéo / Audio
          </h1>
          <p className="text-white/60">
            Choisis un mode, importe ton fichier, puis récupère une analyse
            marketing IA complète : hook, structure, angle, psychologie,
            points forts, points faibles et brief à recréer.
          </p>
        </div>

        <Block title="Mode d’analyse">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setUploadType("video");
                setFile(null);
              }}
              className={cn(
                "rounded-xl px-4 py-3 text-sm font-semibold transition",
                uploadType === "video"
                  ? "bg-violet-600 text-white"
                  : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              Vidéo
            </button>

            <button
              type="button"
              onClick={() => {
                setUploadType("audio");
                setFile(null);
              }}
              className={cn(
                "rounded-xl px-4 py-3 text-sm font-semibold transition",
                uploadType === "audio"
                  ? "bg-violet-600 text-white"
                  : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              Audio
            </button>
          </div>

          <p className="mt-4 text-sm text-white/55">
            Mode actuel :{" "}
            <span className="font-medium text-white/80">
              {uploadType === "video" ? "Upload vidéo" : "Upload audio"}
            </span>
          </p>
        </Block>

        <div className="grid gap-6 md:grid-cols-2">
          <Block
            title={
              uploadType === "video"
                ? "Fichier vidéo"
                : "Fichier audio"
            }
          >
            <input
              key={uploadType}
              type="file"
              accept={acceptValue}
              className={inputCls}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            <div className="mt-3 text-sm text-white/50">
              {file
                ? `Fichier sélectionné : ${file.name}`
                : uploadType === "video"
                ? "Formats conseillés : .mp4, .mov, .webm"
                : "Formats conseillés : .mp3, .wav, .m4a"}
            </div>
          </Block>

          <Block title="Plateforme">
            <select
              className={inputCls}
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            >
              <option>TikTok</option>
              <option>Instagram Reels</option>
              <option>YouTube Shorts</option>
              <option>Facebook Ads</option>
              <option>Google Ads</option>
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
          onClick={onAnalyzeUpload}
          disabled={loading}
          className={cn(
            "rounded-xl px-6 py-3 font-semibold",
            loading
              ? "bg-white/10 text-white/50"
              : "bg-violet-600 hover:bg-violet-500"
          )}
        >
          {loading
            ? "Transcription + analyse..."
            : uploadType === "video"
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
