export default function CreatorDashboardPage() {
  return (
    <main className="p-6 md:p-10 text-white">
      <div className="mb-8">
        <p className="text-sm text-white/50">UGC Growth • SaaS</p>
        <h1 className="text-3xl font-bold mt-1">Creator Dashboard</h1>
        <p className="text-white/60 mt-2">
          Gérez vos scripts, vos contenus et votre workflow créateur depuis un seul espace.
        </p>
      </div>

      {/* KPI CARDS */}
      <section className="grid gap-4 md:grid-cols-3 mb-8">
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-white/50">Scripts générés</p>
          <h2 className="text-2xl font-bold mt-2">24</h2>
          <p className="text-xs text-white/40 mt-1">7 derniers jours</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-white/50">Campagnes actives</p>
          <h2 className="text-2xl font-bold mt-2">3</h2>
          <p className="text-xs text-white/40 mt-1">En cours</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-white/50">Performance moyenne</p>
          <h2 className="text-2xl font-bold mt-2">+18%</h2>
          <p className="text-xs text-white/40 mt-1">Engagement estimé</p>
        </div>
      </section>

      {/* RECENT SCRIPTS */}
      <section className="rounded-xl border border-white/10 bg-white/5 p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Derniers scripts générés</h3>

        <div className="space-y-3">
          <div className="rounded-lg border border-white/10 bg-black/20 p-4">
            <p className="font-medium">Hook viral skincare</p>
            <p className="text-sm text-white/60">Structure HOOK • STORY • CTA</p>
          </div>

          <div className="rounded-lg border border-white/10 bg-black/20 p-4">
            <p className="font-medium">UGC produit beauté</p>
            <p className="text-sm text-white/60">Angle émotionnel + preuve sociale</p>
          </div>

          <div className="rounded-lg border border-white/10 bg-black/20 p-4">
            <p className="font-medium">Script conversion agence</p>
            <p className="text-sm text-white/60">Version courte TikTok / Reels</p>
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-semibold mb-4">Workflow créateur</h3>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-white/10 bg-black/20 p-4">
            <p className="font-semibold">1️⃣ Brief</p>
            <p className="text-sm text-white/60 mt-1">
              Définis objectif, niche et angle marketing.
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-black/20 p-4">
            <p className="font-semibold">2️⃣ Génération IA</p>
            <p className="text-sm text-white/60 mt-1">
              Scripts structurés prêts à tourner.
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-black/20 p-4">
            <p className="font-semibold">3️⃣ Publication</p>
            <p className="text-sm text-white/60 mt-1">
              Validation et diffusion sur plateformes sociales.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
