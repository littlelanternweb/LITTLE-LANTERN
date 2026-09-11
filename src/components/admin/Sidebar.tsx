"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Calendar, Users, Briefcase, LogOut, LayoutDashboard, UserCircle, CreditCard, BarChart, Mail } from "lucide-react";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { cn } from "@/lib/utils";

export function AdminSidebar({ session }: { session: any }) {
  const pathname = usePathname();
  const role = session.user?.role;

  const links = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard, permission: PERMISSIONS.DASHBOARD_VIEW },
    { name: "Appointments", href: "/admin/appointments", icon: Calendar, permission: PERMISSIONS.APPOINTMENTS_VIEW },
    { name: "Specialists", href: "/admin/specialists", icon: Users, permission: PERMISSIONS.SPECIALISTS_VIEW },
    { name: "Customers", href: "/admin/customers", icon: UserCircle, permission: PERMISSIONS.CUSTOMERS_VIEW },
    { name: "Payments", href: "/admin/payments", icon: CreditCard, permission: PERMISSIONS.PAYMENTS_VIEW },
    { name: "Job Openings", href: "/admin/openings", icon: Briefcase, permission: PERMISSIONS.APPLICATIONS_VIEW },
    { name: "Applications", href: "/admin/jobs", icon: Users, permission: PERMISSIONS.APPLICATIONS_VIEW },
    { name: "Reports", href: "/admin/reports", icon: BarChart, permission: PERMISSIONS.REPORTS_VIEW },
    { name: "Users", href: "/admin/users", icon: Users, permission: PERMISSIONS.ADMIN_USERS_MANAGE },
    { name: "Email Settings", href: "/admin/settings/email", icon: Mail, permission: PERMISSIONS.SETTINGS_MANAGE },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-100 text-slate-600 flex-shrink-0 hidden md:flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 relative">
      <div className="p-6 border-b border-slate-100">
        <Link href="/admin" className="flex items-center gap-3 text-slate-900 group">
          <div className="relative h-10 w-10 overflow-hidden rounded-lg shadow-sm border border-slate-100 group-hover:shadow-md transition-shadow">
            <Image src="/logo.jpg" alt="Little Lantern Logo" fill className="object-cover" />
          </div>
          <div className="flex flex-col">
            <span className=" font-semibold text-lg tracking-tight leading-tight">Little Lantern</span>
            <span className="text-[11px] font-medium text-primary tracking-wider uppercase">Workspace</span>
          </div>
        </Link>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto scrollbar-hide">
        <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Main Menu</p>
        {links.map((link) => {
          if (!hasPermission(role, link.permission)) return null;
          const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/admin");
          const Icon = link.icon;
          
          return (
            <Link 
              key={link.name} 
              href={link.href} 
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-[14px] font-medium rounded-xl transition-all duration-200 group relative",
                isActive 
                  ? "bg-[#D1FAE5] text-primary shadow-sm" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#047857] rounded-r-full" />
              )}
              <Icon className={cn("w-4 h-4 transition-colors", isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-900")} /> 
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 bg-white">
        <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl bg-[#FCFBF9] border border-slate-100">
          <div className="w-10 h-10 rounded-full bg-[#E7E5E4] border border-[#D6D3D1] flex items-center justify-center text-slate-900 font-semibold text-lg shrink-0">
            {session.user?.name?.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <Link href="/admin/profile" className="font-medium text-slate-900 text-sm hover:text-primary transition-colors truncate block">{session.user?.name}</Link>
            <p className="text-[11px] uppercase tracking-wider text-primary font-semibold truncate">{role}</p>
          </div>
        </div>
        <a href="/api/auth/signout" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl text-[#78716C] hover:bg-[#FEF2F2] hover:text-[#991B1B] transition-colors border border-transparent hover:border-[#FEE2E2]">
          <LogOut className="w-4 h-4" /> Sign Out
        </a>
      </div>
    </aside>
  );
}
