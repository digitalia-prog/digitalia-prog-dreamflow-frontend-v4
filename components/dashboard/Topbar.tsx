"use client";

import { usePathname } from "next/navigation";

function titleFromPath(path: string) {
  if (path === "/dashboard") return "Overview";
  if (path.includes("/dashboard/agency")) return "Agency Dashboard";
  if (path.includes("/dashboard/creator")) return "Creator Dashboard";
  if (path.includes("/dashboard/ai")) return "Script Engine";
  return "Dashboard";
}

export default function Topbar() {
  const pathname = usePathname();
  const title = titleFromPath(pathname);

  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-[#07060A]/70 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <div className="text-xs text-white/50">UGC Growth • SaaS</div>
          <div className="text-lg font-semibold">{title}</div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <input
              placeholder="Search..."
              className="w-[260px] rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
            />
          </div>

          <button className="rounded-xl border border-violet-500/30 bg-violet-600/10 px-3 py-2 text-sm text-violet-200 hover:bg-violet-600/20">
            + New
          </button>

          <div className="h-9 w-9 rounded-full border border-violet-500/30 bg-violet-600/20 shadow-[0_0_30px_rgba(139,92,246,0.25)]" />
        </div>
      </div>
    </header>
  );
}

