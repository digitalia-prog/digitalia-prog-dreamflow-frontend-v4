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

export default function AnalyzeUploadPage() {
  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/35";

  const [uploadType, setUploadType] = useState<UploadKind>("video");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const acceptValue = useMemo(() => {
    return uploadType === "video"
      ? "video/*"
      : "audio/*";
  }, [uploadType]);

  async function onAnalyzeUpload() {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("uploadType", uploadType);

    await fetch("/api/analyze-upload", {
      method: "POST",
      body: formData,
    });

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl space-y-8">

        <Block title="Mode d'analyse">
          <div className="flex gap-4">

            <button
              onClick={() => setUploadType("video")}
              className={cn(
                "px-4 py-2 rounded-xl",
                uploadType === "video"
                  ? "bg-purple-600"
                  : "bg-white/10"
              )}
            >
              Vidéo
            </button>

            <button
              onClick={() => setUploadType("audio")}
              className={cn(
                "px-4 py-2 rounded-xl",
                uploadType === "audio"
                  ? "bg-purple-600"
                  : "bg-white/10"
              )}
            >
              Audio
            </button>

          </div>
        </Block>

        <Block title="Upload fichier">

          <input
            type="file"
            accept={acceptValue}
            className={inputCls}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

        </Block>

        <button
          onClick={onAnalyzeUpload}
          disabled={loading}
          className="bg-purple-600 px-6 py-3 rounded-xl"
        >
          {loading ? "Analyse..." : "Analyser"}
        </button>

      </div>
    </main>
  );
}
