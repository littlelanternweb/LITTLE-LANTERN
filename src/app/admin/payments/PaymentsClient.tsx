"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, CreditCard, Search, ArrowLeft, IndianRupee, Edit, FileText, Download } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { markBalanceReceived, editOfflinePayment } from "@/app/actions/admin-appointments";
import { generateInvoice } from "@/app/actions/admin-invoices";

export function PaymentsClient({ initialAppointments, initialTransactions, initialFilter }: any) {
  const [view, setView] = useState(initialFilter === "pending" ? "appointments" : "transactions");
  const [appointments, setAppointments] = useState(initialAppointments);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [methodFilter, setMethodFilter] = useState("ALL");

  const [loading, setLoading] = useState(false);
  const [invoiceLoadingId, setInvoiceLoadingId] = useState<string | null>(null);

  const handleDownloadInvoice = async (aptId: string) => {
    setInvoiceLoadingId(aptId);
    const res = await generateInvoice(aptId);
    if (res.error) toast.error(res.error);
    else window.open(`/invoice/${res.token}`, "_blank");
    setInvoiceLoadingId(null);
  };

  // Modals state
  const [payApt, setPayApt] = useState<any>(null);
  const [payAmount, setPayAmount] = useState<number | "">("");
  const [payMethod, setPayMethod] = useState("CASH");
  const [payNotes, setPayNotes] = useState("");
  const [payRef, setPayRef] = useState("");

  const [editTx, setEditTx] = useState<any>(null);
  const [editAmount, setEditAmount] = useState<number | "">("");
  const [editMethod, setEditMethod] = useState("CASH");
  const [editDate, setEditDate] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editRef, setEditRef] = useState("");

  const filteredAppointments = appointments.filter((apt: any) => {
    const searchLower = search.toLowerCase();
    const matchesSearch = apt.id.toLowerCase().includes(searchLower) ||
                          apt.child.name.toLowerCase().includes(searchLower) ||
                          apt.customer.name.toLowerCase().includes(searchLower) ||
                          apt.specialist.name.toLowerCase().includes(searchLower);
    
    if (statusFilter !== "ALL" && apt.paymentStatus !== statusFilter) return false;
    return matchesSearch;
  });

  const filteredTransactions = transactions.filter((t: any) => {
    const searchLower = search.toLowerCase();
    const matchesSearch = t.id.toLowerCase().includes(searchLower) ||
                          t.appointmentId.toLowerCase().includes(searchLower) ||
                          t.appointment.child.name.toLowerCase().includes(searchLower) ||
                          t.appointment.customer.name.toLowerCase().includes(searchLower);
    
    if (methodFilter !== "ALL" && t.method !== methodFilter) return false;
    return matchesSearch;
  });

  const handleRecordBalance = async () => {
    if (payAmount === "" || Number(payAmount) <= 0) return toast.error("Invalid amount");
    setLoading(true);
    const res = await markBalanceReceived(payApt.id, Number(payAmount), payMethod, `${payNotes} ${payRef ? 'Ref: '+payRef : ''}`.trim());
    setLoading(false);
    if (res.error) toast.error(res.error);
    else {
      toast.success("Payment recorded");
      setPayApt(null);
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const handleEditTx = async () => {
    if (editAmount === "" || Number(editAmount) <= 0) return toast.error("Invalid amount");
    setLoading(true);
    const res = await editOfflinePayment(editTx.id, {
      amount: Number(editAmount),
      method: editMethod,
      date: new Date(editDate).toISOString(),
      notes: editNotes,
      reference: editRef,
    });
    setLoading(false);
    if (res.error) toast.error(res.error);
    else {
      toast.success("Transaction updated");
      setEditTx(null);
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const totalRevenue = transactions.reduce((sum: number, t: any) => sum + t.amount, 0);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-display font-medium text-slate-900 tracking-tight">Payment Management</h1>
          <p className="text-slate-500 mt-2">Manage appointments financials, record balance, and edit transactions.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button onClick={() => setView("appointments")} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${view === "appointments" ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-700"}`}>Appointments</button>
          <button onClick={() => setView("transactions")} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${view === "transactions" ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-700"}`}>Transactions</button>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <Input 
            placeholder="Search by Customer, Child, ID..." 
            className="pl-9 bg-slate-50 border-transparent focus-visible:bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {view === "appointments" && (
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-md text-sm bg-slate-50">
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PARTIALLY_PAID">Partially Paid</option>
            <option value="ADVANCE_PAID">Advance Paid</option>
            <option value="FULLY_PAID">Fully Paid</option>
          </select>
        )}
        {view === "transactions" && (
          <select value={methodFilter} onChange={e => setMethodFilter(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-md text-sm bg-slate-50">
            <option value="ALL">All Methods</option>
            <option value="RAZORPAY">Razorpay</option>
            <option value="CASH">Cash</option>
            <option value="UPI">UPI</option>
            <option value="CARD">Card</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="OTHER">Other</option>
          </select>
        )}
      </div>

      {view === "appointments" && (
        <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 px-6">
            <CardTitle className="text-lg font-medium text-slate-800">Appointments Financials</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredAppointments.length === 0 ? (
              <div className="p-10 text-center text-slate-500">No records found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4">Appointment</th>
                      <th className="px-6 py-4">Financials</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredAppointments.map((apt: any) => {
                      const remaining = apt.totalAmount - (apt.advancePaid + apt.balancePaid);
                      return (
                      <tr key={apt.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-900">{apt.child.name}</div>
                          <div className="text-xs text-slate-500 mt-1">{format(new Date(apt.date), "MMM d, yyyy")} • {apt.startTime}</div>
                          <div className="font-mono text-[10px] text-slate-400 mt-1">#{apt.id}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1 text-xs w-48">
                            <div className="flex justify-between"><span className="text-slate-500">Total Fee:</span><span className="font-medium">₹{apt.totalAmount}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Adv Rcvd:</span><span className="text-emerald-600 font-medium">₹{apt.advancePaid}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Bal Rcvd:</span><span className="text-blue-600 font-medium">₹{apt.balancePaid}</span></div>
                            <div className="flex justify-between pt-1 mt-1 border-t border-slate-100"><span className="text-slate-700 font-medium">Remaining:</span><span className={`font-bold ${remaining > 0 ? "text-amber-600" : "text-emerald-600"}`}>₹{remaining}</span></div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase ${apt.paymentStatus === 'FULLY_PAID' ? 'bg-emerald-100 text-emerald-800' : apt.paymentStatus === 'ADVANCE_PAID' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
                            {apt.paymentStatus.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex flex-col items-end gap-2">
                            <Button size="sm" variant="outline" className="h-8" onClick={() => handleDownloadInvoice(apt.id)} disabled={invoiceLoadingId === apt.id}>
                              {invoiceLoadingId === apt.id ? <IndianRupee className="w-3 h-3 mr-1.5 animate-pulse" /> : <FileText className="w-3 h-3 mr-1.5" />} Invoice
                            </Button>
                            <Button asChild size="sm" variant="outline" className="h-8">
                              <Link href={`/admin/appointments/${apt.id}`}><Eye className="w-3 h-3 mr-1.5" /> View</Link>
                            </Button>
                            {remaining > 0 && apt.status !== "CANCELLED" && (
                              <Button size="sm" onClick={() => {
                                setPayApt(apt);
                                setPayAmount(remaining);
                                setPayMethod("CASH");
                              }} className="h-8 bg-emerald-600 hover:bg-emerald-700">Record Balance</Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {view === "transactions" && (
        <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 px-6 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium text-slate-800">Transaction History</CardTitle>
            <div className="text-sm font-semibold text-emerald-700">Total: ₹{totalRevenue}</div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredTransactions.length === 0 ? (
              <div className="p-10 text-center text-slate-500">No transactions found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4">Transaction Details</th>
                      <th className="px-6 py-4">Appointment</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredTransactions.map((t: any) => (
                      <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-900">{format(new Date(t.date), "MMM d, yyyy • p")}</div>
                          <div className="text-xs text-slate-500 mt-1">{t.method} • {t.type}</div>
                          <div className="font-mono text-[10px] text-slate-400 mt-1">ID: {t.id}</div>
                          {t.notes && <p className="text-[10px] text-slate-400 mt-1">{t.notes}</p>}
                        </td>
                        <td className="px-6 py-4">
                          <Link href={`/admin/appointments/${t.appointmentId}`} className="text-primary hover:underline font-medium text-sm">
                            {t.appointment.child.name}
                          </Link>
                          <div className="text-xs text-slate-500 mt-0.5">Appt: {format(new Date(t.appointment.date), "MMM d, yyyy")}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900 text-base">₹{t.amount}</div>
                          <div className="text-[10px] font-medium text-emerald-600 uppercase">{t.status}</div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex flex-col items-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => {
                              setEditTx(t);
                              setEditAmount(t.amount);
                              setEditMethod(t.method);
                              setEditDate(new Date(t.date).toISOString().slice(0, 16));
                              setEditNotes(t.notes || "");
                              setEditRef(t.reference || "");
                            }} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-blue-100">
                              <Edit className="w-4 h-4 mr-1.5" /> Edit
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDownloadInvoice(t.appointmentId)} disabled={invoiceLoadingId === t.appointmentId} className="h-8 text-slate-500">
                              {invoiceLoadingId === t.appointmentId ? <IndianRupee className="w-3 h-3 mr-1.5 animate-pulse" /> : <FileText className="w-3 h-3 mr-1.5" />} Invoice
                            </Button>
                            <Button asChild size="sm" variant="ghost" className="h-8 text-slate-500">
                              <Link href={`/admin/appointments/${t.appointmentId}`}><Eye className="w-3 h-3 mr-1.5" /> View</Link>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* RECORD BALANCE MODAL */}
      <Dialog open={!!payApt} onOpenChange={(open) => !open && setPayApt(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Record Balance Payment</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Amount Received</Label>
              <Input type="number" value={payAmount} onChange={e => setPayAmount(Number(e.target.value))} max={payApt?.totalAmount - (payApt?.advancePaid + payApt?.balancePaid)} />
            </div>
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <select value={payMethod} onChange={e => setPayMethod(e.target.value)} className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm">
                <option value="CASH">Cash</option><option value="UPI">UPI</option><option value="CARD">Card POS</option><option value="BANK_TRANSFER">Bank Transfer</option><option value="OTHER">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Reference</Label><Input value={payRef} onChange={e => setPayRef(e.target.value)} placeholder="Txn ID, Cheque No" />
            </div>
            <div className="space-y-2">
              <Label>Notes</Label><Input value={payNotes} onChange={e => setPayNotes(e.target.value)} placeholder="Optional" />
            </div>
            <Button onClick={handleRecordBalance} disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700">Save Payment</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* EDIT TX MODAL */}
      <Dialog open={!!editTx} onOpenChange={(open) => !open && setEditTx(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Offline Payment</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Amount</Label><Input type="number" value={editAmount} onChange={e => setEditAmount(Number(e.target.value))} /></div>
              <div className="space-y-2"><Label>Date & Time</Label><Input type="datetime-local" value={editDate} onChange={e => setEditDate(e.target.value)} /></div>
            </div>
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <select value={editMethod} onChange={e => setEditMethod(e.target.value)} className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm">
                <option value="CASH">Cash</option><option value="UPI">UPI</option><option value="CARD">Card POS</option><option value="BANK_TRANSFER">Bank Transfer</option><option value="OTHER">Other</option>
              </select>
            </div>
            <div className="space-y-2"><Label>Reference Number</Label><Input value={editRef} onChange={e => setEditRef(e.target.value)} placeholder="Txn ID, Cheque No, etc." /></div>
            <div className="space-y-2"><Label>Notes</Label><Input value={editNotes} onChange={e => setEditNotes(e.target.value)} placeholder="Optional notes" /></div>
            <Button onClick={handleEditTx} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
