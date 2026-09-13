"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogOut, Calendar, User, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function FacultySidebar({ session }: { session: any }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <>
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <Link href="/faculty/dashboard" className="flex items-center gap-3 text-slate-900 group" onClick={() => setMobileOpen(false)}>
          <div className="relative h-10 w-10 overflow-hidden rounded-lg shadow-sm border border-slate-100 group-hover:shadow-md transition-shadow">
            <Image src="/logo.jpg" alt="Little Lantern Logo" fill className="object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-lg tracking-tight leading-tight">Little Lantern</span>
            <span className="text-[11px] font-medium text-emerald-600 tracking-wider uppercase">Faculty Portal</span>
          </div>
        </Link>
        <button onClick={() => setMobileOpen(false)} className="md:hidden p-2 text-slate-500 hover:text-slate-900 bg-slate-100 rounded-full">
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto scrollbar-hide">
        <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Menu</p>
        
        <Link 
          href="/faculty/dashboard" 
          onClick={() => setMobileOpen(false)}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group font-medium",
            pathname === "/faculty/dashboard" 
              ? "bg-[#D1FAE5] text-[#047857] shadow-sm"
              : "hover:bg-slate-100 text-slate-700"
          )}
        >
          <Calendar className={cn("w-5 h-5", pathname === "/faculty/dashboard" ? "text-[#047857]" : "text-slate-500 group-hover:text-slate-700")} />
          My Appointments
        </Link>
        
        <Link 
          href="/faculty/profile" 
          onClick={() => setMobileOpen(false)}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group font-medium",
            pathname === "/faculty/profile" 
              ? "bg-[#D1FAE5] text-[#047857] shadow-sm"
              : "hover:bg-slate-100 text-slate-700"
          )}
        >
          <User className={cn("w-5 h-5", pathname === "/faculty/profile" ? "text-[#047857]" : "text-slate-500 group-hover:text-slate-700")} />
          My Profile
        </Link>
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between border border-slate-100 mb-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0">
              {session?.user?.name?.[0]}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-900 truncate">{session?.user?.name}</p>
              <p className="text-[10px] text-slate-500 font-medium">Faculty</p>
            </div>
          </div>
        </div>
        <a href="/api/auth/signout" className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors">
          <LogOut className="w-4 h-4" /> Sign out
        </a>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-100 p-4 flex items-center justify-between shadow-sm z-40">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="p-1.5 -ml-1.5 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-semibold text-lg text-slate-900">Faculty Portal</span>
        </div>
        <a href="/api/auth/signout" className="text-slate-400 hover:text-slate-900">
          <LogOut className="w-5 h-5" />
        </a>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative w-[280px] bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 text-slate-600 flex-shrink-0 hidden md:flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 h-screen sticky top-0">
        {sidebarContent}
      </aside>
    </>
  );
}
