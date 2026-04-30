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
  fallback?: string;
};

function cn(...v: (string | false | null | undefined)[]) {
  return v.filter(Boolean).join(" ");
}

export default function AnalyzeUploadPage() {
  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none";

  const [mode, setMode] = useState<AnalyzeMode>("video_url");
  const [url, setUrl] = useState("");
  const [platform, setPlatform] = useState("TikTok");
  const [language, setLanguage] = useState("Français");
  const [offer, setOffer] = useState("");
  const [audience, setAudience] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fallbackMessage, setFallbackMessage] = useState("");
  const [result, setResult] = useState<AnalyzeResponse | null>(null);

  const acceptValue = useMemo(() => {
    if (mode === "video_file") return "video/*";
    if (mode === "audio_file") return "audio/*";
    return "";
  }, [mode]);

  async function onAnalyze() {
    setLoading(true);
    setError("");
    setResult(null);
    setFallbackMessage("");

    try {
      // 🔥 MODE URL
      if (mode === "video_url") {
        const res = await fetch("/api/analyze-video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url,
            platform,
            language,
            offer,
            audience,
            notes,
          }),
        });

        const data = await res.json();

        // 🔥 FALLBACK AUTO (IMPORTANT)
        if (data?.fallback === "upload") {
          setMode("video_file");
          setFallbackMessage(
            "⚠️ Cette plateforme bloque l'analyse par lien. Upload la vidéo pour continuer."
          );
          return;
        }

        if (!res.ok) throw new Error(data.error);

        setResult(data);
        return;
      }

      // 🔥 MODE UPLOAD
      if (!file) throw new Error("Ajoute un fichier");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("platform", platform);
      formData.append("language", language);
      formData.append("product", offer);
      formData.append("audience", audience);
      formData.append("notes", notes);

      const res = await fetch("/api/analyze-upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-10 text-white">
      <h1 className="text-3xl font-bold mb-6">Analyse vidéo IA</h1>

      {/* MODE */}
      <div className="flex gap-3 mb-6">
        <button onClick={() => setMode("video_url")}>Lien</button>
        <button onClick={() => setMode("video_file")}>Upload vidéo</button>
        <button onClick={() => setMode("audio_file")}>Upload audio</button>
      </div>

      {/* INPUT */}
      {mode === "video_url" ? (
        <input
          className={inputCls}
          placeholder="Lien TikTok / YouTube / Reels"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      ) : (
        <input
          type="file"
          accept={acceptValue}
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      )}

      {/* FALLBACK MESSAGE */}
      {fallbackMessage && (
        <div className="mt-4 text-yellow-400">{fallbackMessage}</div>
      )}

      {/* BUTTON */}
      <button onClick={onAnalyze} className="mt-6 bg-purple-600 px-6 py-3">
        {loading ? "Analyse..." : "Analyser"}
      </button>

      {/* ERROR */}
      {error && <div className="text-red-500 mt-4">{error}</div>}

      {/* RESULT */}
      {result && (
        <div className="mt-10 space-y-4">
          <div>Transcript: {result.transcript}</div>
          <div>Hook: {result.hook}</div>
          <div>Angle: {result.angle}</div>
        </div>
      )}
    </main>
  );
}
