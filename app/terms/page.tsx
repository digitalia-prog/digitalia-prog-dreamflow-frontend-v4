export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">

      {/* Language switch */}
      <div className="absolute top-6 right-6 flex gap-2 text-sm">
        <a href="/?lang=fr" className="px-3 py-1 rounded-full border border-white/20 hover:border-white/40">FR</a>
        <a href="/?lang=en" className="px-3 py-1 rounded-full border border-white/20 hover:border-white/40">EN</a>
      </div>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">
          Conditions Générales (Bêta)
        </h1>

        <p className="text-white/70 mb-6">
          UGC GROWTH est proposé en version bêta.
        </p>

        <section className="mb-6">
          <h2 className="font-semibold text-white mb-2">1) Accès</h2>
          <p className="text-white/70">
            Accès limité aux utilisateurs autorisés.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-semibold text-white mb-2">2) Responsabilité</h2>
          <p className="text-white/70">
            Les scripts générés doivent être relus avant utilisation.
          </p>
        </section>

        <p className="mt-10 text-xs text-white/50">
          © {new Date().getFullYear()} UGC GROWTH
        </p>
      </div>

    </main>
  );
}

