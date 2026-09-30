"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { adminMarkSubscriptionPaid, adminGrantFreeSubscription } from "@/app/actions/admin-subscription";
import { Check, Gift, IndianRupee } from "lucide-react";
import { toast } from "sonner";

export function ManageSubscriptionDialog({ specialist, defaultFee }: { specialist: any, defaultFee: number }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCashPayment = async () => {
    try {
      setIsLoading(true);
      await adminMarkSubscriptionPaid(specialist.id, defaultFee);
      toast.success("Subscription marked as Paid (Cash)");
      setOpen(false);
    } catch (e) {
      toast.error("Failed to update subscription");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFreeSubscription = async () => {
    try {
      setIsLoading(true);
      await adminGrantFreeSubscription(specialist.id);
      toast.success("Free Subscription granted");
      setOpen(false);
    } catch (e) {
      toast.error("Failed to grant free subscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full sm:w-auto text-slate-600">
          <Check className="w-4 h-4 mr-2" /> Manage Subscription
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Subscription for {specialist.name}</DialogTitle>
          <DialogDescription>
            Current Status: <strong>{specialist.subscriptionStatus}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Button 
            className="w-full justify-start bg-emerald-600 hover:bg-emerald-700" 
            onClick={handleCashPayment} 
            disabled={isLoading}
          >
            <IndianRupee className="w-4 h-4 mr-2" /> Mark Paid via Cash (₹{defaultFee})
          </Button>
          <Button 
            className="w-full justify-start bg-indigo-600 hover:bg-indigo-700" 
            onClick={handleFreeSubscription} 
            disabled={isLoading}
          >
            <Gift className="w-4 h-4 mr-2" /> Grant Free Subscription
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
