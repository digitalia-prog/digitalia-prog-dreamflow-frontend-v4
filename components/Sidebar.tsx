"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type IconName =
  | "home"
  | "sparkles"
  | "wand"
  | "media"
  | "campaign"
  | "agency"
  | "creator"
  | "settings";

type NavItem = {
  label: string;
  shortLabel?: string;
  href: string;
  icon: IconName;
};

const primaryLinks: NavItem[] = [
  { label: "Dashboard", shortLabel: "Accueil", href: "/dashboard/overview", icon: "home" },
  { label: "Analyse créative", shortLabel: "Analyser", href: "/dashboard/analyze-upload", icon: "sparkles" },
  { label: "Script Engine", shortLabel: "Scripts", href: "/dashboard/ai", icon: "wand" },
  { label: "Media Engine", shortLabel: "Media", href: "/dashboard/media", icon: "media" },
];

const workspaceLinks: NavItem[] = [
  { label: "Campagnes", href: "/dashboard/campaigns", icon: "campaign" },
  { label: "Agency", href: "/dashboard/agency", icon: "agency" },
  { label: "Creator", href: "/dashboard/creator", icon: "creator" },
];

const settingsLink: NavItem = {
  label: "Paramètres",
  shortLabel: "Réglages",
  href: "/dashboard/settings",
  icon: "settings",
};

function isActivePath(pathname: string, href: string) {
  if (href === "/dashboard/overview") {
    return pathname === "/dashboard" || pathname === "/dashboard/overview";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavIcon({
  name,
  className = "h-[18px] w-[18px]",
}: {
  name: IconName;
  className?: string;
}) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const paths: Record<IconName, ReactNode> = {
    home: (
      <>
        <path d="M3.5 10.7 12 3.8l8.5 6.9" />
        <path d="M5.8 9.8V20h12.4V9.8" />
        <path d="M9.3 20v-5.8h5.4V20" />
      </>
    ),
    sparkles: (
      <>
        <path d="M12 3 13.5 7.5 18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" />
        <path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" />
        <path d="m5 14 .7 2.3L8 17l-2.3.7L5 20l-.7-2.3L2 17l2.3-.7L5 14Z" />
      </>
    ),
    wand: (
      <>
        <path d="m4 20 11.5-11.5" />
        <path d="m13.5 6.5 4 4" />
        <path d="M18.5 3v3M20 4.5h-3" />
        <path d="M5 7V4M3.5 5.5h3" />
        <path d="M19 17v4M17 19h4" />
      </>
    ),
    media: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="3" />
        <path d="m10 8 6 4-6 4V8Z" />
      </>
    ),
    campaign: (
      <>
        <path d="M4 13V9l12-4v12L4 13Z" />
        <path d="M8 14.3 9.5 20H6l-1.7-6.6" />
        <path d="M19 8.5v5" />
      </>
    ),
    agency: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2M10 21v-3h4v3" />
      </>
    ),
    creator: (
      <>
        <circle cx="12" cy="8" r="3" />
        <path d="M5 20c.8-4 3.1-6 7-6s6.2 2 7 6" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...common}>
      {paths[name]}
    </svg>
  );
}

