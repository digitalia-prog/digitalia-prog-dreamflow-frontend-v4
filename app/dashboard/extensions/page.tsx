const platforms = [
  ["Meta", "Stable", "Meta Ads Library", "https://www.facebook.com/ads/library/", "Analyse des publicités depuis Meta Ads Library."],
  ["TikTok", "Stable", "TikTok Creative Center", "https://ads.tiktok.com/creative/creativeCenter/trends?region=france", "Import direct depuis TikTok Creative Center."],
  ["YouTube", "Stable", "YouTube", "https://www.youtube.com/", "Analyse vidéo et Shorts avec transcription audio."],
  ["Instagram", "Beta", "Instagram", "https://www.instagram.com/", "Posts image pris en charge. Certains Reels restent bloqués."],
];

export default function ExtensionsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-7">
      <header>
        <div className="mb-3 inline-flex rounded-full border border-violet-400/15 bg-violet-500/[0.08] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-300">
          Browser Intelligence
        </div>
        <h1 className="text-3xl font-bold tracking-[-0.035em] text-white md:text-4xl">Extensions</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
          Capturez une créa directement depuis sa plateforme et envoyez-la vers UGC Growth.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {platforms.map(([name, status, action, href, description]) => (
          <article key={name} className="rounded-[24px] border border-white/[0.07] bg-white/[0.025] p-5">
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/10 text-sm font-black text-violet-300">{name[0]}</span>
              <span className={`rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] ${status === "Beta" ? "border-amber-400/10 bg-amber-400/[0.07] text-amber-300" : "border-emerald-400/10 bg-emerald-400/[0.07] text-emerald-300"}`}>
                {status}
              </span>
            </div>
            <h2 className="mt-5 text-base font-semibold text-white">{name}</h2>
            <p className="mt-2 min-h-[60px] text-xs leading-5 text-white/38">{description}</p>
            <a href={href} target="_blank" rel="noreferrer" className="mt-5 inline-flex text-xs font-semibold text-violet-300 hover:text-violet-200">
              Ouvrir {action} →
            </a>
          </article>
        ))}
      </section>

      <section className="grid gap-3 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[26px] border border-white/[0.07] bg-white/[0.022] p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">Workflow extension</p>
          <h2 className="mt-3 text-xl font-semibold text-white">De la plateforme à l’analyse en un clic.</h2>
          <div className="mt-5 grid gap-2 sm:grid-cols-4">
            {[
              ["01","Ouvrir"],["02","Repérer"],["03","Analyser"],["04","Exploiter"]
            ].map(([step,label]) => (
              <div key={step} className="rounded-2xl border border-white/[0.055] bg-black/[0.12] p-3.5">
                <div className="text-[10px] font-bold text-violet-300/60">{step}</div>
                <div className="mt-2 text-xs font-semibold text-white/70">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[26px] border border-violet-400/10 bg-gradient-to-br from-violet-500/[0.08] to-fuchsia-500/[0.025] p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-300/55">Beta privée</p>
          <h2 className="mt-3 text-lg font-semibold text-white">Une seule extension, plusieurs plateformes.</h2>
          <p className="mt-2 text-xs leading-5 text-white/35">
            Meta, TikTok et YouTube sont stables. Instagram reste en beta sur certains Reels.
          </p>
        </div>
      </section>
    </div>
  );
}
