export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Campaigns</h1>
        <p className="text-white/60 mt-1">
          No campaigns yet.
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-8">
        <h2 className="text-lg font-semibold mb-2">Create your first campaign</h2>
        <p className="text-white/60 mb-6">
          Add a campaign to start generating briefs, scripts and tracking UGC content.
        </p>

        <a
          href="/dashboard/campaigns/new"
          className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 transition"
        >
          + New campaign
        </a>
      </div>
    </div>
  );
}
