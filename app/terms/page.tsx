import Link from "next/link";

export const metadata = {
  title: "Conditions Générales — UGC GROWTH",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-white/70 hover:text-white underline underline-offset-4">
          ← Retour
        </Link>

        <h1 className="mt-6 text-3xl md:text-4xl font-bold">Conditions Générales (Bêta)</h1>

        <p className="mt-3 text-white/70">
          UGC GROWTH est proposé en version bêta. Certaines fonctionnalités peuvent évoluer.
        </p>

        <div className="mt-8 space-y-6 text-white/80 leading-relaxed">
          <section>
            <h2 className="font-semibold text-white">1) Accès & utilisation</h2>
            <p>
              Accès réservé aux utilisateurs autorisés. Toute utilisation abusive (scraping, multi-comptes,
              contournement) peut entraîner une suspension.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-white">2) Contenus générés</h2>
            <p>
              Les scripts générés sont fournis “tels quels”. L’utilisateur reste responsable de la vérification
              (conformité, droits, claims, etc.).
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-white">3) Sécurité & anti-scam</h2>
            <p>
              Nous mettons en place des protections (limites, logs, alertes). Toute tentative de fraude ou d’attaque
              est interdite.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-white">4) Support</h2>
            <p>Support en mode bêta : prioritaire aux retours et aux bugs bloquants.</p>
          </section>

          <section>
            <h2 className="font-semibold text-white">5) Modifications</h2>
            <p>Les présentes CGU peuvent être mises à jour à tout moment.</p>
          </section>

          <section>
            <h2 className="font-semibold text-white">6) Paiement</h2>
            <p>En bêta : paiement sur devis. Stripe n’est pas obligatoire tant que tu fais du “sur devis”.</p>
          </section>
        </div>

        <p className="mt-10 text-xs text-white/50">
          Dernière mise à jour : {new Date().toLocaleDateString()} — © {new Date().getFullYear()} UGC GROWTH
        </p>
      </div>
    </main>
  );
}


=
