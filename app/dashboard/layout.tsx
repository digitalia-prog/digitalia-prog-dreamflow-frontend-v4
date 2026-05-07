import type { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#0B0B12] text-white">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
}
