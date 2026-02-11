export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0F0F1A] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-purple-700 to-indigo-800 p-6">
        <h2 className="text-2xl font-bold mb-10">UGC Agency Pro</h2>

        <nav className="space-y-4">
          <a href="/dashboard/overview" className="block hover:text-gray-200">Overview</a>
          <a href="/dashboard/social" className="block hover:text-gray-200">Social Platforms</a>
          <a href="/dashboard/campaigns" className="block hover:text-gray-200">Campaigns</a>
          <a href="/dashboard/creators" className="block hover:text-gray-200">Creators</a>
          <a href="/dashboard/ai" className="block hover:text-gray-200">AI Generator</a>
          <a href="/dashboard/settings" className="block hover:text-gray-200">Settings</a>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-10">
        {children}
      </main>
    </div>
  );
}

