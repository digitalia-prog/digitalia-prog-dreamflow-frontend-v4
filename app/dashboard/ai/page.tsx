"use client";

import { useState } from "react";

export default function AiPage() {
  const [generated, setGenerated] = useState("");

  const handleGenerate = () => {
    setGenerated(`
HOOK: Stop. Si tu fais encore ça, tu perds des résultats.

PROBLÈME: pas de vues, pas de clients.

SOLUTION: montre ton produit clairement et rapidement.

OFFRE: ton produit / service.

PREUVE: résultats, avis clients, chiffres.

CTA: DM "GO" / lien bio / commente "INFO".
    `);
  };

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">Script Engine</h1>

      {/* PARAMÈTRES */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Paramètres</h2>

        <input
          className="w-full rounded-lg bg-black/30 border border-white/10 p-2"
          placeholder="Ton produit / service"
        />

        <input
          className="w-full rounded-lg bg-black/30 border border-white/10 p-2"
          placeholder="Audience cible"
        />

        <input
          className="w-full rounded-lg bg-black/30 border border-white/10 p-2"
          placeholder="Problème principal"
        />
      </div>

      {/* BOUTON GENERATEUR */}
      <button
        onClick={handleGenerate}
        className="w-full rounded-xl bg-violet-600 px-4 py-3 font-semibold hover:bg-violet-700"
      >
        Générer Script
      </button>

      {/* SCRIPT */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-semibold mb-3">Script généré</h2>

        <pre className="whitespace-pre-wrap text-sm text-white/80">
          {generated || "Ton script apparaîtra ici..."}
        </pre>
      </div>

    </div>
  );
}=
