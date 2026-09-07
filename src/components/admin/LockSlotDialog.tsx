"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { addLockedSlot, removeLockedSlot } from "@/app/actions/admin-specialists";
import { toast } from "sonner";
import { Loader2, Lock, Unlock, Plus } from "lucide-react";
import { format } from "date-fns";

export function LockSlotDialog({ 
  specialist 
}: { 
  specialist: any; 
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reason, setReason] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await addLockedSlot({
      specialistId: specialist.id,
      date,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      reason
    });
    
    setLoading(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Slot locked successfully!");
      // Reset form
      setDate("");
      setStartTime("");
      setEndTime("");
      setReason("");
    }
  };

  const handleRemove = async (id: string) => {
    const res = await removeLockedSlot(id);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Slot unlocked!");
    }
  };

  // Sort locks to show newest/upcoming first
  const activeLocks = specialist.lockedSlots?.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full sm:w-auto text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
          <Lock className="w-4 h-4 mr-2" /> Lock Slots
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Lock Slots / Leaves - {specialist.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          
          <form onSubmit={handleAdd} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            <h4 className="font-medium text-slate-900 text-sm">Add New Lock / Exception</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" value={date} onChange={e => setDate(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Reason (Optional)</Label>
                <Input placeholder="e.g. Personal Leave" value={reason} onChange={e => setReason(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time (Optional)</Label>
                <Input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
                <p className="text-[10px] text-slate-500">Leave blank for full day</p>
              </div>
              <div className="space-y-2">
                <Label>End Time (Optional)</Label>
                <Input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
              </div>
            </div>

            <Button type="submit" className="w-full bg-slate-900 text-white hover:bg-slate-800" disabled={loading || !date}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              Lock Slot
            </Button>
          </form>

          <div className="space-y-3">
            <h4 className="font-medium text-slate-900 text-sm">Active Locked Slots</h4>
            
            {activeLocks.length === 0 ? (
              <div className="text-sm text-slate-500 italic p-4 bg-white border border-slate-100 rounded-md text-center">
                No active locks or leaves configured.
              </div>
            ) : (
              <div className="space-y-2">
                {activeLocks.map((lock: any) => (
                  <div key={lock.id} className="flex items-center justify-between bg-white p-3 rounded-md border border-slate-200 shadow-sm">
                    <div>
                      <p className="font-medium text-sm text-slate-900">{format(new Date(lock.date), "MMM d, yyyy")}</p>
                      <p className="text-xs text-slate-500">
                        {lock.startTime && lock.endTime ? `${lock.startTime} - ${lock.endTime}` : "Full Day"}
                        {lock.reason && ` • ${lock.reason}`}
                      </p>
                    </div>
                    <Button type="button" variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" onClick={() => handleRemove(lock.id)}>
                      <Unlock className="w-4 h-4 mr-2" /> Unlock
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
