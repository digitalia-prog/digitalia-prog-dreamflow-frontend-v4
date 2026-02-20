export default function DashboardPage() {
  const kpis = [
    { label: "Views (7d)", value: "1.28M", delta: "+14.2%" },
    { label: "Leads", value: "4,210", delta: "+6.1%" },
    { label: "UGC Posted", value: "86", delta: "+9.8%" },
    { label: "Cost / Video", value: "€32", delta: "-4.0%" },
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            <div className="text-sm text-white/55">{k.label}</div>
            <div className="mt-2 flex items-end justify-between">
              <div className="text-3xl font-semibold">{k.value}</div>
              <div className="rounded-lg border border-violet-500/25 bg-violet-600/10 px-2 py-1 text-xs text-violet-200">
                {k.delta}
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/55">Performance</div>
          <div className="text-lg font-semibold">Growth (placeholder)</div>
          <div className="mt-5 h-[260px] rounded-xl border border-white/10 bg-black/20" />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/55">Focus</div>
          <div className="text-lg font-semibold">Plan d’action</div>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>• 10 hooks par niche</li>
            <li>• 3 scripts courts</li>
            <li>• 1 UGC/jour</li>
            <li>• Analyse saves/CTR</li>
          </ul>
          <button className="mt-5 w-full rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold hover:bg-violet-700">
            Create tasks
          </button>
        </div>
      </section>
    </div>
  );
}
