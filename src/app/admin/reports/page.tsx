import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, CalendarCheck, IndianRupee } from "lucide-react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { redirect } from "next/navigation";

export default async function AdminReports() {
  const session = await getServerSession(authOptions);
  
  if (!session || !hasPermission((session.user as any)?.role, PERMISSIONS.REPORTS_VIEW)) {
    redirect("/admin");
  }
  // 1. Appointments by Status
  const statusCounts = await prisma.appointment.groupBy({
    by: ['status'],
    _count: { status: true }
  });

  // 2. Revenue (Assuming SUCCESS status payments)
  const revenueAgg = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: { status: "SUCCESS" }
  });
  const totalRevenue = revenueAgg._sum.amount || 0;

  // 3. Appointments by Specialist
  const specialistAppointments = await prisma.appointment.groupBy({
    by: ['specialistId'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } }
  });

  const specialists = await prisma.specialist.findMany({
    where: { id: { in: specialistAppointments.map(s => s.specialistId) } },
    select: { id: true, name: true, category: true }
  });

  const specialistStats = specialistAppointments.map(sa => ({
    ...sa,
    specialist: specialists.find(s => s.id === sa.specialistId)
  }));

  // 4. Last 7 Days Trend (Appointments)
  // SQLite doesn't easily do temporal grouping via Prisma groupBy date trunc, 
  // so we'll fetch the last 30 days and group in JS.
  const thirtyDaysAgo = subDays(new Date(), 30);
  const recentAppointments = await prisma.appointment.findMany({
    where: { createdAt: { gte: thirtyDaysAgo } },
    select: { createdAt: true, status: true }
  });

  // Build a tiny timeline for the last 7 days
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(new Date(), i);
    const dayStart = startOfDay(d);
    const dayEnd = endOfDay(d);
    const count = recentAppointments.filter(a => a.createdAt >= dayStart && a.createdAt <= dayEnd).length;
    return {
      date: format(d, "MMM dd"),
      count
    };
  }).reverse();

  // Find max count for simple CSS bar chart scaling
  const maxDayCount = Math.max(...last7Days.map(d => d.count), 1);

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics & Reports</h1>
        <p className="text-sm text-slate-500 mt-1">Detailed insights into bookings, revenue, and center performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Revenue Overview */}
        <Card className="border-slate-200 shadow-sm md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
              <IndianRupee className="w-4 h-4 mr-2 text-slate-400" />
              Total Lifetime Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">₹{totalRevenue}</div>
            <p className="text-xs text-emerald-600 font-medium flex items-center mt-2">
              <TrendingUp className="w-3 h-3 mr-1" /> Verified Payments
            </p>
          </CardContent>
        </Card>

        {/* Status Breakdown */}
        <Card className="border-slate-200 shadow-sm md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
              <BarChart3 className="w-4 h-4 mr-2 text-slate-400" />
              Appointments by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 sm:gap-8 flex-wrap">
              {['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(statusType => {
                const count = statusCounts.find(s => s.status === statusType)?._count.status || 0;
                return (
                  <div key={statusType} className="flex flex-col">
                    <span className="text-2xl font-bold text-slate-900">{count}</span>
                    <span className="text-xs text-slate-500 font-medium capitalize">{statusType.toLowerCase()}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 7-Day Trend Chart (CSS based) */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
              <CalendarCheck className="w-4 h-4 mr-2 text-slate-400" />
              7-Day Booking Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between h-48 gap-2 pt-4">
              {last7Days.map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                  <div className="w-full flex justify-center h-full items-end">
                    <div 
                      className="w-full max-w-[40px] bg-amber-200 group-hover:bg-amber-400 rounded-t-md transition-all relative"
                      style={{ height: `${(day.count / maxDayCount) * 100}%`, minHeight: day.count > 0 ? '4px' : '0' }}
                    >
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                        {day.count}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 text-center uppercase tracking-wider">{day.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Specialists */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
              <Users className="w-4 h-4 mr-2 text-slate-400" />
              Consultations by Specialist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {specialistStats.length === 0 ? (
                <p className="text-sm text-slate-500 italic">No appointment data yet.</p>
              ) : (
                specialistStats.slice(0, 5).map((stat, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs">
                        {stat.specialist?.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{stat.specialist?.name}</p>
                        <p className="text-xs text-slate-500">{stat.specialist?.category}</p>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-slate-900 bg-slate-50 px-3 py-1 rounded-md border border-slate-100">
                      {stat._count.id} Bookings
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
