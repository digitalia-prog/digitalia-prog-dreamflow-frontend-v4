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
            <div className="bg-purple-600/20 border border-purple-500/40 text-purple-300 text-sm px-4 py-2 rounded-lg mb-6">
              Mode Démo — Les données affichées sont des exemples pour illustrer la
              plateforme.
            </div>

            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
