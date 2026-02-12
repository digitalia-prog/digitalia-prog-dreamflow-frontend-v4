export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Top gradient */}
      <div className="pointer-events-none fixed inset-0 opacity-60">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-purple-700 blur-3xl" />
        <div className="absolute top-40 right-[-120px] h-[420px] w-[420px] rounded-full bg-fuchsia-600 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
            🚀
          </span>
          <div className="font-extrabold tracking-tight">UGC Growth</div>
        </div>

        <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
          <a className="hover:text-white" href="#features">Features</a>
          <a className="hover:text-white" href="#pricing">Pricing</a>
          <a className="hover:text-white" href="/dashboard">Dashboard</a>
        </nav>

        <a
          href="/dashboard"
          className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold hover:bg-purple-500"
        >
          Open Dashboard
        </a>
      </header>

      {/* Hero */}
      <section className="relative mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 pb-16 pt-10 md:grid-cols-2 md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs text-white/70 ring-1 ring-white/10">
            <span className="text-purple-300">●</span> International UGC Agency Suite
          </div>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight md:text-5xl">
            Generate UGC scripts, manage creators, track social performance —
            <span className="text-purple-300"> all-in-one.</span>
          </h1>

          <p className="mt-5 max-w-xl text-white/70">
            Built for UGC agencies & digital marketing teams. Track platforms (TikTok/IG/YT),
            manage campaigns, creators, deliverables, and generate scripts in seconds.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/dashboard"
              className="rounded-xl bg-purple-600 px-5 py-3 font-semibold hover:bg-purple-500"
            >
              Go to Dashboard
            </a>
            <a
              href="#pricing"
              className="rounded-xl bg-white/5 px-5 py-3 font-semibold ring-1 ring-white/10 hover:bg-white/10"
            >
              See pricing
            </a>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 text-xs text-white/70">
            <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
              ✅ Multi-platform
              <div className="mt-1 text-white/50">TikTok / IG / YT</div>
            </div>
            <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
              ✅ Agency-ready
              <div className="mt-1 text-white/50">Multi-clients</div>
            </div>
            <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
              ✅ International
              <div className="mt-1 text-white/50">EN/FR-ready</div>
            </div>
          </div>
        </div>

        {/* Right card */}
        <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
          <div className="rounded-2xl bg-gradient-to-br from-black via-zinc-900 to-purple-950 p-6">
            <div className="text-sm font-semibold text-white/80">Preview</div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="text-xs text-white/60">Active clients</div>
                <div className="mt-2 text-2xl font-extrabold">12</div>
              </div>
              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="text-xs text-white/60">Live campaigns</div>
                <div className="mt-2 text-2xl font-extrabold">27</div>
              </div>
              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="text-xs text-white/60">Creators</div>
                <div className="mt-2 text-2xl font-extrabold">64</div>
              </div>
              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="text-xs text-white/60">Deliverables</div>
                <div className="mt-2 text-2xl font-extrabold">146</div>
              </div>
            </div>

            <a
              href="/dashboard"
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-purple-600 px-5 py-3 font-semibold hover:bg-purple-500"
            >
              Open dashboard →
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative mx-auto max-w-6xl px-6 pb-16">
        <h2 className="text-2xl font-extrabold">What’s inside</h2>
        <p className="mt-2 text-white/70">Everything an UGC agency needs to run at scale.</p>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            ["Social platforms", "Track TikTok/Instagram/YouTube KPIs & growth."],
            ["Campaigns", "Pipeline, briefs, status, deadlines, budget."],
            ["Creators", "Creators CRM, deliverables, performance, notes."],
            ["AI Generator", "Generate hooks, scripts, angles & variations."],
            ["International", "Ready for global clients: timezone/currency fields."],
            ["Dark + violet", "Premium UI – black base with purple accents."],
          ].map(([title, desc]) => (
            <div key={title} className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <div className="font-semibold">{title}</div>
              <div className="mt-2 text-sm text-white/70">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative mx-auto max-w-6xl px-6 pb-20">
        <h2 className="text-2xl font-extrabold">Pricing</h2>
        <p className="mt-2 text-white/70">Simple plans for creators, teams & agencies.</p>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
            <div className="text-sm font-semibold text-white/80">Starter</div>
            <div className="mt-3 text-4xl font-extrabold">0€</div>
            <div className="mt-2 text-white/60">Test the basics</div>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li>✅ Limited generations</li>
              <li>✅ Basic dashboard</li>
              <li>✅ Public templates</li>
            </ul>
          </div>

          <div className="rounded-2xl bg-white/5 p-6 ring-2 ring-purple-500">
            <div className="text-sm font-semibold text-purple-200">Pro</div>
            <div className="mt-3 text-4xl font-extrabold">69€</div>
            <div className="mt-2 text-white/60">Creators & freelancers</div>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li>✅ More generations</li>
              <li>✅ Social + campaigns</li>
              <li>✅ Export deliverables</li>
            </ul>
            <a
              href="/dashboard"
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-purple-600 px-5 py-3 font-semibold hover:bg-purple-500"
            >
              Upgrade to Pro →
            </a>
          </div>

          <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
            <div className="text-sm font-semibold text-white/80">Agency</div>
            <div className="mt-3 text-4xl font-extrabold">349€</div>
            <div className="mt-2 text-white/60">UGC agencies</div>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li>✅ Multi-clients</li>
              <li>✅ Unlimited deliverables</li>
              <li>✅ Team access</li>
            </ul>
          </div>
        </div>
      </section>

      <footer className="relative border-t border-white/10 py-10 text-center text-sm text-white/50">
        © {new Date().getFullYear()} UGC Growth — Build global, stay premium.
      </footer>
    </main>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Top gradient */}
      <div className="pointer-events-none fixed inset-0 opacity-60">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-purple-700 blur-3xl" />
        <div className="absolute top-40 right-[-120px] h-[420px] w-[420px] rounded-full bg-fuchsia-600 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
            🚀
          </span>
          <div className="font-extrabold tracking-tight">UGC Growth</div>
        </div>

        <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
          <a className="hover:text-white" href="#features">Features</a>
          <a className="hover:text-white" href="#pricing">Pricing</a>
          <a className="hover:text-white" href="/dashboard">Dashboard</a>
        </nav>

        <a
          href="/dashboard"
          className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold hover:bg-purple-500"
        >
          Open Dashboard
        </a>
      </header>

      {/* Hero */}
      <section className="relative mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 pb-16 pt-10 md:grid-cols-2 md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs text-white/70 ring-1 ring-white/10">
            <span className="text-purple-300">●</span> International UGC Agency Suite
          </div>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight md:text-5xl">
            Generate UGC scripts, manage creators, track social performance —
            <span className="text-purple-300"> all-in-one.</span>
          </h1>

          <p className="mt-5 max-w-xl text-white/70">
            Built for UGC agencies & digital marketing teams. Track platforms (TikTok/IG/YT),
            manage campaigns, creators, deliverables, and generate scripts in seconds.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/dashboard"
              className="rounded-xl bg-purple-600 px-5 py-3 font-semibold hover:bg-purple-500"
            >
              Go to Dashboard
            </a>
            <a
              href="#pricing"
              className="rounded-xl bg-white/5 px-5 py-3 font-semibold ring-1 ring-white/10 hover:bg-white/10"
            >
              See pricing
            </a>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 text-xs text-white/70">
            <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
              ✅ Multi-platform
              <div className="mt-1 text-white/50">TikTok / IG / YT</div>
            </div>
            <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
              ✅ Agency-ready
              <div className="mt-1 text-white/50">Multi-clients</div>
            </div>
            <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
              ✅ International
              <div className="mt-1 text-white/50">EN/FR-ready</div>
            </div>
          </div>
        </div>

        {/* Right card */}
        <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
          <div className="rounded-2xl bg-gradient-to-br from-black via-zinc-900 to-purple-950 p-6">
            <div className="text-sm font-semibold text-white/80">Preview</div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="text-xs text-white/60">Active clients</div>
                <div className="mt-2 text-2xl font-extrabold">12</div>
              </div>
              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="text-xs text-white/60">Live campaigns</div>
                <div className="mt-2 text-2xl font-extrabold">27</div>
              </div>
              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="text-xs text-white/60">Creators</div>
                <div className="mt-2 text-2xl font-extrabold">64</div>
              </div>
              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="text-xs text-white/60">Deliverables</div>
                <div className="mt-2 text-2xl font-extrabold">146</div>
              </div>
            </div>

            <a
              href="/dashboard"
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-purple-600 px-5 py-3 font-semibold hover:bg-purple-500"
            >
              Open dashboard →
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative mx-auto max-w-6xl px-6 pb-16">
        <h2 className="text-2xl font-extrabold">What’s inside</h2>
        <p className="mt-2 text-white/70">Everything an UGC agency needs to run at scale.</p>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            ["Social platforms", "Track TikTok/Instagram/YouTube KPIs & growth."],
            ["Campaigns", "Pipeline, briefs, status, deadlines, budget."],
            ["Creators", "Creators CRM, deliverables, performance, notes."],
            ["AI Generator", "Generate hooks, scripts, angles & variations."],
            ["International", "Ready for global clients: timezone/currency fields."],
            ["Dark + violet", "Premium UI – black base with purple accents."],
          ].map(([title, desc]) => (
            <div key={title} className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <div className="font-semibold">{title}</div>
              <div className="mt-2 text-sm text-white/70">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative mx-auto max-w-6xl px-6 pb-20">
        <h2 className="text-2xl font-extrabold">Pricing</h2>
        <p className="mt-2 text-white/70">Simple plans for creators, teams & agencies.</p>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
            <div className="text-sm font-semibold text-white/80">Starter</div>
            <div className="mt-3 text-4xl font-extrabold">0€</div>
            <div className="mt-2 text-white/60">Test the basics</div>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li>✅ Limited generations</li>
              <li>✅ Basic dashboard</li>
              <li>✅ Public templates</li>
            </ul>
          </div>

          <div className="rounded-2xl bg-white/5 p-6 ring-2 ring-purple-500">
            <div className="text-sm font-semibold text-purple-200">Pro</div>
            <div className="mt-3 text-4xl font-extrabold">69€</div>
            <div className="mt-2 text-white/60">Creators & freelancers</div>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li>✅ More generations</li>
              <li>✅ Social + campaigns</li>
              <li>✅ Export deliverables</li>
            </ul>
            <a
              href="/dashboard"
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-purple-600 px-5 py-3 font-semibold hover:bg-purple-500"
            >
              Upgrade to Pro →
            </a>
          </div>

          <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
            <div className="text-sm font-semibold text-white/80">Agency</div>
            <div className="mt-3 text-4xl font-extrabold">349€</div>
            <div className="mt-2 text-white/60">UGC agencies</div>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li>✅ Multi-clients</li>
              <li>✅ Unlimited deliverables</li>
              <li>✅ Team access</li>
            </ul>
          </div>
        </div>
      </section>

      <footer className="relative border-t border-white/10 py-10 text-center text-sm text-white/50">
        © {new Date().getFullYear()} UGC Growth — Build global, stay premium.
      </footer>
    </main>
  );
}
