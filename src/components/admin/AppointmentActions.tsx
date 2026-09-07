"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Eye, XCircle, CalendarClock, Activity, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cancelAppointment, changeAppointmentStatus, rescheduleAppointment } from "@/app/actions/admin-appointments";
import { toast } from "sonner";

export function AppointmentActions({ appointment, permissions }: { appointment: any, permissions: any }) {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // States for actions
  const [cancelReason, setCancelReason] = useState("");
  const [newStatus, setNewStatus] = useState(appointment.status);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const handleCancel = async () => {
    setLoading(true);
    const res = await cancelAppointment(appointment.id, cancelReason);
    setLoading(false);
    if (res.error) toast.error(res.error);
    else {
      toast.success("Appointment cancelled successfully.");
      setActiveModal(null);
    }
  };

  const handleChangeStatus = async () => {
    setLoading(true);
    const res = await changeAppointmentStatus(appointment.id, newStatus);
    setLoading(false);
    if (res.error) toast.error(res.error);
    else {
      toast.success("Status updated successfully.");
      setActiveModal(null);
    }
  };

  const handleReschedule = async () => {
    if (!newDate || !newTime) {
      toast.error("Please provide both a new date and time.");
      return;
    }
    setLoading(true);
    const res = await rescheduleAppointment(appointment.id, newDate, newTime);
    setLoading(false);
    if (res.error) toast.error(res.error);
    else {
      toast.success("Appointment rescheduled successfully.");
      setActiveModal(null);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          
          <DropdownMenuItem onClick={() => setActiveModal("details")}>
            <Eye className="w-4 h-4 mr-2 text-slate-500" /> View Details
          </DropdownMenuItem>

          {permissions.canManage && (
            <DropdownMenuItem onClick={() => setActiveModal("status")}>
              <Activity className="w-4 h-4 mr-2 text-blue-500" /> Change Status
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          {permissions.canReschedule && appointment.status !== 'CANCELLED' && (
            <DropdownMenuItem onClick={() => setActiveModal("reschedule")}>
              <CalendarClock className="w-4 h-4 mr-2 text-amber-500" /> Reschedule
            </DropdownMenuItem>
          )}

          {permissions.canCancel && appointment.status !== 'CANCELLED' && (
            <DropdownMenuItem onClick={() => setActiveModal("cancel")}>
              <XCircle className="w-4 h-4 mr-2 text-red-500" /> Cancel Appointment
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Details Modal */}
      <Dialog open={activeModal === "details"} onOpenChange={(val) => setActiveModal(val ? "details" : null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            
            {/* Appointment Info */}
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-semibold text-slate-900 text-sm mb-3">Booking Information</h4>
                <div className="space-y-2 text-sm text-slate-600">
                  <p className="flex justify-between"><span>ID:</span> <span className="font-mono text-xs">{appointment.id}</span></p>
                  <p className="flex justify-between"><span>Date:</span> <span className="font-medium text-slate-900">{format(new Date(appointment.date), "MMMM d, yyyy")}</span></p>
                  <p className="flex justify-between"><span>Time:</span> <span className="font-medium text-slate-900">{appointment.startTime} - {appointment.endTime}</span></p>
                  <p className="flex justify-between"><span>Specialist:</span> <span className="font-medium text-slate-900">{appointment.specialist.name}</span></p>
                  <p className="flex justify-between"><span>Status:</span> <span className="font-medium text-slate-900">{appointment.status}</span></p>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-semibold text-slate-900 text-sm mb-3">Payment Details</h4>
                {appointment.payment ? (
                  <div className="space-y-2 text-sm text-slate-600">
                    <p className="flex justify-between"><span>Amount:</span> <span className="font-medium text-slate-900">₹{appointment.payment.amount}</span></p>
                    <p className="flex justify-between"><span>Status:</span> <span className="font-medium text-slate-900">{appointment.payment.status}</span></p>
                    <p className="flex flex-col gap-1 mt-2">
                      <span className="text-xs">Order ID:</span>
                      <span className="font-mono text-[10px] break-all bg-white p-1 border rounded">{appointment.payment.razorpayOrderId}</span>
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic">No payment record found (Mock or pending).</p>
                )}
              </div>
            </div>

            {/* Customer & Child Info */}
            <div className="space-y-4">
              <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                <h4 className="font-semibold text-slate-900 text-sm mb-3">Customer (Parent)</h4>
                <div className="space-y-2 text-sm text-slate-600">
                  <p><strong>Name:</strong> {appointment.customer.name}</p>
                  <p><strong>Email:</strong> {appointment.customer.email}</p>
                  <p><strong>Phone:</strong> {appointment.customer.phone}</p>
                  <p><strong>Relationship:</strong> {appointment.child.relationship}</p>
                </div>
              </div>

              <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                <h4 className="font-semibold text-slate-900 text-sm mb-3">Child & Consultation</h4>
                <div className="space-y-2 text-sm text-slate-600">
                  <p><strong>Name:</strong> {appointment.child.name}</p>
                  <p><strong>Age:</strong> {appointment.child.age} • <strong>Gender:</strong> {appointment.child.gender}</p>
                  <div className="pt-2 mt-2 border-t border-amber-200/50">
                    <p className="font-medium text-slate-900 mb-1">Reason for consultation:</p>
                    <p className="text-slate-700 bg-white p-2 rounded border border-amber-100">{appointment.reason}</p>
                  </div>
                  {appointment.additionalInfo && (
                    <div className="pt-2 mt-2">
                      <p className="font-medium text-slate-900 mb-1">Additional Info:</p>
                      <p className="text-slate-700 bg-white p-2 rounded border border-amber-100">{appointment.additionalInfo}</p>
                    </div>
                  )}
                  {appointment.cancellationReason && (
                    <div className="pt-2 mt-2">
                      <p className="font-medium text-red-700 mb-1">Cancellation Reason:</p>
                      <p className="text-red-700 bg-red-50 p-2 rounded border border-red-100">{appointment.cancellationReason}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Modal */}
      <Dialog open={activeModal === "cancel"} onOpenChange={(val) => setActiveModal(val ? "cancel" : null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Cancel Appointment</DialogTitle>
            <DialogDescription>
              This will release the slot and mark the appointment as cancelled. The payment refund must be processed manually via the Razorpay dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Cancellation Reason (Optional)</Label>
              <Input value={cancelReason} onChange={e => setCancelReason(e.target.value)} placeholder="e.g. Customer requested, Specialist unavailable" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveModal(null)} disabled={loading}>Close</Button>
            <Button variant="destructive" onClick={handleCancel} disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Modal */}
      <Dialog open={activeModal === "reschedule"} onOpenChange={(val) => setActiveModal(val ? "reschedule" : null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>
              Select a new date and time for this appointment. This assumes you have already checked the specialist's availability with them.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>New Date</Label>
                <Input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>New Start Time</Label>
                <Input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveModal(null)} disabled={loading}>Close</Button>
            <Button onClick={handleReschedule} disabled={loading || !newDate || !newTime} className="bg-amber-500 hover:bg-amber-400 text-slate-950">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Status Modal */}
      <Dialog open={activeModal === "status"} onOpenChange={(val) => setActiveModal(val ? "status" : null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Status</DialogTitle>
            <DialogDescription>
              Manually correct the appointment status. This action will be logged.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                value={newStatus}
                onChange={e => setNewStatus(e.target.value)}
              >
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveModal(null)} disabled={loading}>Close</Button>
            <Button onClick={handleChangeStatus} disabled={loading || newStatus === appointment.status} className="bg-blue-600 hover:bg-blue-700 text-white">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
