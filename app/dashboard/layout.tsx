import "@/app/globals.css";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#07060A] text-white">
      <div className="flex">
        <Sidebar />

        <div className="flex-1">
          <Topbar />

          <main className="px-6 py-6">
            <div className="mb-6 rounded-lg border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-200">
              UGC Growth Beta — Certaines fonctionnalités évoluent encore pendant
              la phase bêta.
            </div>

            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
