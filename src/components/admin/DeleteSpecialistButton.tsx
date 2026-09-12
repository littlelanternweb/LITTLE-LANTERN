"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteSpecialist } from "@/app/actions/admin-specialists";

export function DeleteSpecialistButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this specialist? This will permanently delete their profile, appointments, and schedules.")) return;
    setLoading(true);
    await deleteSpecialist(id);
    setLoading(false);
  };

  return (
    <Button 
      onClick={handleDelete} 
      disabled={loading} 
      variant="ghost" 
      size="icon" 
      className="text-red-400 hover:text-red-600 hover:bg-red-50"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}
