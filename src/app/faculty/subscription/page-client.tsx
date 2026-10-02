"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function SubscribeClient({ 
  specialistName, 
  category, 
  fee, 
  razorpayKey,
  status,
  nextBillingDate
}: { 
  specialistName: string, 
  category: string, 
  fee: number,
  razorpayKey: string,
  status?: string,
  nextBillingDate?: string | null
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const loadScript = (src: string) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubscribe = async () => {
    setIsProcessing(true);
    try {
      const resScript = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!resScript) {
        alert("Razorpay SDK failed to load. Are you online?");
        setIsProcessing(false);
        return;
      }

      // Create subscription on backend
      const createRes = await fetch("/api/faculty/subscription/create", {
        method: "POST"
      });
      
      if (!createRes.ok) {
        throw new Error("Failed to create subscription");
      }
      
      const { subscriptionId } = await createRes.json();

      const options = {
        key: razorpayKey,
        subscription_id: subscriptionId,
        name: "My Lantern",
        description: `Faculty Subscription - ${category}`,
        handler: function (response: any) {
          alert("Subscription successful! Your account is now active.");
          router.push("/faculty/dashboard");
        },
        theme: {
          color: "#047857",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        alert("Payment failed: " + response.error.description);
      });
      rzp.open();

    } catch (e) {
      console.error(e);
      alert("Failed to initiate subscription.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (status === "ACTIVE") {
    return (
      <Card className="rounded-3xl border-slate-100 shadow-xl overflow-hidden bg-white">
        <CardHeader className="text-center p-8 pb-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-semibold text-slate-900">Subscription Active</CardTitle>
          <CardDescription className="text-slate-500 mt-2 text-base">
            Your faculty portal is fully activated.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-4">
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-6">
            <div className="flex justify-between items-center py-2 border-b border-slate-200">
              <span className="text-sm text-slate-500">Plan</span>
              <span className="font-medium text-slate-900">{category}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-200">
              <span className="text-sm text-slate-500">Amount</span>
              <span className="font-medium text-slate-900">₹{fee} / month</span>
            </div>
            {nextBillingDate && (
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-slate-500">Next Billing Date</span>
                <span className="font-medium text-slate-900">
                  {new Date(nextBillingDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
          <Button 
            onClick={() => router.push("/faculty/dashboard")}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white h-14 rounded-xl text-lg font-medium shadow-md transition-all"
          >
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl border-slate-100 shadow-xl overflow-hidden bg-white">
      <CardHeader className="text-center p-8 pb-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
          <CreditCard className="w-8 h-8" />
        </div>
        <CardTitle className="text-2xl font-semibold text-slate-900">Activate Your Account</CardTitle>
        <CardDescription className="text-slate-500 mt-2 text-base">
          Hi {specialistName}, to start taking appointments, please activate your faculty subscription.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8 pt-4">
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center mb-6">
          <div className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">{category} Plan</div>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-3xl font-bold text-slate-900">₹{fee}</span>
            <span className="text-slate-500 font-medium">/ month</span>
          </div>
        </div>
        
        <ul className="space-y-4 mb-8">
          {[
            "Access to the Faculty Dashboard",
            "Accept and manage online appointments",
            "Automated reminders and notifications",
            "Priority support"
          ].map((feature, i) => (
            <li key={i} className="flex items-start gap-3 text-slate-700">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <Button 
          onClick={handleSubscribe} 
          disabled={isProcessing}
          className="w-full bg-primary hover:bg-emerald-700 text-white h-14 rounded-xl text-lg font-medium shadow-md transition-all"
        >
          {isProcessing ? "Processing..." : "Subscribe Now"}
        </Button>
      </CardContent>
    </Card>
  );
}
