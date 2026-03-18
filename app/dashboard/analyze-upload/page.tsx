"use client";

import { useState } from "react";

type UploadApiResponse = {
  error?: string;
  details?: string;
  transcript?: string;
  summary?: string;
  hook?: string;
  structure?: string;
  angle?: string;
  psychology?: string;
  strengths?: string;
  weaknesses?: string;
  ideas?: string;
  similarHooks?: string;
  similarAngles?: string;
  recreationBrief?: string;
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

function TextValue({ value }: { value?: string }) {
  return (
    <div className="whitespace-pre-wrap text-sm text-white/85">
      {typeof value === "string" && value.trim() ? value : "-"}
    </div>
  );
}

export default function AnalyzeUploadPage() {
  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-violet-500";

  const [platform, setPlatform] = useState("TikTok");
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<UploadApiResponse | null>(null);

  async function onAnalyzeUpload() {
    if (!file) {
      setError("Ajoute un fichier vidéo ou audio.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("platform", platform);
      formData.append("product", product);
      formData.append("audience", audience);
      formData.append("notes", notes);

      const response = await fetch("/api/analyze-upload", {
        method: "POST",
        body: formData,
      });

      const text = await response.text();

      let data: UploadApiResponse = {};
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(text || "Réponse serveur invalide");
      }

      if (!response.ok) {
        throw new Error(data?.details || data?.error || "Analyse impossible");
      }

      setResult({
        transcript:
          typeof data?.transcript === "string" ? data.transcript : "-",
        summary: typeof data?.summary === "string" ? data.summary : "-",
        hook: typeof data?.hook === "string" ? data.hook : "-",
        structure: typeof data?.structure === "string" ? data.structure : "-",
        angle: typeof data?.angle === "string" ? data.angle : "-",
        psychology:
          typeof data?.psychology === "string" ? data.psychology : "-",
        strengths: typeof data?.strengths === "string" ? data.strengths : "-",
        weaknesses:
          typeof data?.weaknesses === "string" ? data.weaknesses : "-",
        ideas: typeof data?.ideas === "string" ? data.ideas : "-",
        similarHooks:
          typeof data?.similarHooks === "string" ? data.similarHooks : "-",
        similarAngles:
          typeof data?.similarAngles === "string" ? data.similarAngles : "-",
        recreationBrief:
          typeof data?.recreationBrief === "string"
            ? data.recreationBrief
            : "-",
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
            Analyse vidéo upload — Ads / UGC
          </h1>
          <p className="text-white/60">
            Uploade une vidéo ou un audio. L’app transcrit le contenu puis
            génère une vraie analyse marketing.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Block title="Fichier vidéo / audio">
            <input
              type="file"
              accept="video/*,audio/*,.mp3,.mp4,.m4a,.wav,.webm,.mpeg,.mpga,.ogg,.mov"
              className={inputCls}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
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
              value={product}
              onChange={(e) => setProduct(e.target.value)}
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
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tu peux ajouter ici le contexte, le type de vidéo, ou ce que tu veux analyser en priorité."
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
          {loading ? "Analyse en cours..." : "Analyser le fichier"}
        </button>

        {error && <div className="text-red-400">{error}</div>}

        {result && (
          <div className="grid gap-6 md:grid-cols-2">
            <Block title="Transcript">
              <TextValue value={result.transcript} />
            </Block>

            <Block title="Résumé">
              <TextValue value={result.summary} />
            </Block>

            <Block title="Hook">
              <TextValue value={result.hook} />
            </Block>

            <Block title="Structure">
              <TextValue value={result.structure} />
            </Block>

            <Block title="Angle">
              <TextValue value={result.angle} />
            </Block>

            <Block title="Psychologie">
              <TextValue value={result.psychology} />
            </Block>

            <Block title="Points forts">
              <TextValue value={result.strengths} />
            </Block>

            <Block title="Points faibles">
              <TextValue value={result.weaknesses} />
            </Block>

            <Block title="Idées à reproduire">
              <TextValue value={result.ideas} />
            </Block>

            <Block title="Hooks similaires">
              <TextValue value={result.similarHooks} />
            </Block>

            <Block title="Angles similaires">
              <TextValue value={result.similarAngles} />
            </Block>

            <div className="md:col-span-2">
              <Block title="Brief pour recréer une vidéo similaire">
                <TextValue value={result.recreationBrief} />
              </Block>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
