import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Activity, IndianRupee, Clock, UserCheck, CreditCard, ChevronRight, CheckCircle2 } from "lucide-react";
import { startOfDay, endOfDay, format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }
  
  if (session.user?.role === "FACULTY") {
    redirect("/faculty/dashboard"); // We'll create this soon
  }

  const today = new Date();
  const start = startOfDay(today);
  const end = endOfDay(today);

  // 1. ACTIVE SPECIALISTS & APPROVALS
  const activeSpecialists = await prisma.specialist.count({ where: { status: "ACTIVE" } });
  const pendingApprovals = await prisma.specialist.count({ where: { status: "PENDING_APPROVAL" } });

  // 2. TODAY'S APPOINTMENTS
  const todayAppointments = await prisma.appointment.findMany({
    where: {
      date: { gte: start, lte: end },
      status: { not: "CANCELLED" }
    },
    include: { customer: true, child: true, specialist: true },
    orderBy: { startTime: 'asc' }
  });

  // 3. UPCOMING APPOINTMENTS
  const upcomingAppointments = await prisma.appointment.findMany({
    where: {
      date: { gt: end },
      status: { not: "CANCELLED" }
    },
    include: { customer: true, child: true, specialist: true },
    orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    take: 8
  });

  // 4. TODAY'S REVENUE (via Transactions)
  const todaysTransactions = await prisma.transaction.findMany({
    where: {
      date: { gte: start, lte: end },
      status: "SUCCESS"
    }
  });

  const todayTotalRevenue = todaysTransactions.reduce((acc, t) => acc + t.amount, 0);
  const todayAdvanceCollection = todaysTransactions.filter(t => t.type === "ADVANCE").reduce((acc, t) => acc + t.amount, 0);
  const todayBalanceCollection = todaysTransactions.filter(t => t.type === "BALANCE").reduce((acc, t) => acc + t.amount, 0);

  // 5. PENDING PAYMENTS
  const pendingPaymentsAppointments = await prisma.appointment.findMany({
    where: {
      paymentStatus: { in: ["PENDING", "ADVANCE_PAID", "PARTIALLY_PAID"] },
      status: { not: "CANCELLED" }
    }
  });
  
  const pendingPaymentsCount = pendingPaymentsAppointments.length;
  const pendingPaymentsValue = pendingPaymentsAppointments.reduce((acc, appt) => acc + (appt.totalAmount - (appt.advancePaid + appt.balancePaid)), 0);

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-display font-medium text-slate-900 tracking-tight">Operational Dashboard</h1>
        <p className="text-slate-500 mt-2">Active snapshot of today's centre operations.</p>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 uppercase tracking-wider">Today's Appts</CardTitle>
            <Clock className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{todayAppointments.length}</div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Scheduled for today</p>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 uppercase tracking-wider">Pending Pay</CardTitle>
            <CreditCard className="w-5 h-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">₹{pendingPaymentsValue.toLocaleString()}</div>
            <Link href="/admin/payments?filter=pending" className="text-xs text-amber-600 hover:text-amber-700 mt-1 font-medium flex items-center gap-1">
              {pendingPaymentsCount} appts pending <ChevronRight className="w-3 h-3" />
            </Link>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 uppercase tracking-wider">Today's Revenue</CardTitle>
            <IndianRupee className="w-5 h-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">₹{todayTotalRevenue.toLocaleString()}</div>
            <p className="text-[11px] text-slate-500 mt-1 font-medium flex gap-2">
              <span className="text-emerald-600">Adv: ₹{todayAdvanceCollection}</span> 
              <span className="text-blue-600">Bal: ₹{todayBalanceCollection}</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 uppercase tracking-wider">Active Faculty</CardTitle>
            <Users className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{activeSpecialists}</div>
            <Link href="/admin/specialists" className="text-xs text-blue-600 hover:text-blue-700 mt-1 font-medium flex items-center gap-1">
              {pendingApprovals} pending approvals <ChevronRight className="w-3 h-3" />
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* TODAY'S APPOINTMENTS */}
        <Card className="border-slate-100 shadow-sm">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-slate-900">Today's Appointments</CardTitle>
              <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-md">{format(today, "dd MMM yyyy")}</span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {todayAppointments.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">No appointments scheduled for today.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {todayAppointments.map((appt) => (
                  <div key={appt.id} className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 text-center shrink-0">
                        <div className="text-sm font-bold text-slate-900">{appt.startTime}</div>
                        <div className="text-[10px] text-slate-500 font-medium">{appt.endTime}</div>
                      </div>
                      <div className="w-px h-10 bg-slate-200 hidden sm:block"></div>
                      <div>
                        <Link href={`/admin/appointments/${appt.id}`} className="text-sm font-bold text-slate-900 hover:text-primary transition-colors">
                          {appt.child.name}
                        </Link>
                        <div className="text-xs text-slate-500 mt-0.5">Parent: {appt.customer.name}</div>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded uppercase font-semibold">{appt.specialist.name}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-semibold ${
                            appt.paymentStatus === "FULLY_PAID" ? "bg-emerald-50 text-emerald-700" :
                            appt.paymentStatus === "ADVANCE_PAID" ? "bg-amber-50 text-amber-700" :
                            "bg-rose-50 text-rose-700"
                          }`}>
                            {appt.paymentStatus.replace("_", " ")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button asChild size="sm" variant="outline" className="shrink-0">
                      <Link href={`/admin/appointments/${appt.id}`}>Open</Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* UPCOMING APPOINTMENTS */}
        <Card className="border-slate-100 shadow-sm">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
            <CardTitle className="text-lg font-semibold text-slate-900">Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {upcomingAppointments.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">No upcoming appointments.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {upcomingAppointments.map((appt) => (
                  <div key={appt.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-900">{format(new Date(appt.date), "dd MMM")}</span>
                        <span className="text-xs text-slate-500">{appt.startTime}</span>
                      </div>
                      <Link href={`/admin/appointments/${appt.id}`} className="text-sm font-semibold text-slate-900 hover:text-primary transition-colors">
                        {appt.child.name}
                      </Link>
                      <div className="text-[11px] text-slate-500 mt-1">with {appt.specialist.name}</div>
                    </div>
                    <Button asChild size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-primary">
                      <Link href={`/admin/appointments/${appt.id}`}><ChevronRight className="w-5 h-5" /></Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
