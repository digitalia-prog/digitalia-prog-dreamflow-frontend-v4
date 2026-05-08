export default function AgencyPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-purple-400/20 bg-gradient-to-br from-purple-600/20 via-white/5 to-black/20 p-6">
        <div className="text-sm text-white/60">UGC Growth • Agency</div>

        <h1 className="mt-2 text-3xl font-bold text-white">
          Agency Dashboard
        </h1>

        <p className="mt-2 max-w-3xl text-white/70">
          Pilote tes campagnes UGC : analyse, brief, scripts, créateurs,
          production et publication.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <a
          href="/dashboard/analyze-upload"
          className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-violet-500/40"
        >
          <h2 className="text-xl font-semibold">Analyser une vidéo</h2>
          <p className="mt-2 text-sm text-white/60">
            Trouve les hooks, angles et structures qui fonctionnent.
          </p>
        </a>

        <a
          href="/dashboard/ai"
          className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-violet-500/40"
        >
          <h2 className="text-xl font-semibold">Générer 10 scripts</h2>
          <p className="mt-2 text-sm text-white/60">
            Transforme une offre en scripts prêts à tester.
          </p>
        </a>

        <a
          href="/dashboard/campaigns"
          className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-violet-500/40"
        >
          <h2 className="text-xl font-semibold">Campagnes</h2>
          <p className="mt-2 text-sm text-white/60">
            Organise les idées, briefs et prochaines actions.
          </p>
        </a>
      </div>
    </div>
  );
}
