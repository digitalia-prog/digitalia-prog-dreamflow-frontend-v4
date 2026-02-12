export default function SocialPlatformsPage() {
  const rows = [
    { platform: "TikTok", followers: "11.2K", views30d: "420K", conv: "2.1%", status: "Growing" },
    { platform: "Instagram", followers: "7.8K", views30d: "180K", conv: "1.6%", status: "Stable" },
    { platform: "YouTube", followers: "1.4K", views30d: "62K", conv: "1.1%", status: "Early" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-extrabold">Plateformes sociales</h1>
      <p className="mt-2 text-white/70">
        Suivi des KPIs par réseau (international): audience, vues, conversion, tendance.
      </p>

      <div className="mt-6 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="font-semibold">Tableau Réseaux</div>
          <div className="text-xs text-white/50">Exemple — tu pourras brancher des vraies données après</div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-white/60">
              <tr>
                <th className="py-3">Réseau</th>
                <th className="py-3">Followers</th>
                <th className="py-3">Vues 30j</th>
                <th className="py-3">Conversion</th>
                <th className="py-3">Trend</th>
              </tr>
            </thead>
            <tbody className="text-white/80">
              {rows.map((r) => (
                <tr key={r.platform} className="border-t border-white/10">
                  <td className="py-3 font-semibold">{r.platform}</td>
                  <td className="py-3">{r.followers}</td>
                  <td className="py-3">{r.views30d}</td>
                  <td className="py-3">{r.conv}</td>
                  <td className="py-3">
                    <span className="rounded-full bg-purple-600/20 px-3 py-1 text-xs text-purple-200 ring-1 ring-purple-500/30">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            ["Top content angle", "Before/After + proof + offer"],
            ["Best hook style", "Problem → promise → proof"],
            ["UGC cadence", "3 posts/day per client"],
          ].map(([t, v]) => (
            <div key={t} className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
              <div className="text-xs text-white/60">{t}</div>
              <div className="mt-2 font-semibold">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

