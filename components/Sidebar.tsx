"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", label: "Aperçu" },
  { href: "/dashboard/agency", label: "Campagnes" },
  { href: "/dashboard/creator", label: "Créateurs" },
  { href: "/dashboard/ai", label: "Générateur d’IA" },
  { href: "/settings", label: "Paramètres" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 h-screen w-[280px] border-r border-white/10 bg-gradient-to-b from-violet-700/30 via-[#0B0812] to-[#07060A]">
      <div className="p-5">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_0_40px_rgba(139,92,246,0.18)]">
          <div className="text-xs text-violet-200/90">UGC</div>
          <div className="text-xl font-semibold">Agency Pro</div>
          <div className="mt-1 text-xs text-white/50">Dashboard SaaS</div>
        </div>

        <nav className="mt-6 space-y-1">
          {items.map((it) => {
            const active = pathname === it.href;
            return (
              <Link
                key={it.href}
                href={it.href}
                className={[
                  "block rounded-xl px-3 py-2.5 text-sm transition",
                  active
                    ? "border border-violet-500/30 bg-violet-600/15 text-violet-100 shadow-[0_0_25px_rgba(139,92,246,0.18)]"
                    : "text-white/75 hover:bg-white/5 hover:text-white",
                ].join(" ")}
              >
                {it.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs text-white/60">This week</div>
          <div className="mt-1 text-sm font-semibold">Hook testing sprint</div>
          <div className="mt-2 text-xs text-white/55">10 hooks • 3 scripts • repurpose</div>
        </div>
      </div>
    </aside>
  );
}

