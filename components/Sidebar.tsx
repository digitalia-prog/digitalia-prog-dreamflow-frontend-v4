"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard/agency", label: "Agency" },
  { href: "/dashboard/creator", label: "Creator" },
  { href: "/dashboard/ai", label: "Script Engine" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="min-h-screen w-64 border-r border-white/10 bg-[#0B0812] p-6 text-white">
      <div className="mb-6">
        <div className="text-sm text-white/60">UGC</div>
        <div className="text-xl font-semibold">Growth Hub</div>
      </div>

      <nav className="flex flex-col gap-2">
        {items.map((it) => {
          const active = pathname === it.href;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={[
                "rounded-lg px-3 py-2 text-sm transition",
                active
                  ? "bg-violet-600/20 text-violet-200 border border-violet-600/30"
                  : "text-white/75 hover:bg-white/5 hover:text-white",
              ].join(" ")}
            >
              {it.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
