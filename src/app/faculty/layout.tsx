import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LogOut, Calendar, User } from "lucide-react";

export default async function FacultyLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  if (session.user?.role !== "FACULTY") {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-inter selection:bg-primary/20 selection:text-primary">
      <aside className="w-64 bg-white border-r border-slate-100 text-slate-600 flex-shrink-0 hidden md:flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 relative">
        <div className="p-6 border-b border-slate-100">
          <Link href="/faculty/dashboard" className="flex items-center gap-3 text-slate-900 group">
            <div className="relative h-10 w-10 overflow-hidden rounded-lg shadow-sm border border-slate-100 group-hover:shadow-md transition-shadow">
              <Image src="/logo.jpg" alt="Little Lantern Logo" fill className="object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-lg tracking-tight leading-tight">Little Lantern</span>
              <span className="text-[11px] font-medium text-emerald-600 tracking-wider uppercase">Faculty Portal</span>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto scrollbar-hide">
          <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Menu</p>
          <Link 
            href="/faculty/dashboard" 
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group hover:bg-slate-100 text-slate-700 font-medium"
          >
            <Calendar className="w-5 h-5 text-slate-500 group-hover:text-slate-700" />
            My Appointments
          </Link>
          <Link 
            href="/faculty/profile" 
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group hover:bg-slate-100 text-slate-700 font-medium"
          >
            <User className="w-5 h-5 text-slate-500 group-hover:text-slate-700" />
            My Profile
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between border border-slate-100 mb-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0">
                {session.user?.name?.[0]}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-900 truncate">{session.user?.name}</p>
                <p className="text-[10px] text-slate-500 font-medium">Faculty</p>
              </div>
            </div>
          </div>
          <a href="/api/auth/signout" className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors">
            <LogOut className="w-4 h-4" /> Sign out
          </a>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="md:hidden bg-white border-b border-slate-100 p-4 flex items-center justify-between shadow-sm z-10">
           <span className="font-semibold text-lg text-slate-900">Faculty Portal</span>
           <a href="/api/auth/signout" className="text-slate-400 hover:text-slate-900"><LogOut className="w-5 h-5" /></a>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
