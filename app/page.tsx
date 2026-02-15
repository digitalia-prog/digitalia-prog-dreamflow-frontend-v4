 const COMPANY_NAME = "DreamFlow";
const PRODUCT_NAME = "DreamFlow – UGC Growth (Bêta)";
export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          UGC Agency Pro
        </h1>

        <p className="text-lg md:text-xl text-gray-400 mb-8">
          Gérez vos campagnes, créateurs et clients depuis un seul dashboard.
        </p>

        <div className="flex gap-4 justify-center">
          <a
            href="/dashboard"
            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-semibold transition"
          >
            Accéder au Dashboard
          </a>

          <a
            href="#features"
            className="border border-gray-600 hover:border-gray-400 px-6 py-3 rounded-xl transition"
          >
            Voir les fonctionnalités
          </a>
        </div>
      </div>
    </main>
  );
}
