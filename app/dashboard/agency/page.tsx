export default function AgencyPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm text-white/55">Agency</div>
        <div className="text-2xl font-semibold">Campagnes</div>
        <div className="mt-2 text-sm text-white/70">
          Ici on mettra le pipeline (brief → creators → scripts → tournage → montage → publié).
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {["Brief", "En production", "Publié"].map((col) => (
          <div key={col} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm font-semibold">{col}</div>
            <div className="mt-3 h-[220px] rounded-xl border border-white/10 bg-black/20" />
          </div>
        ))}
      </div>
    </div>
  );
}=
