"use client";

import { useState } from "react";

export default function AiPage() {
  const [offer, setOffer] = useState("");
  const [audience, setAudience] = useState("");
  const [pain, setPain] = useState("");
  const [generated, setGenerated] = useState("");

  const handleGenerate = () => {
    const o = offer || "ton produit / service";
    const a = audience || "ton audience";
    const p = pain || "leur problème";

    setGenerated(
      [
        `HOOK: Stop. Si tu es ${a}, tu fais sûrement ça…`,
        ``,
        `PROBLÈME: ${p}`,
        `SOLUTION: Voilà comment ${o} règle ça simplement.`,
        `PREUVE: Résultats / avis / avant-après.`,
        `CTA: DM "GO" / lien bio / commente "INFO".`,
      ].join("\n")
    );
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-semibold text-white">Script Engine</h1>
        <p className="mt-2 text-sm text-white/70">
          Remplis 2-3 champs puis clique sur “Générer Script”.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
        <div>
          <div className="mb-2 text-xs text-white/55">Offre</div>
          <input
            value={offer}
            onChange={(e) => setOffer(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/40"
            placeholder="Ex: Formation UGC"
          />
        </div>

        <div>
          <div className="mb-2 text-xs text-white/55">Audience</div>
          <input
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/40"
            placeholder="Ex: créateurs débutants"
          />
        </div>

        <div>
          <div className="mb-2 text-xs text-white/55">Problème</div>
          <input
            value={pain}
            onChange={(e) => setPain(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/40"
            placeholder="Ex: pas de clients"
          />
        </div>
      </div>

      <button
        onClick={handleGenerate}
        className="w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-700"
      >
        Générer Script
      </button>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm font-semibold mb-3">Script généré</div>
        <pre className="whitespace-pre-wrap rounded-xl border border-white/10 bg-black/25 p-4 text-sm text-white/80">
          {generated || "Ton script apparaîtra ici..."}
        </pre>
      </div>
    </div>
  );
}
