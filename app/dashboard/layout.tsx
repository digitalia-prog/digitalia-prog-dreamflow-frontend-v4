export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gradient-to-b from-purple-700 via-purple-900 to-black p-6">
        <h2 className="text-2xl font-bold mb-10">UGC Agency Pro</h2>

        <nav className="space-y-4 text-white/80">
          <a href="/dashboard/overview" className="block hover:text-white">Overview</a>
          <a href="/dashboard/social" className="block hover:text-white">Social Platforms</a>
          <a href="/dashboard/campaigns" className="block hover:text-white">Campaigns</a>
          <a href="/dashboard/creators" className="block hover:text-white">Creators</a>
          <a href="/dashboard/ai" className="block hover:text-white">AI Generator</a>
          <a href="/dashboard/settings" className="block hover:text-white">Settings</a>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-10 bg-gradient-to-br from-black via-zinc-900 to-purple-950">
        {children}
      </main>
    </div>
  );
}


