import Link from "next/link";

const COMPANY_NAME = "DreamFlow";
const PRODUCT_NAME = "UGC GROWTH";

export const metadata = {
  title: `${PRODUCT_NAME} — Dashboard UGC + scripts IA`,
  description:
    "Plateforme UGC: dashboard, scripts IA, et liens de workflow (Notion/Sheets/Drive) depuis un seul endroit.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="max-w-4xl w-full text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 text-sm text-white/70 mb-6">
          <span className="h-2 w-2 rounded-full bg-purple-500" />
          Bêta privée • accès limité
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          {PRODUCT_NAME}
        </h1>

        <p className="mt-5 text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
          Centralise tes campagnes UGC, créateurs, clients et scripts IA depuis un seul dashboard.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-semibold"
          >
            Accéder au Dashboard
          </Link>

          <a
            href="#features"
            className="border border-white/20 hover:border-white/35 px-6 py-3 rounded-xl font-semibold text-white/90"
          >
            Voir les fonctionnalités
          </a>
        </div>

        <section id="features" className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="font-semibold mb-1">Scripts IA</div>
            <div className="text-white/70 text-sm">
              Hooks, scripts, CTA, variantes par réseau + localisation.
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="font-semibold mb-1">Dashboard UGC</div>
            <div className="text-white/70 text-sm">
              Vue campagnes, créateurs, livrables et organisation agence.
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="font-semibold mb-1">Workflow</div>
            <div className="text-white/70 text-sm">
              Branche tes liens Notion, Google Sheets et Drive/Dropbox dans les paramètres.
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <div className="text-sm text-white/60">Offre bêta</div>
              <div className="text-xl font-bold">{PRODUCT_NAME} — Prix bêta</div>
              <div className="text-white/70 text-sm mt-1">
                Bêta = accès anticipé + set up workflow + démo. Paiement sur devis (pour l’instant).
              </div>
            </div>

            <Link
              href="/terms"
              className="text-sm text-white/80 hover:text-white underline underline-offset-4"
            >
              Voir les Conditions Générales
            </Link>
          </div>
        </section>

        <footer className="mt-10 text-center text-xs text-white/50">
          © {new Date().getFullYear()} {COMPANY_NAME} • {PRODUCT_NAME}
        </footer>
      </div>
    </main>
  );
}

