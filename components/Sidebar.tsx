"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Aperçu", href: "/dashboard/agency" },
  { label: "Clients", href: "/dashboard/agency/clients" },
  { label: "Plateformes sociales", href: "/dashboard/socials" },
  { label: "Campagnes", href: "/dashboard/agency" },
  { label: "Créateurs", href: "/dashboard/creator" },
  { label: "Générateur d'IA", href: "/dashboard/ai" },
  { label: "Analyse vidéo", href: "/dashboard/analyze-upload" },
  { label: "Paramètres", href: "/dashboard/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[280px] shrink-0">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
        <div className="px-2 py-3">
          <div className="text-xl font-semibold text-white/90">Agency Pro</div>
          <div className="text-sm text-white/60">Dashboard SaaS</div>
        </div>

        <nav className="mt-4 space-y-2">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "block rounded-2xl px-4 py-3 text-sm transition",
                  isActive
                    ? "bg-purple-600/40 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="text-xs text-white/60">This week</div>
          <div className="mt-1 text-lg font-semibold text-white/90">
            Hook testing sprint
          </div>
          <div className="mt-1 text-sm text-white/60">
            10 hooks • 3 scripts • repurpose
          </div>
        </div>
      </div>
    </aside>
  );
}
