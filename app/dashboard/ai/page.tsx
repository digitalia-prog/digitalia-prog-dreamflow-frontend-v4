"use client";

import { useState } from "react";

export default function AIPage() {
  const [loading, setLoading] = useState(false);
  const [scripts, setScripts] = useState<any[]>([]);
  const [hookIdeas, setHookIdeas] = useState<string[]>([]);
  const [creativeAngles, setCreativeAngles] = useState<string[]>([]);
  const [testingPlanSummary, setTestingPlanSummary] = useState("");
  const [error, setError] = useState("");

  const [mode, setMode] = useState("AGENCY");
  const [lang, setLang] = useState("FR");
  const [platform, setPlatform] = useState("TikTok");
  const [objective, setObjective] = useState("Vente");
  const [audience, setAudience] = useState("");
  const [offer, setOffer] = useState("");
  const [price, setPrice] = useState("");
  const [angle, setAngle] = useState("");
  const [objection, setObjection] = useState("");
  const [hookType, setHookType] = useState("");
  const [tone, setTone] = useState("");
  const [duration, setDuration] = useState("");
  const [context, setContext] = useState("");

  const scriptsCount = mode === "AGENCY" ? 10 : 4;

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode,
          lang,
          platform,
          objective,
          audience,
          offer,
          price,
          angle,
          objection,
          hookType,
          tone,
          duration,
          context,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Generation failed");
      }

      const variants = Array.isArray(data?.variants)
        ? data.variants
        : Array.isArray(data?.parsed?.variants)
        ? data.parsed.variants
        : [];

      setScripts(variants);

      setHookIdeas(
        Array.isArray(data?.hookIdeas)
          ? data.hookIdeas
          : data?.parsed?.hookIdeas || []
      );

      setCreativeAngles(
        Array.isArray(data?.creativeAngles)
          ? data.creativeAngles
          : data?.parsed?.creativeAngles || []
      );

      setTestingPlanSummary(
        data?.testingPlanSummary ||
          data?.parsed?.testingPlanSummary ||
          ""
      );
    } catch (err: any) {
      setError(err?.message || "Une erreur est survenue");
      setScripts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0b12] text-white px-6 py-8">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[420px_1fr] gap-6">

        {/* LEFT PANEL */}
        <div className="bg-[#14121c] border border-white/10 rounded-2xl p-6 space-y-4">

          <h2 className="text-lg font-semibold">Script Engine — Agency</h2>
          <p className="text-white/60 text-sm">
            Remplis les champs → Générer = hooks, script AIDA, beats, proof,
            shotlist et CTA.
          </p>

          <select
            className="w-full bg-[#0b0b12] border border-white/10 rounded-xl p-2"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option>AGENCY</option>
            <option>CREATOR</option>
          </select>

          <select
            className="w-full bg-[#0b0b12] border border-white/10 rounded-xl p-2"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
          >
            <option>FR</option>
            <option>EN</option>
          </select>

          <input
            placeholder="Audience"
            className="w-full bg-[#0b0b12] border border-white/10 rounded-xl p-2"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
          />

          <input
            placeholder="Offre / Produit"
            className="w-full bg-[#0b0b12] border border-white/10 rounded-xl p-2"
            value={offer}
            onChange={(e) => setOffer(e.target.value)}
          />

          <input
            placeholder="Prix"
            className="w-full bg-[#0b0b12] border border-white/10 rounded-xl p-2"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <textarea
            placeholder="Angle marketing"
            className="w-full bg-[#0b0b12] border border-white/10 rounded-xl p-2"
            value={angle}
            onChange={(e) => setAngle(e.target.value)}
          />

          <textarea
            placeholder="Objection principale"
            className="w-full bg-[#0b0b12] border border-white/10 rounded-xl p-2"
            value={objection}
            onChange={(e) => setObjection(e.target.value)}
          />

          <button
            onClick={handleGenerate}
            className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-xl py-3 font-semibold"
          >
            {loading ? "Génération..." : `Générer ${scriptsCount} scripts`}
          </button>

          {error && (
            <div className="text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="space-y-6">

          {/* HOOKS */}
          <div className="bg-[#14121c] border border-white/10 rounded-2xl p-6">
            <h3 className="font-semibold mb-3">Hooks générés</h3>
            {hookIdeas.length ? (
              hookIdeas.map((h, i) => (
                <div key={i} className="text-white/80 text-sm mb-2">
                  • {h}
                </div>
              ))
            ) : (
              <div className="text-white/40">-</div>
            )}
          </div>

          {/* ANGLES */}
          <div className="bg-[#14121c] border border-white/10 rounded-2xl p-6">
            <h3 className="font-semibold mb-3">Angles créatifs</h3>
            {creativeAngles.length ? (
              creativeAngles.map((a, i) => (
                <div key={i} className="text-white/80 text-sm mb-2">
                  • {a}
                </div>
              ))
            ) : (
              <div className="text-white/40">-</div>
            )}
          </div>

          {/* TEST PLAN */}
          <div className="bg-[#14121c] border border-white/10 rounded-2xl p-6">
            <h3 className="font-semibold mb-3">Plan de test global</h3>
            <div className="text-white/80 text-sm">
              {testingPlanSummary || "-"}
            </div>
          </div>

          {/* SCRIPTS */}
          <div className="bg-[#14121c] border border-white/10 rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Scripts générés</h3>

            {scripts.length ? (
              scripts.map((s, i) => (
                <div
                  key={i}
                  className="bg-[#0b0b12] border border-white/10 rounded-xl p-4 mb-4"
                >
                  <div className="text-sm text-white/50 mb-2">
                    Script {i + 1}
                  </div>

                  <div className="text-violet-400 font-semibold mb-2">
                    {s?.hook}
                  </div>

                  <div className="text-white/80 text-sm space-y-2">
                    <div>{s?.script?.aida?.attention}</div>
                    <div>{s?.script?.aida?.interest}</div>
                    <div>{s?.script?.aida?.desire}</div>
                    <div>{s?.script?.aida?.action}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-white/40">-</div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
