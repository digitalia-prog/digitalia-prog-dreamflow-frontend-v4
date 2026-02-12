import Link from "next/link";

export default function AiPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Générateur IA</h1>
        <Link href="/dashboard" className="text-white/70 hover:text-white">
          ← Retour au dashboard
        </Link>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="text-white/70">
          Ici on remettra “les fonctions” comme ton ancien UGC Growth (réseau, objectif, livrable, contexte…).
          Pour l’instant page stable + prête à brancher l’API.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="font-semibold">Mode</p>
            <p className="mt-2 text-sm text-white/70">UGC / Ads / Hook / Script complet</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="font-semibold">Entrées</p>
            <p className="mt-2 text-sm text-white/70">Réseau, offre, objection, angle, prix…</p>
          </div>
        </div>

        <button className="mt-6 rounded-xl bg-violet-600/80 px-5 py-3 font-semibold hover:bg-violet-600">
          Générer (bientôt)
        </button>
      </div>
    </div>
  );
}