function DesktopLink({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string;
}) {
  const active = isActivePath(pathname, item.href);

  return (
    <Link
      href={item.href}
      className={`group relative flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-white/[0.09] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)]"
          : "text-white/50 hover:bg-white/[0.045] hover:text-white/90"
      }`}
    >
      {active ? (
        <span className="absolute left-0 h-6 w-[3px] rounded-r-full bg-gradient-to-b from-violet-400 to-fuchsia-500 shadow-[0_0_14px_rgba(139,92,246,0.8)]" />
      ) : null}

      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition ${
          active
            ? "bg-violet-500/15 text-violet-300"
            : "bg-white/[0.035] text-white/45 group-hover:text-white/75"
        }`}
      >
        <NavIcon name={item.icon} />
      </span>

      <span className="truncate">{item.label}</span>
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-[272px] shrink-0 border-r border-white/[0.07] bg-[#09090f]/95 px-4 py-5 backdrop-blur-xl lg:flex lg:flex-col">
        <Link href="/dashboard/overview" className="mb-7 flex items-center gap-3 px-2">
          <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-600 shadow-[0_10px_35px_rgba(124,58,237,0.32)]">
            <span className="absolute inset-[1px] rounded-[15px] bg-white/[0.08]" />
            <span className="relative text-sm font-black tracking-tight text-white">UG</span>
          </span>

          <span className="min-w-0">
            <span className="block truncate text-[15px] font-semibold tracking-[-0.02em] text-white">
              UGC Growth
            </span>
            <span className="mt-0.5 block text-[11px] font-medium uppercase tracking-[0.16em] text-violet-300/70">
              Creative OS
            </span>
          </span>
        </Link>

        <Link
          href="/dashboard/analyze-upload"
          className="mb-6 flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(109,40,217,0.24)] transition hover:-translate-y-0.5 hover:from-violet-500 hover:to-fuchsia-500"
        >
          <NavIcon name="sparkles" className="h-[17px] w-[17px]" />
          Nouvelle analyse
        </Link>

        <div className="flex-1 overflow-y-auto pr-1">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.19em] text-white/25">
            Intelligence
          </p>

          <nav className="space-y-1">
            {primaryLinks.map((item) => (
              <DesktopLink key={item.href} item={item} pathname={pathname} />
            ))}
          </nav>

          <div className="my-5 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.19em] text-white/25">
            Workspace
          </p>

          <nav className="space-y-1">
            {workspaceLinks.map((item) => (
              <DesktopLink key={item.href} item={item} pathname={pathname} />
            ))}
          </nav>
        </div>

        <div className="mt-5 border-t border-white/[0.07] pt-4">
          <DesktopLink item={settingsLink} pathname={pathname} />

          <div className="mt-3 rounded-2xl border border-violet-400/10 bg-gradient-to-br from-violet-500/[0.08] to-fuchsia-500/[0.03] p-3.5">
            <div className="flex items-center gap-2 text-xs font-medium text-white/65">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_9px_rgba(52,211,153,0.75)]" />
              Intelligence Engine
            </div>
            <p className="mt-1.5 text-[11px] leading-4 text-white/30">
              Analyse, psychologie et génération réunies.
            </p>
          </div>
        </div>
      </aside>

      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex h-[68px] items-center justify-between border-b border-white/[0.07] bg-[#09090f]/85 px-4 backdrop-blur-2xl lg:hidden">
        <Link href="/dashboard/overview" className="pointer-events-auto flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-[14px] bg-gradient-to-br from-violet-500 to-fuchsia-600 text-xs font-black text-white shadow-[0_8px_25px_rgba(124,58,237,0.3)]">
            UG
          </span>

          <span>
            <span className="block text-sm font-semibold tracking-[-0.02em] text-white">
              UGC Growth
            </span>
            <span className="block text-[9px] font-medium uppercase tracking-[0.16em] text-violet-300/60">
              Creative OS
            </span>
          </span>
        </Link>

        <Link
          href="/dashboard/analyze-upload"
          aria-label="Nouvelle analyse"
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-[14px] border border-violet-300/20 bg-violet-500/15 text-violet-200 shadow-[0_8px_25px_rgba(109,40,217,0.18)]"
        >
          <NavIcon name="sparkles" className="h-[18px] w-[18px]" />
        </Link>
      </div>

      <nav className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-5 rounded-[24px] border border-white/[0.09] bg-[#0d0d16]/92 p-1.5 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-2xl lg:hidden">
        {[...primaryLinks, settingsLink].map((item) => {
          const active = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-[18px] px-1 py-2 text-[9px] font-medium transition ${
                active ? "bg-white/[0.08] text-violet-200" : "text-white/35"
              }`}
            >
              {active ? (
                <span className="absolute top-1 h-0.5 w-5 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.9)]" />
              ) : null}

              <NavIcon name={item.icon} className="h-[19px] w-[19px]" />
              <span className="max-w-full truncate">{item.shortLabel || item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
