import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { format, startOfDay } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Clock, User as UserIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FacultyDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) return null;

  // Find the specialist linked to this user
  const specialist = await prisma.specialist.findUnique({
    where: { email: session.user.email }
  });

  if (!specialist) {
    return (
      <div className="p-10 text-center text-slate-500">
        <p>No specialist profile linked to this account.</p>
        <p className="text-sm mt-2">Please contact an administrator.</p>
      </div>
    );
  }

  const today = startOfDay(new Date());

  // Fetch upcoming appointments
  const appointments = await prisma.appointment.findMany({
    where: {
      specialistId: specialist.id,
      date: { gte: today },
      status: { not: "CANCELLED" }
    },
    include: {
      child: true,
      customer: true
    },
    orderBy: [
      { date: 'asc' },
      { startTime: 'asc' }
    ]
  });

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-display font-medium text-slate-900 tracking-tight">Welcome, {specialist.name}</h1>
        <p className="text-slate-500 mt-2">Here are your assigned appointments.</p>
      </div>

      <div className="grid gap-6">
        <Card className="border-slate-100 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 px-6">
            <CardTitle className="text-lg font-medium text-slate-800 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" />
              My Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {appointments.length === 0 ? (
              <div className="p-10 text-center text-slate-500">
                You have no upcoming appointments assigned.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 rounded-tl-xl">Date & Time</th>
                      <th className="px-6 py-4">Patient / Child</th>
                      <th className="px-6 py-4">Parent Details</th>
                      <th className="px-6 py-4 rounded-tr-xl">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {appointments.map(apt => (
                      <tr key={apt.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-5">
                          <div className="font-semibold text-slate-900">{format(new Date(apt.date), "MMM d, yyyy")}</div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {apt.startTime} - {apt.endTime}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <p className="font-semibold text-slate-900">{apt.child.name}</p>
                          {apt.child.age && <p className="text-xs text-slate-500 mt-1">{apt.child.age} years old</p>}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-slate-400" />
                            <span className="font-medium text-slate-700">{apt.customer.name}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 ml-6">{apt.customer.phone}</p>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1.5 rounded-md text-[11px] font-bold tracking-wide uppercase ${
                            apt.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-700' :
                            apt.status === 'PENDING' ? 'bg-amber-50 text-amber-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {apt.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
