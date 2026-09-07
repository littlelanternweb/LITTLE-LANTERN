import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Users, Briefcase, Settings, LogOut, LayoutDashboard, UserCircle, CreditCard, BarChart } from "lucide-react";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { AdminSidebar } from "@/components/admin/Sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    // If not logged in, but we are on /admin/login, that's fine.
    // We'll handle this in a middleware or page component, but for simplicity:
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-inter selection:bg-primary/20 selection:text-primary">
      {/* Premium Sidebar */}
      <AdminSidebar session={session} />

      {/* Main content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile header placeholder */}
        <header className="md:hidden bg-white border-b border-slate-100 p-4 flex items-center justify-between shadow-sm z-10">
           <span className=" font-semibold text-lg text-slate-900">Little Lantern Admin</span>
           <a href="/api/auth/signout" className="text-slate-400 hover:text-slate-900"><LogOut className="w-5 h-5" /></a>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
