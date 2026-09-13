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
    return <>{children}</>;
  }

  // Prevent faculty from accessing admin routes
  if (session.user?.role === "FACULTY") {
    redirect("/faculty/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-inter selection:bg-primary/20 selection:text-primary">
      {/* Premium Sidebar */}
      <AdminSidebar session={session} />

      {/* Main content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 pt-20 md:pt-6 lg:pt-10">
          {children}
        </div>
      </main>
    </div>
  );
}
