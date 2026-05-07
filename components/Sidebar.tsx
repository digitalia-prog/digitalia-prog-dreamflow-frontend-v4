"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Analyse vidéo", href: "/dashboard/analyze-upload" },
  { label: "Script Engine", href: "/dashboard/ai" },
  { label: "Campagnes", href: "/dashboard/campaigns" },
  { label: "Agency", href: "/dashboard/agency" },
  { label: "Creator", href: "/dashboard/creator" },
  { label: "Workflow", href: "/dashboard/workflow" },
  { label: "Paramètres", href: "/dashboard/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-white/10 bg-[#0B0B12] min-h-screen p-5">
      <div className="mb-8">
        <div className="text-xs text-white/40">
          UGC Growth
        </div>

        <div className="mt-1 text-xl font-bold text-white">
          Dashboard
        </div>
      </div>

      <nav className="space-y-2">
        {links.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center rounded-xl px-4 py-3 text-sm transition ${
                active
                  ? "bg-violet-600 text-white"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
