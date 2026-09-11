"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getAvailableSlots } from "@/app/actions/booking";
import { Loader2, HelpCircle } from "lucide-react";

export function BookingWidget({ specialistId, fee }: { specialistId: string, fee: number }) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [slots, setSlots] = useState<{startTime: string, endTime: string}[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Form states
  const [parentName, setParentName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [relationship, setRelationship] = useState("");
  
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("");
  const [childGender, setChildGender] = useState("");
  const [reason, setReason] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (date) {
      setLoadingSlots(true);
      setSelectedSlot(null);
      getAvailableSlots(specialistId, format(date, "yyyy-MM-dd"))
        .then(res => setSlots(res))
        .catch(() => toast.error("Failed to load slots"))
        .finally(() => setLoadingSlots(false));
    }
  }, [date, specialistId]);

  const handleCheckout = async () => {
    if (!date || !selectedSlot) return;
    setIsSubmitting(true);
    
    try {
      // 1. Load Razorpay script
      const resScript = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!resScript) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        setIsSubmitting(false);
        return;
      }

      // 2. Call backend to create appointment (and order if backend has secret)
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          specialistId,
          date: format(date, "yyyy-MM-dd"),
          startTime: selectedSlot,
          parentName,
          email,
          phone,
          relationship,
          childName,
          childAge,
          childGender,
          reason,
          additionalInfo,
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // 3. Initialize Razorpay Checkout (or Mock Bypass)
      if (data.mock) {
        // Test Mode / Local Bypass
        await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            appointmentId: data.appointmentId,
            razorpay_payment_id: `mock_pay_${Date.now()}`,
            razorpay_order_id: data.orderId,
            razorpay_signature: "mock_signature"
          })
        });
        toast.success("Test Booking confirmed successfully!");
        setIsSuccess(true);
        setIsSubmitting(false);
        return;
      }

      // Real Razorpay Flow
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
        amount: data.amount,
        currency: data.currency,
        name: "Little Lantern",
        description: "Consultation Booking",
        image: "/logo.jpg",
        order_id: data.orderId,
        handler: async function (response: any) {
          try {
            // 4. Verify payment on backend
            await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                appointmentId: data.appointmentId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              })
            });
            toast.success("Booking confirmed successfully!");
            setIsSuccess(true);
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: parentName,
          email: email,
          contact: phone,
        },
        theme: {
          color: "#00A693",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
      
    } catch (e: any) {
      toast.error(e.message || "Checkout failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadScript = (src: string) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const isFormValid = parentName && email && phone && relationship && childName && childAge && childGender && reason;
  const advanceAmount = Math.round(fee * 0.25);

  if (isSuccess) {
    return (
      <div className="text-center space-y-4 py-8">
        <div className="w-20 h-20 bg-[#D1FAE5] text-[#047857] rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h3 className="text-2xl font-bold text-slate-900">Booking Confirmed!</h3>
        <p className="text-slate-600 text-lg">Your consultation is scheduled for <strong>{date && format(date, "MMMM d, yyyy")}</strong> at <strong>{selectedSlot}</strong>.</p>
        
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 inline-block my-4 text-left">
          <p className="text-sm text-slate-700 flex items-center justify-between gap-6 mb-1">
            <span>Advance Paid:</span> <strong>₹{advanceAmount}</strong>
          </p>
          <p className="text-sm text-slate-700 flex items-center justify-between gap-6">
            <span>Balance due at clinic:</span> <strong>₹{fee - advanceAmount}</strong>
          </p>
        </div>
        
        <p className="text-sm text-slate-500 mt-4">We've sent a confirmation email to {email}.</p>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[340px_1fr] gap-6 lg:gap-10 items-start">
      {/* LEFT COLUMN: Calendar & Sticky Summary */}
      <div className="lg:sticky lg:top-8 space-y-4">
        <div>
          <Label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 block">1. Select Date</Label>
          <div className="border border-slate-100 rounded-xl overflow-hidden bg-white shadow-sm p-2">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(d) => d < new Date(new Date().setHours(0,0,0,0))}
              className="w-full mx-auto [--cell-size:2.25rem] sm:[--cell-size:2.5rem]"
            />
          </div>
        </div>

        {/* Selected Date Summary */}
        {date && selectedSlot && (
           <div className="bg-[#F0FDF4] border border-[#A7F3D0] rounded-xl p-3 text-sm animate-in fade-in slide-in-from-top-2">
             <p className="text-slate-500 font-medium text-[11px] uppercase tracking-wider mb-1">Selected Time</p>
             <p className="text-[#047857] font-semibold flex items-center gap-2">
               <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
               {format(date, "EEE, MMM d, yyyy")} • {selectedSlot}
             </p>
           </div>
        )}

        <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-center flex items-center justify-center gap-2 mt-4">
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <a 
            href="https://wa.me/919961757373?text=Hello%20Little%20Lantern%2C%20I%20need%20help%20with%20booking%20a%20consultation." 
            target="_blank" 
            rel="noreferrer" 
            className="text-[13px] font-medium text-slate-500 hover:text-primary transition-colors"
          >
            Need help? Chat with us
          </a>
        </div>
      </div>

      {/* RIGHT COLUMN: Form & Slots */}
      <div className="space-y-6">
        
        {/* TIME SLOTS */}
        <section>
           <Label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 block">
             2. Available Time Slots
           </Label>
           {!date ? (
              <div className="border border-dashed border-slate-200 rounded-xl h-24 flex items-center justify-center text-slate-400 text-sm">
                Pick a date to see times
              </div>
           ) : loadingSlots ? (
              <div className="border border-slate-100 rounded-xl h-24 flex items-center justify-center bg-slate-50">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
           ) : slots.length === 0 ? (
              <div className="border border-slate-100 rounded-xl py-6 flex flex-col items-center justify-center bg-slate-50 text-center">
                <span className="text-xl mb-1">😔</span>
                <p className="text-[13px] font-medium text-slate-600">No slots available</p>
                <p className="text-[11px] text-slate-400">Try another date</p>
              </div>
           ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                 {slots.map(s => (
                   <button
                     key={s.startTime}
                     onClick={() => setSelectedSlot(s.startTime)}
                     className={`w-full py-2 px-1 rounded-lg text-[13px] font-medium border transition-colors ${
                       selectedSlot === s.startTime
                         ? 'bg-primary text-white border-primary shadow-sm'
                         : 'bg-white text-slate-700 border-slate-200 hover:border-primary/40 hover:bg-primary/5'
                     }`}
                   >
                     {s.startTime}
                   </button>
                 ))}
              </div>
           )}
        </section>

        {/* BOOKING FORM */}
        <div className={`space-y-6 transition-all duration-300 ${(!date || !selectedSlot) ? 'opacity-40 pointer-events-none grayscale-[0.2]' : 'opacity-100'}`}>
           
           <section>
              <h3 className="text-[13px] font-semibold text-slate-500 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">3. Parent Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                 <div className="space-y-1.5">
                   <Label className="text-xs text-slate-600">Parent Name</Label>
                   <Input value={parentName} onChange={e => setParentName(e.target.value)} className="h-10 text-sm rounded-lg" required />
                 </div>
                 <div className="space-y-1.5">
                   <Label className="text-xs text-slate-600">Phone Number</Label>
                   <Input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="h-10 text-sm rounded-lg" required />
                 </div>
                 <div className="space-y-1.5">
                   <Label className="text-xs text-slate-600">Email Address</Label>
                   <Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="h-10 text-sm rounded-lg" required />
                 </div>
                 <div className="space-y-1.5">
                   <Label className="text-xs text-slate-600">Relationship to Child</Label>
                   <Input value={relationship} onChange={e => setRelationship(e.target.value)} className="h-10 text-sm rounded-lg" required />
                 </div>
              </div>
           </section>

           <section>
              <h3 className="text-[13px] font-semibold text-slate-500 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">4. Child Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                 <div className="space-y-1.5">
                   <Label className="text-xs text-slate-600">Child Name</Label>
                   <Input value={childName} onChange={e => setChildName(e.target.value)} className="h-10 text-sm rounded-lg" required />
                 </div>
                 <div className="space-y-1.5">
                   <Label className="text-xs text-slate-600">Age</Label>
                   <Input type="number" min="0" max="18" value={childAge} onChange={e => setChildAge(e.target.value)} className="h-10 text-sm rounded-lg" required />
                 </div>
                 <div className="space-y-1.5">
                   <Label className="text-xs text-slate-600">Gender</Label>
                   <select 
                     className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                     value={childGender} 
                     onChange={e => setChildGender(e.target.value)} 
                     required
                   >
                     <option value="" disabled>Select Gender</option>
                     <option value="Male">Male</option>
                     <option value="Female">Female</option>
                     <option value="Other">Other</option>
                     <option value="Prefer not to say">Prefer not to say</option>
                   </select>
                 </div>
                 <div className="space-y-1.5">
                   <Label className="text-xs text-slate-600">Reason for Visit</Label>
                   <Input value={reason} onChange={e => setReason(e.target.value)} placeholder="Briefly describe issue..." className="h-10 text-sm rounded-lg" required />
                 </div>
              </div>
           </section>

           {/* STICKY CTA */}
           <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-4 shadow-[0_4px_20px_rgb(0,0,0,0.05)] z-10">
              <div className="text-sm text-slate-700 text-center sm:text-left w-full sm:w-auto">
                <p>Advance: <strong className="text-slate-900 text-lg">₹{advanceAmount}</strong></p>
                <p className="text-xs text-slate-500">Balance at clinic: ₹{fee - advanceAmount}</p>
              </div>
              <Button 
                onClick={handleCheckout}
                disabled={isSubmitting || !isFormValid}
                className="w-full sm:w-auto px-6 bg-[#00A693] hover:bg-[#047857] text-white font-medium h-12 rounded-lg transition-colors"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {isSubmitting ? "Processing..." : `Pay ₹${advanceAmount} & Book`}
              </Button>
           </div>

        </div>

      </div>
    </div>
  );
}
