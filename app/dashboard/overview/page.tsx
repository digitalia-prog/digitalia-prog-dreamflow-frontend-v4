export default function OverviewPage() {
  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold">
        UGC Growth Dashboard
      </h1>

      <div className="bg-[#1A1A2E] p-8 rounded-xl border border-white/10">

        <h2 className="text-xl font-semibold mb-3">
          Welcome to UGC Growth
        </h2>

        <p className="text-gray-400 mb-6">
          Your dashboard is ready. Start by creating your first campaign or generating your first AI script.
        </p>

        <div className="flex gap-4">

          <a
            href="/dashboard/campaigns"
            className="px-5 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 transition"
          >
            Create campaign
          </a>

          <a
            href="/dashboard/ai"
            className="px-5 py-3 rounded-lg border border-white/20 hover:bg-white/10 transition"
          >
            Generate AI script
          </a>

        </div>

      </div>

    </div>
  );
}
