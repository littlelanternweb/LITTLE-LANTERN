import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, startOfDay, endOfDay } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye, CreditCard, ArrowLeft, IndianRupee } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage({ searchParams }: { searchParams: { filter?: string, date?: string, view?: string } }) {
  const filter = searchParams?.filter;
  const dateFilter = searchParams?.date;
  const view = searchParams?.view || "appointments"; // 'appointments' or 'transactions'

  if (view === "transactions") {
    // REVENUE / TRANSACTIONS VIEW
    let tQuery: any = { status: "SUCCESS" };
    
    if (dateFilter) {
      const startDate = startOfDay(new Date(dateFilter));
      const endDate = endOfDay(new Date(dateFilter));
      tQuery.date = { gte: startDate, lte: endDate };
    }

    const transactions = await prisma.transaction.findMany({
      where: tQuery,
      orderBy: { date: "desc" },
      include: {
        appointment: {
          include: { customer: true, child: true, specialist: true }
        }
      }
    });

    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
    const advanceCollection = transactions.filter(t => t.type === "ADVANCE").reduce((sum, t) => sum + t.amount, 0);
    const balanceCollection = transactions.filter(t => t.type === "BALANCE").reduce((sum, t) => sum + t.amount, 0);

    return (
      <div className="space-y-8 pb-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild className="p-0 hover:bg-transparent text-slate-500">
            <Link href="/admin"><ArrowLeft className="w-5 h-5 mr-1" /> Back</Link>
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-display font-medium text-slate-900 tracking-tight">
            Revenue & Transactions
          </h1>
          <p className="text-slate-500 mt-2">
            {dateFilter ? `Payments received on ${format(new Date(dateFilter), "PPP")}` : "All received payments"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-slate-100 shadow-sm bg-emerald-50">
            <CardContent className="p-6">
              <p className="text-sm font-semibold text-emerald-800 uppercase tracking-wider mb-2">Total Revenue</p>
              <p className="text-3xl font-bold text-emerald-900">₹{totalRevenue}</p>
            </CardContent>
          </Card>
          <Card className="border-slate-100 shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Advance Collection</p>
              <p className="text-2xl font-bold text-slate-900">₹{advanceCollection}</p>
            </CardContent>
          </Card>
          <Card className="border-slate-100 shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Balance Collection</p>
              <p className="text-2xl font-bold text-slate-900">₹{balanceCollection}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 px-6 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium text-slate-800">Transaction History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {transactions.length === 0 ? (
              <div className="p-10 text-center text-slate-500">No transactions found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4">Date & Time</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Method</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Appointment Info</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {transactions.map(t => (
                      <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900">{format(new Date(t.date), "MMM d, yyyy")}</div>
                          <div className="text-xs text-slate-500 mt-1">{format(new Date(t.date), "p")}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase ${t.type === 'ADVANCE' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                            {t.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-slate-700">{t.method}</span>
                          {t.notes && <p className="text-[10px] text-slate-400 mt-1">{t.notes}</p>}
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900">₹{t.amount}</td>
                        <td className="px-6 py-4">
                          <Link href={`/admin/appointments/${t.appointmentId}`} className="text-primary hover:underline font-medium">
                            {t.appointment.child.name}
                          </Link>
                          <p className="text-xs text-slate-500 mt-0.5">with {t.appointment.specialist.name}</p>
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
    );
  }

  // APPOINTMENTS VIEW (Pending Payments etc)
  let query: any = { status: { not: "CANCELLED" } };

  if (filter === "pending") {
    query.paymentStatus = { in: ["PENDING", "ADVANCE_PAID", "PARTIALLY_PAID"] };
  }

  if (dateFilter) {
    const startDate = startOfDay(new Date(dateFilter));
    const endDate = endOfDay(new Date(dateFilter));
    query.date = { gte: startDate, lte: endDate };
  }

  const appointments = await prisma.appointment.findMany({
    where: query,
    orderBy: { date: "desc" },
    include: {
      customer: true,
      child: true,
      specialist: true,
      transactions: true
    },
  });

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" asChild className="p-0 hover:bg-transparent text-slate-500">
          <Link href="/admin"><ArrowLeft className="w-5 h-5 mr-1" /> Back</Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-display font-medium text-slate-900 tracking-tight">
          {filter === "pending" ? "Pending Payments" : "Payments & Outstanding Balances"}
        </h1>
        <p className="text-slate-500 mt-2">
          {filter === "pending" ? "Appointments with outstanding balances." : "Manage and view appointment financials."}
        </p>
      </div>

      <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 px-6 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium text-slate-800">
            {filter === "pending" ? "Pending Appointments" : "All Appointments"}
          </CardTitle>
          {filter === "pending" && (
            <Link href="/admin/payments" className="text-xs text-primary font-medium hover:underline">
              View All
            </Link>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {appointments.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              No records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Appointment</th>
                    <th className="px-6 py-4">Patient / Parent</th>
                    <th className="px-6 py-4">Faculty</th>
                    <th className="px-6 py-4">Financials</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {appointments.map((apt) => {
                    const remaining = apt.totalAmount - (apt.advancePaid + apt.balancePaid);
                    
                    return (
                    <tr key={apt.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="font-medium text-slate-900">{format(new Date(apt.date), "MMM d, yyyy")}</div>
                        <div className="text-xs text-slate-500 mt-1">{apt.startTime}</div>
                        <div className="font-mono text-[10px] text-slate-400 mt-1">#{apt.id.slice(-6).toUpperCase()}</div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="font-semibold text-slate-900">{apt.child.name}</p>
                        <p className="text-xs text-slate-500 mt-1">Parent: {apt.customer.name}</p>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-slate-700 font-medium">{apt.specialist.name}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-1 text-xs w-48">
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-500">Total Fee:</span>
                            <span className="font-medium">₹{apt.totalAmount}</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-500">Advance Paid:</span>
                            <span className="text-emerald-600 font-medium">₹{apt.advancePaid}</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-500">Balance Rcvd:</span>
                            <span className="text-blue-600 font-medium">₹{apt.balancePaid}</span>
                          </div>
                          <div className="flex justify-between gap-4 pt-1 mt-1 border-t border-slate-100">
                            <span className="text-slate-700 font-medium">Remaining:</span>
                            <span className={`font-bold ${remaining > 0 ? "text-amber-600" : "text-emerald-600"}`}>₹{remaining}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase ${
                          apt.paymentStatus === 'FULLY_PAID' ? 'bg-emerald-100 text-emerald-800' :
                          apt.paymentStatus === 'ADVANCE_PAID' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {apt.paymentStatus.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <Button asChild size="sm" variant="outline" className="h-8">
                          <Link href={`/admin/appointments/${apt.id}`}>
                            <Eye className="w-3 h-3 mr-1.5" /> View
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
