import { prisma } from "@/lib/db";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Filter, Eye, XCircle, CalendarClock } from "lucide-react";
import Link from "next/link";
import { AppointmentActions } from "@/components/admin/AppointmentActions";
import { AppointmentFilters } from "@/components/admin/AppointmentFilters";
import { AppointmentSearch } from "@/components/admin/AppointmentSearch";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";

export default async function AdminAppointments({ searchParams }: { searchParams: { q?: string, status?: string, date?: string, filter?: string } }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  
  const permissions = {
    canManage: hasPermission(role, PERMISSIONS.APPOINTMENTS_MANAGE),
    canCancel: hasPermission(role, PERMISSIONS.APPOINTMENTS_CANCEL),
    canReschedule: hasPermission(role, PERMISSIONS.APPOINTMENTS_RESCHEDULE),
  };

  const query = searchParams.q || "";
  const statusFilter = searchParams.status || "";
  const dateFilter = searchParams.date || "";
  const generalFilter = searchParams.filter || "";

  let dateQuery = {};
  if (dateFilter) {
    const startDate = new Date(dateFilter);
    const endDate = new Date(dateFilter);
    endDate.setDate(endDate.getDate() + 1);
    dateQuery = {
      date: {
        gte: startDate,
        lt: endDate
      }
    };
  } else if (generalFilter === "upcoming") {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    dateQuery = {
      date: {
        gt: today
      }
    };
  }

  const appointments = await prisma.appointment.findMany({
    where: {
      ...(statusFilter ? { status: statusFilter } : {}),
      ...dateQuery,
      ...(query ? {
        OR: [
          { id: { contains: query } },
          { customer: { name: { contains: query } } },
          { customer: { email: { contains: query } } },
          { child: { name: { contains: query } } }
        ]
      } : {})
    },
    include: {
      customer: true,
      child: true,
      specialist: true,
      payment: true
    },
    orderBy: { date: 'desc' }
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-medium text-[#1C1917]">Appointments</h1>
          <p className="text-[#78716C] mt-1 font-light">Manage all bookings and schedules across the centre.</p>
        </div>
      </div>

      <Card className="border-[#F5F5F4] shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden bg-white">
        <div className="p-5 border-b border-[#F5F5F4] flex flex-col sm:flex-row gap-4 items-center justify-between bg-[#FCFBF9]">
          <AppointmentSearch />
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <AppointmentFilters />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#FCFBF9] text-[#78716C] border-b border-[#F5F5F4]">
              <tr>
                <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Booking ID</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Parent & Child</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Specialist</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Date & Time</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Status</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F4]">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-[#A8A29E]">
                    <div className="flex flex-col items-center justify-center">
                      <CalendarClock className="w-12 h-12 mb-4 text-[#E7E5E4]" />
                      <p className="text-base font-medium text-[#57534E]">No appointments found.</p>
                      <p className="font-light mt-1 text-[#A8A29E]">Try adjusting your search criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                appointments.map(apt => (
                  <tr key={apt.id} className="hover:bg-[#FCFBF9] transition-colors group">
                    <td className="px-6 py-5 font-mono text-[11px] text-[#A8A29E] tracking-wider">#{apt.id.slice(-8).toUpperCase()}</td>
                    <td className="px-6 py-5">
                      <p className="font-medium text-[#1C1917]">{apt.customer.name}</p>
                      <p className="text-xs text-[#78716C] mt-1">Child: {apt.child.name}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="inline-flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#FFEDD5] text-[#9A3412] flex items-center justify-center text-[10px] font-bold">
                          {apt.specialist.name.charAt(0)}
                        </div>
                        <span className="text-[#57534E] font-medium">{apt.specialist.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-[#57534E]">
                      <div className="font-medium">{format(new Date(apt.date), "MMM d, yyyy")}</div>
                      <div className="text-xs text-[#A8A29E] mt-1">{apt.startTime} - {apt.endTime}</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1.5 rounded-md text-[11px] font-semibold tracking-wide uppercase ${
                        apt.status === 'CONFIRMED' ? 'bg-[#DCFCE7] text-[#166534]' :
                        apt.status === 'PENDING' ? 'bg-[#FEF9C3] text-[#854D0E]' :
                        apt.status === 'CANCELLED' ? 'bg-[#FEE2E2] text-[#991B1B]' :
                        'bg-[#F5F5F4] text-[#57534E]'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
                        <AppointmentActions appointment={apt} permissions={permissions} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
