import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      appointment: {
        include: {
          customer: true,
          specialist: true,
        },
      },
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-medium text-stone-900 tracking-tight">Payments</h1>
        <p className="text-stone-500 mt-2">Manage and view all transaction histories.</p>
      </div>

      <Card className="rounded-2xl border-stone-200/60 shadow-sm overflow-hidden">
        <CardHeader className="bg-stone-50/50 border-b border-stone-100 py-4 px-6">
          <CardTitle className="text-lg font-medium text-stone-800">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {payments.length === 0 ? (
            <div className="p-10 text-center text-stone-500">
              No payments found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-stone-50 text-stone-500 font-medium">
                  <tr>
                    <th className="px-6 py-4">Transaction Details</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Specialist</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 bg-white">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-stone-900">{payment.razorpayPaymentId || payment.razorpayOrderId}</div>
                        <div className="text-stone-500 text-xs mt-0.5">{format(new Date(payment.createdAt), "MMM d, yyyy h:mm a")}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-stone-900">{payment.appointment?.customer?.name || "Unknown"}</div>
                        <div className="text-stone-500 text-xs mt-0.5">{payment.appointment?.customer?.email}</div>
                      </td>
                      <td className="px-6 py-4 text-stone-600">
                        {payment.appointment?.specialist?.name || "Unknown"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-emerald-700">₹{payment.amount}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                          payment.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-700' :
                          payment.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                          'bg-rose-100 text-rose-700'
                        }`}>
                          {payment.status}
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
  );
}
