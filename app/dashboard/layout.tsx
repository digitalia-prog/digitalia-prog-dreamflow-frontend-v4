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
          <main className="px-6 py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
