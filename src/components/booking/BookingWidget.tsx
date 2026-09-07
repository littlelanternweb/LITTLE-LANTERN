"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { getAvailableSlots } from "@/app/actions/booking";
import { Loader2 } from "lucide-react";

export function BookingWidget({ specialistId, fee }: { specialistId: string, fee: number }) {
  const [step, setStep] = useState(1);
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

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

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

      // 3. Initialize Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_TYp8jX5XxhQIuV", // Fallback to provided key
        amount: data.amount,
        currency: data.currency,
        name: "Little Lantern",
        description: "Consultation Booking",
        image: "/logo.jpg",
        order_id: data.mock ? undefined : data.orderId, // only pass order_id if it's real
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
            setStep(4);
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
          color: "#1C1917",
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

  if (step === 4) {
    return (
      <Card className="border-green-100 shadow-md">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-md flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900">Booking Confirmed!</h3>
          <p className="text-slate-600">Your consultation is scheduled for {date && format(date, "MMMM d, yyyy")} at {selectedSlot}.</p>
          <p className="text-sm text-slate-500">We've sent a confirmation email to {email}.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-slate-100 rounded-3xl overflow-hidden">
      <CardHeader className="bg-slate-50 border-b border-slate-100 py-6 px-8">
        <CardTitle className="text-xl font-medium text-slate-900 flex justify-between items-center">
          <span>Book Consultation</span>
          <span className="text-primary bg-primary/10 px-3 py-1 rounded-md text-sm">₹{fee}</span>
        </CardTitle>
        
        {/* Progress Indicator */}
        {step < 4 && (
          <div className="flex items-center gap-2 mt-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex-1 h-1.5 rounded-md bg-slate-200 overflow-hidden">
                <div 
                  className={`h-full bg-primary transition-all duration-500 ${step >= i ? 'w-full' : 'w-0'}`} 
                />
              </div>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="p-8">
        
        {step === 1 && (
          <div className="space-y-6">
            {/* Two-column: calendar | time slots */}
            <div className="grid lg:grid-cols-[1fr_220px] gap-6 items-start">
              {/* Calendar — full width, large */}
              <div>
                <Label className="text-[13px] font-semibold text-slate-500 uppercase tracking-widest mb-3 block">Select Date</Label>
                <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(d) => d < new Date(new Date().setHours(0,0,0,0))}
                    className="w-full p-4"
                  />
                </div>
              </div>

              {/* Time slots — right column */}
              <div>
                <Label className="text-[13px] font-semibold text-slate-500 uppercase tracking-widest mb-3 block">
                  {date ? `${format(date, "EEE, MMM d")}` : "Select a date first"}
                </Label>

                {!date ? (
                  <div className="border border-dashed border-slate-200 rounded-2xl h-48 flex items-center justify-center text-slate-400 text-sm text-center px-4">
                    Pick a date to see available times
                  </div>
                ) : loadingSlots ? (
                  <div className="border border-slate-100 rounded-2xl h-48 flex items-center justify-center bg-white">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : slots.length === 0 ? (
                  <div className="border border-slate-100 rounded-2xl h-48 flex flex-col items-center justify-center bg-white text-center px-4 gap-2">
                    <span className="text-2xl">😔</span>
                    <p className="text-sm font-medium text-slate-700">No slots available</p>
                    <p className="text-xs text-slate-400">Try another date</p>
                  </div>
                ) : (
                  <div className="border border-slate-100 rounded-2xl bg-white overflow-hidden">
                    <div className="max-h-[340px] overflow-y-auto p-3 space-y-2">
                      {slots.map(s => (
                        <button
                          key={s.startTime}
                          onClick={() => setSelectedSlot(s.startTime)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium border transition-all duration-200 ${
                            selectedSlot === s.startTime
                              ? 'bg-primary text-white border-primary shadow-[0_2px_12px_rgba(0,166,147,0.25)]'
                              : 'bg-white text-slate-700 border-slate-100 hover:border-primary/40 hover:bg-primary/5'
                          }`}
                        >
                          <span>{s.startTime}</span>
                          <span className={`text-xs ${selectedSlot === s.startTime ? 'text-white/70' : 'text-slate-400'}`}>60 min</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Selected summary chip */}
            {date && selectedSlot && (
              <div className="flex items-center gap-3 px-4 py-3 bg-primary/5 border border-primary/15 rounded-xl text-sm font-medium text-primary">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                {format(date, "EEEE, MMMM d, yyyy")} at {selectedSlot}
              </div>
            )}

            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-13 text-base font-medium transition-all shadow-sm disabled:opacity-40" 
              disabled={!date || !selectedSlot}
              onClick={handleNext}
            >
              Continue to Details →
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <Label className="text-[15px] font-medium text-slate-900 block">03 — Parent Details</Label>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-700">Parent Name</Label>
                <Input value={parentName} onChange={e => setParentName(e.target.value)} placeholder="Jane Doe" className="h-12 rounded-xl border-slate-200 focus-visible:ring-[#00A693]" required />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700">Phone</Label>
                <Input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" className="h-12 rounded-xl border-slate-200 focus-visible:ring-[#00A693]" required />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700">Email</Label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@example.com" className="h-12 rounded-xl border-slate-200 focus-visible:ring-[#00A693]" required />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700">Relationship with Child</Label>
                <Input value={relationship} onChange={e => setRelationship(e.target.value)} placeholder="Mother, Father, Guardian..." className="h-12 rounded-xl border-slate-200 focus-visible:ring-[#00A693]" required />
              </div>
            </div>
            
            <div className="flex gap-4 pt-4">
              <Button variant="outline" onClick={handleBack} className="w-1/3 rounded-md h-14 border-slate-200 text-slate-700 hover:bg-slate-100">Back</Button>
              <Button 
                className="w-2/3 bg-[#1C1917] hover:bg-[#292524] text-white rounded-md h-14 font-medium shadow-md" 
                onClick={handleNext}
                disabled={!parentName || !email || !phone || !relationship}
              >
                Next Step
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <Label className="text-[15px] font-medium text-slate-900 block">04 — Child & Consultation Details</Label>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-700">Child Name</Label>
                <Input value={childName} onChange={e => setChildName(e.target.value)} placeholder="John Doe" className="h-12 rounded-xl border-slate-200 focus-visible:ring-[#00A693]" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-700">Age</Label>
                  <Input type="number" min="0" max="18" value={childAge} onChange={e => setChildAge(e.target.value)} placeholder="e.g. 5" className="h-12 rounded-xl border-slate-200 focus-visible:ring-[#00A693]" required />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700">Gender</Label>
                  <select 
                    className="flex h-12 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A693]"
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
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700">Reason for Consultation</Label>
                <textarea 
                  className="w-full min-h-[100px] p-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A693] resize-none"
                  value={reason} 
                  onChange={e => setReason(e.target.value)} 
                  placeholder="Briefly describe what you'd like to discuss..." 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700">Additional Information (Optional)</Label>
                <textarea 
                  className="w-full min-h-[80px] p-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A693] resize-none"
                  value={additionalInfo} 
                  onChange={e => setAdditionalInfo(e.target.value)} 
                  placeholder="Any other details we should know?" 
                />
              </div>
            </div>
            
            <div className="bg-slate-50 p-5 rounded-xl border border-[#F5F5F4] mt-6">
              <h4 className="font-display font-medium text-slate-900 mb-3">Booking Summary</h4>
              <div className="space-y-2 text-[15px]">
                <p className="text-slate-500 flex justify-between"><span>Date:</span> <strong className="text-slate-900">{date && format(date, "MMM d, yyyy")}</strong></p>
                <p className="text-slate-500 flex justify-between"><span>Time:</span> <strong className="text-slate-900">{selectedSlot} (60 min)</strong></p>
                <p className="text-slate-500 flex justify-between pt-2 border-t border-slate-200"><span>Total Fee:</span> <strong className="text-primary">₹{fee}</strong></p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button variant="outline" onClick={handleBack} className="w-1/3 rounded-md h-14 border-slate-200 text-slate-700 hover:bg-slate-100" disabled={isSubmitting}>Back</Button>
              <Button 
                className="w-2/3 bg-gradient-to-br from-[#00A693] to-[#047857] hover:brightness-110 border-0 text-white font-medium rounded-md h-14 shadow-[0_4px_15px_rgba(0,166,147,0.3)] transition-all" 
                onClick={handleCheckout}
                disabled={!childName || !childAge || !childGender || !reason || isSubmitting}
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Pay & Confirm"}
              </Button>
            </div>
          </div>
        )}

      </CardContent>
      <div className="bg-slate-50 border-t border-[#F5F5F4] p-4 text-center">
        <a 
          href="https://wa.me/919961757373?text=Hello%20Little%20Lantern%2C%20I%20need%20help%20with%20booking%20a%20consultation." 
          target="_blank" 
          rel="noreferrer" 
          className="text-sm font-medium text-slate-500 hover:text-primary transition-colors inline-flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 3.825 0 6.938 3.112 6.938 6.938-.001 3.825-3.113 6.937-6.938 6.938z"/></svg>
          Need help booking? Chat with us on WhatsApp
        </a>
      </div>
    </Card>
  );
}
