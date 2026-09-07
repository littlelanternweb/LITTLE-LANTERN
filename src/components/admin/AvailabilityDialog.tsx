"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { updateSpecialistAvailability } from "@/app/actions/admin-specialists";
import { toast } from "sonner";
import { Loader2, Calendar, Plus, Trash2 } from "lucide-react";

const DAYS_OF_WEEK = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

export function AvailabilityDialog({ 
  specialist
}: { 
  specialist: any; 
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Clone the initial availability so we can mutate it freely
  const [availabilities, setAvailabilities] = useState<any[]>(
    specialist?.availability || []
  );

  const addRule = () => {
    setAvailabilities([...availabilities, { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" }]);
  };

  const removeRule = (index: number) => {
    setAvailabilities(availabilities.filter((_, i) => i !== index));
  };

  const updateRule = (index: number, field: string, value: any) => {
    const newRules = [...availabilities];
    newRules[index][field] = field === "dayOfWeek" ? Number(value) : value;
    setAvailabilities(newRules);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Clean up data for prisma
    const cleanData = availabilities.map(a => ({
      dayOfWeek: a.dayOfWeek,
      startTime: a.startTime,
      endTime: a.endTime
    }));

    const res = await updateSpecialistAvailability(specialist.id, cleanData);
    
    setLoading(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Availability updated successfully!");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full sm:w-auto text-slate-600">
          <Calendar className="w-4 h-4 mr-2" /> Manage Availability
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Availability - {specialist.name}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-4">
            <Label>Working Hours</Label>
            
            {availabilities.length === 0 ? (
              <div className="text-sm text-slate-500 italic p-4 bg-slate-50 rounded-md text-center">
                No availability rules configured. The specialist will appear as unavailable.
              </div>
            ) : (
              <div className="space-y-3">
                {availabilities.map((rule, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-slate-50 p-3 rounded-md border border-slate-100">
                    <select 
                      value={rule.dayOfWeek}
                      onChange={(e) => updateRule(idx, "dayOfWeek", e.target.value)}
                      className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 w-1/3"
                    >
                      {DAYS_OF_WEEK.map((day, i) => (
                        <option key={i} value={i}>{day}</option>
                      ))}
                    </select>

                    <input 
                      type="time" 
                      value={rule.startTime}
                      onChange={(e) => updateRule(idx, "startTime", e.target.value)}
                      className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 w-1/4"
                      required
                    />
                    <span className="text-slate-400">to</span>
                    <input 
                      type="time" 
                      value={rule.endTime}
                      onChange={(e) => updateRule(idx, "endTime", e.target.value)}
                      className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 w-1/4"
                      required
                    />

                    <Button type="button" variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => removeRule(idx)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <Button type="button" variant="outline" size="sm" onClick={addRule} className="w-full mt-2 border-dashed">
              <Plus className="w-4 h-4 mr-2" /> Add Time Slot
            </Button>
          </div>

          <Button type="submit" className="w-full bg-slate-900 text-white hover:bg-slate-800" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Save Availability
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
