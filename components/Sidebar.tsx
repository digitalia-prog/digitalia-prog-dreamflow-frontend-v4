"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { label: string; href: string };

const NAV: Item[] = [
  { label: "Aperçu", href: "/dashboard" },
  { label: "Plateformes sociales", href: "/dashboard/socials" },
  { label: "Campagnes", href: "/dashboard/agency" },
  { label: "Créateurs", href: "/dashboard/creator" },
  { label: "Générateur d'IA", href: "/dashboard/ai" },
  { label: "Paramètres", href: "/dashboard/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 min-h-screen border-r border-white/10 bg-gradient-to-b from-violet-700/40 via-violet-900/10 to-black/40">
      <div className="p-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs uppercase tracking-widest text-white/70">
            UGC
          </div>
          <div className="mt-1 text-2xl font-semibold">Agency Pro</div>
          <div className="mt-1 text-sm text-white/60">Dashboard SaaS</div>
        </div>
      </div>

      <nav className="px-4 space-y-2">
        {NAV.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "block rounded-xl px-4 py-3 text-sm font-medium transition",
                active
                  ? "bg-violet-600/35 ring-1 ring-violet-400/40 text-white"
                  : "text-white/80 hover:bg-white/5 hover:text-white",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs text-white/60">This week</div>
          <div className="mt-1 text-lg font-semibold">Hook testing sprint</div>
          <div className="mt-1 text-sm text-white/60">
            10 hooks • 3 scripts • repurpose
          </div>
        </div>
      </div>
    </aside>
  );
}
