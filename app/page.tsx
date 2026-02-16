import Link from "next/link";

export const metadata = {
  title: "UGC GROWTH",
  description: "Dashboard UGC + scripts IA + workflow en un seul outil.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <header className="mx-auto max-w-6xl px-6 py-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-600/80" />
          <div className="leading-tight">
            <div className="font-semibold">UGC GROWTH</div>
            <div className="text-xs text-white/60">Beta</div>
          </div>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <a href="#features" className="text-white/70 hover:text-white">Fonctionnalités</a>
          <a href="#pricing" className="text-white/70 hover:text-white">Prix bêta</a>
          <Link href="/terms" className="text-white/70 hover:text-white">CGU</Link>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 md:p-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs text-white/70">
            <span className="h-2 w-2 rounded-full bg-purple-500" />
            Version bêta — accès sur devis
          </div>

          <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight">
            UGC GROWTH
          </h1>

          <p className="mt-4 max-w-2xl text-white/70 md:text-lg">
            La plateforme simple pour gérer vos campagnes UGC, créateurs et clients depuis un seul dashboard.
            Génération de scripts + organisation workflow.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/dashboard"
              className="rounded-xl bg-purple-600 px-6 py-3 font-semibold hover:bg-purple-700"
            >
              Accéder au Dashboard
            </Link>
            <a
              href="#features"
              className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-white/80 hover:text-white hover:border-white/40"
            >
              Voir les fonctionnalités
            </a>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <Stat title="Scripts IA" value="10 scripts / 5 min" />
            <Stat title="Workflow" value="Notion • Sheets • Drive" />
            <Stat title="Gain de temps" value="2–6h / semaine" />
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="text-2xl md:text-3xl font-bold">Fonctionnalités clés</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Card title="Campagnes">
            Suivi, pipeline, livrables et reporting client.
          </Card>
          <Card title="Créateurs / UGC">
            Casting, scoring et suivi livrables.
          </Card>
          <Card title="Scripts IA">
            Hooks, scripts, CTA et angles par niche.
          </Card>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-2xl md:text-3xl font-bold">Prix bêta</h2>
        <p className="mt-2 text-white/70">En bêta : on vend sur devis (Stripe non obligatoire).</p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <PriceCard title="Starter" price="Sur devis" note="Freelance / CM / créateurs UGC">
            <li>Dashboard</li>
            <li>Scripts IA</li>
            <li>Liens workflow</li>
          </PriceCard>

          <PriceCard title="Pro" price="Sur devis" note="Petites équipes">
            <li>Tout Starter</li>
            <li>Templates + process</li>
            <li>Support prioritaire bêta</li>
          </PriceCard>

          <PriceCard title="Agency" price="Sur devis" note="Agences">
            <li>Tout Pro</li>
            <li>Multi-clients</li>
            <li>Onboarding + setup workflow</li>
          </PriceCard>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 py-10 text-sm text-white/60">
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6">
          <div>© {new Date().getFullYear()} UGC GROWTH</div>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-white">Conditions générales</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <div className="text-sm text-white/60">{title}</div>
      <div className="mt-2 text-lg font-semibold">{value}</div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="font-semibold">{title}</div>
      <div className="mt-2 text-white/70">{children}</div>
    </div>
  );
}

function PriceCard({
  title,
  price,
  note,
  children,
}: {
  title: string;
  price: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-baseline justify-between">
        <div className="text-lg font-semibold">{title}</div>
        <div className="text-purple-300 font-semibold">{price}</div>
      </div>
      <div className="mt-2 text-sm text-white/60">{note}</div>
      <ul className="mt-4 space-y-2 text-white/75 list-disc pl-5">{children}</ul>
    </div>
  );
}
