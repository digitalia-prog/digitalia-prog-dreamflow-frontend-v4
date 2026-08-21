import type { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-[#08080d] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-[-180px] h-[420px] w-[420px] rounded-full bg-violet-700/[0.08] blur-[110px]" />
        <div className="absolute right-[-160px] top-[22%] h-[360px] w-[360px] rounded-full bg-fuchsia-700/[0.045] blur-[120px]" />
      </div>

      <div className="relative flex min-h-screen">
        <Sidebar />

        <main className="min-w-0 flex-1 px-4 pb-28 pt-[88px] sm:px-6 lg:px-8 lg:pb-10 lg:pt-8 xl:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
