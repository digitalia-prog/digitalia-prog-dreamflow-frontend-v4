"use client";

import { usePathname } from "next/navigation";

function titleFromPath(path: string) {
  if (path === "/dashboard") return "Overview";
  if (path.includes("/dashboard/agency")) return "Agency Dashboard";
  if (path.includes("/dashboard/creator")) return "Creator Dashboard";
  if (path.includes("/dashboard/ai")) return "Script Engine";
  if (path.includes("/dashboard/campaigns")) return "Campaigns";
  if (path.includes("/dashboard/creators")) return "Creators";
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
              className="w-[260px] rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-violet-600/40"
            />
          </div>

          <a
            href="/dashboard/campaigns"
            className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
          >
            + Nouvelle campagne
          </a>
        </div>
      </div>
    </header>
  );
}
