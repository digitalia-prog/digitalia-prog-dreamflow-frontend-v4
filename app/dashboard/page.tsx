export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">

      <h1 className="text-3xl font-bold mb-4">
        UGC Growth Dashboard
      </h1>

      <p className="text-gray-400 mb-6 max-w-md">
        Your workspace is ready. Create your first campaign or generate your first AI script to start producing UGC content.
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
  );
}
