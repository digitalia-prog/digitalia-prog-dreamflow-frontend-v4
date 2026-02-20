"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen p-6 bg-[#0B0812] text-white border-r border-white/10">
      <h2 className="text-2xl font-bold mb-6">UGC Growth</h2>

      <nav className="flex flex-col gap-4 text-white/80">
        <Link href="/dashboard/agency" className="hover:text-violet-200">
          Agency Dashboard
        </Link>

        <Link href="/dashboard/creator" className="hover:text-violet-200">
          Creator Dashboard
        </Link>

        <Link href="/dashboard/ai" className="hover:text-violet-200">
          Script Engine
        </Link>
      </nav>
    </aside>
  );
}
