"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { markBalanceReceived, reassignFaculty } from "@/app/actions/admin-appointments";
import { toast } from "sonner";
import { IndianRupee, ArrowLeft, RefreshCw, CheckCircle, CreditCard, UserPlus } from "lucide-react";
import Link from "next/link";

export function AppointmentDetailClient({ appointment, specialists, isAdmin }: any) {
  const [balanceAmount, setBalanceAmount] = useState(appointment.totalAmount - (appointment.advancePaid + appointment.balancePaid));
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [reassignSpecId, setReassignSpecId] = useState(appointment.specialistId);
  const [loading, setLoading] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);

  const remainingBalance = appointment.totalAmount - (appointment.advancePaid + appointment.balancePaid);

  const handlePayment = async () => {
    if (balanceAmount <= 0) return toast.error("Invalid amount");
    if (balanceAmount > remainingBalance) return toast.error("Cannot overpay");
    
    setLoading(true);
    const res = await markBalanceReceived(appointment.id, Number(balanceAmount), paymentMethod, paymentNotes);
    setLoading(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Payment recorded");
      setPayOpen(false);
    }
  };

  const handleReassign = async () => {
    if (reassignSpecId === appointment.specialistId) return toast.error("Select a different specialist");
    
    setLoading(true);
    const res = await reassignFaculty(appointment.id, reassignSpecId);
    setLoading(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Faculty reassigned");
      setAssignOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" asChild className="p-0 hover:bg-transparent text-slate-500">
          <Link href="/admin"><ArrowLeft className="w-5 h-5 mr-1" /> Back to Dashboard</Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Appointment Details</h1>
          <p className="text-slate-500">ID: {appointment.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
            appointment.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' :
            appointment.status === 'CANCELLED' ? 'bg-rose-100 text-rose-800' :
            'bg-amber-100 text-amber-800'
          }`}>
            {appointment.status}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
            appointment.paymentStatus === 'FULLY_PAID' ? 'bg-emerald-100 text-emerald-800' :
            appointment.paymentStatus === 'ADVANCE_PAID' ? 'bg-amber-100 text-amber-800' :
            'bg-rose-100 text-rose-800'
          }`}>
            {appointment.paymentStatus.replace('_', ' ')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* INFO COLUMN */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Session Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Patient / Child</p>
                <p className="font-semibold text-slate-900">{appointment.child.name}</p>
              </div>
              <div>
                <p className="text-slate-500">Parent / Guardian</p>
                <p className="font-semibold text-slate-900">{appointment.customer.name}</p>
                <p className="text-xs text-slate-500">{appointment.customer.email}</p>
                <p className="text-xs text-slate-500">{appointment.customer.phone}</p>
              </div>
              <div>
                <p className="text-slate-500">Date & Time</p>
                <p className="font-semibold text-slate-900">{format(new Date(appointment.date), "PPP")}</p>
                <p className="text-slate-900">{appointment.startTime} - {appointment.endTime}</p>
              </div>
              <div>
                <p className="text-slate-500">Faculty / Specialist</p>
                <p className="font-semibold text-slate-900">{appointment.specialist.name}</p>
                <p className="text-xs text-slate-500">{appointment.specialist.category}</p>
                
                {isAdmin && (
                  <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
                    <DialogTrigger asChild>
                      <Button variant="link" size="sm" className="h-auto p-0 mt-1 text-primary">
                        <RefreshCw className="w-3 h-3 mr-1" /> Reassign
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reassign Faculty</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Select New Specialist</Label>
                          <select 
                            value={reassignSpecId}
                            onChange={(e) => setReassignSpecId(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                          >
                            {specialists.map((s: any) => (
                              <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                            ))}
                          </select>
                        </div>
                        <Button onClick={handleReassign} disabled={loading} className="w-full">
                          Confirm Reassignment
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardContent>
          </Card>

          {/* PAYMENT HISTORY */}
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              {appointment.transactions?.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No transactions recorded.</p>
              ) : (
                <div className="space-y-4">
                  {appointment.transactions?.map((t: any) => (
                    <div key={t.id} className="flex justify-between items-center p-3 border border-slate-100 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${t.type === 'ADVANCE' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{t.type}</p>
                          <p className="text-xs text-slate-500">{format(new Date(t.date), "PPP p")} • {t.method}</p>
                          {t.notes && <p className="text-[10px] text-slate-400 mt-0.5">{t.notes}</p>}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">₹{t.amount}</p>
                        <p className="text-[10px] font-medium text-emerald-600 uppercase">{t.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* PAYMENT SUMMARY COLUMN */}
        <div className="space-y-6">
          <Card className="bg-slate-900 text-white border-0 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <IndianRupee className="w-24 h-24" />
            </div>
            <CardHeader className="relative z-10 pb-0">
              <CardTitle className="text-lg text-slate-200">Financial Summary</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Total Fee</span>
                <span className="font-bold text-lg">₹{appointment.totalAmount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Advance Paid</span>
                <span className="font-medium text-emerald-400">₹{appointment.advancePaid}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-700 pb-4">
                <span className="text-slate-400 text-sm">Balance Paid</span>
                <span className="font-medium text-emerald-400">₹{appointment.balancePaid}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-300 font-medium">Pending Balance</span>
                <span className="font-bold text-2xl text-amber-400">₹{remainingBalance}</span>
              </div>

              {isAdmin && remainingBalance > 0 && appointment.status !== "CANCELLED" && (
                <Dialog open={payOpen} onOpenChange={setPayOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white border-0">
                      Collect ₹{remainingBalance} Balance
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Record Balance Payment</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Amount Received</Label>
                        <Input 
                          type="number" 
                          value={balanceAmount} 
                          onChange={e => setBalanceAmount(Number(e.target.value))}
                          max={remainingBalance}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Payment Method</Label>
                        <select 
                          value={paymentMethod}
                          onChange={e => setPaymentMethod(e.target.value)}
                          className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                        >
                          <option value="CASH">Cash</option>
                          <option value="UPI">UPI</option>
                          <option value="CARD">Card POS</option>
                          <option value="BANK_TRANSFER">Bank Transfer</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Notes (Optional)</Label>
                        <Input value={paymentNotes} onChange={e => setPaymentNotes(e.target.value)} placeholder="Transaction ID or notes" />
                      </div>
                      <Button onClick={handlePayment} disabled={loading} className="w-full">
                        Mark as Received
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
