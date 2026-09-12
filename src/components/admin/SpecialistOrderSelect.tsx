"use client";

import { useState } from "react";
import { updateSpecialistOrder } from "@/app/actions/admin-specialists";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function SpecialistOrderSelect({ id, currentOrder, totalCount }: { id: string; currentOrder: number; totalCount: number }) {
  const [loading, setLoading] = useState(false);

  const handleOrderChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newOrder = parseInt(e.target.value, 10);
    if (newOrder === currentOrder) return;

    setLoading(true);
    const res = await updateSpecialistOrder(id, newOrder);
    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("Order updated successfully");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-slate-500 font-medium">Order:</label>
      <div className="relative">
        <select
          value={currentOrder}
          onChange={handleOrderChange}
          disabled={loading}
          className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-1 pl-3 pr-8 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50"
        >
          {Array.from({ length: totalCount }).map((_, i) => (
            <option key={i} value={i + 1}>
              {i + 1}
            </option>
          ))}
          {currentOrder > totalCount && (
             <option value={currentOrder}>{currentOrder}</option>
          )}
        </select>
        {loading && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <Loader2 className="w-3 h-3 animate-spin text-slate-400" />
          </div>
        )}
      </div>
    </div>
  );
}
