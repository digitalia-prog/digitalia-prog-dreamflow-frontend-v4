export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Campagnes</h1>
        <p className="text-white/60 mt-1">Aucune campagne pour le moment.</p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-8">
        <h2 className="text-lg font-semibold mb-2">
          Crée ta première campagne
        </h2>

        <p className="text-white/60 mb-6">
          Ajoute une campagne pour générer des briefs, des scripts IA et suivre tes
          contenus UGC.
        </p>

        <a
          href="/dashboard/campaigns"
          className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 transition"
        >
          + Nouvelle campagne
        </a>
      </div>
    </div>
  );
}
