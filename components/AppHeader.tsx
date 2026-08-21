"use client";

import { usePathname } from "next/navigation";

export default function AppHeader() {
  const pathname = usePathname();

  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <header className="w-full flex items-center justify-end px-6 py-3 bg-zinc-950 border-b border-zinc-800">
    </header>
  );
}
