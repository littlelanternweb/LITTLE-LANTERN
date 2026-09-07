import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Briefcase, Activity, IndianRupee, Clock, UserCheck } from "lucide-react";
import { startOfDay, endOfDay, format } from "date-fns";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  const today = new Date();
  const start = startOfDay(today);
  const end = endOfDay(today);

  // Fetch real stats
  const totalSpecialists = await prisma.specialist.count({ where: { isActive: true } });
  
  const todayConsultations = await prisma.appointment.count({
    where: {
      date: { gte: start, lte: end },
      status: { not: "CANCELLED" }
    }
  });

  const upcomingAppointments = await prisma.appointment.count({
    where: {
      date: { gt: end },
      status: { not: "CANCELLED" }
    }
  });

  const totalCustomers = await prisma.customer.count();

  const pendingPayments = await prisma.appointment.count({
    where: { status: "PENDING" }
  });

  // Calculate Revenues via the Payment model (using aggregation if there were payments)
  // Since we haven't built the full payment reconciliation webhook yet, we'll sum up Mock/Actual payments
  const totalRevenueAgg = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: { status: "SUCCESS" }
  });
  
  const todayRevenueAgg = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: { 
      status: "SUCCESS",
      createdAt: { gte: start, lte: end }
    }
  });

  const totalRevenue = totalRevenueAgg._sum.amount || 0;
  const todayRevenue = todayRevenueAgg._sum.amount || 0;

  const newJobApps = await prisma.jobApplication.count({
    where: { status: "NEW" }
  });

  // Fetch recent appointments for the list
  const recentAppointments = await prisma.appointment.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      customer: true,
      child: true,
      specialist: true
    }
  });

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Welcome back, {session.user?.name}!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-slate-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Today's Consultations</CardTitle>
            <Clock className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{todayConsultations}</div>
            <p className="text-xs text-slate-500 mt-1">Scheduled for today</p>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Upcoming Appointments</CardTitle>
            <Calendar className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{upcomingAppointments}</div>
            <p className="text-xs text-slate-500 mt-1">Confirmed future bookings</p>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Customers</CardTitle>
            <UserCheck className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalCustomers}</div>
            <p className="text-xs text-slate-500 mt-1">Registered parents</p>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Active Specialists</CardTitle>
            <Users className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalSpecialists}</div>
            <p className="text-xs text-slate-500 mt-1">Available for booking</p>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Today's Revenue</CardTitle>
            <IndianRupee className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">₹{todayRevenue}</div>
            <p className="text-xs text-slate-500 mt-1">Payments collected today</p>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Revenue</CardTitle>
            <IndianRupee className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">₹{totalRevenue}</div>
            <p className="text-xs text-slate-500 mt-1">All time revenue</p>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Pending Payments</CardTitle>
            <Activity className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{pendingPayments}</div>
            <p className="text-xs text-slate-500 mt-1">Awaiting confirmation</p>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">New Applications</CardTitle>
            <Briefcase className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{newJobApps}</div>
            <p className="text-xs text-slate-500 mt-1">Unreviewed job apps</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Bookings</h2>
        <Card className="border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-medium">ID</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Specialist</th>
                  <th className="px-6 py-3 font-medium">Date & Time</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      No recent bookings found.
                    </td>
                  </tr>
                ) : (
                  recentAppointments.map(apt => (
                    <tr key={apt.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">{apt.id.slice(-6).toUpperCase()}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">{apt.customer.name}</td>
                      <td className="px-6 py-4 text-slate-600">{apt.specialist.name}</td>
                      <td className="px-6 py-4 text-slate-600">
                        {format(new Date(apt.date), "MMM d, yyyy")} <br/>
                        <span className="text-xs text-slate-400">{apt.startTime} - {apt.endTime}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          apt.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                          apt.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {apt.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
