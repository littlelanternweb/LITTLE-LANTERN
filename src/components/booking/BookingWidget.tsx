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
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
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
    <Card className="shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-[#F5F5F4] rounded-3xl overflow-hidden">
      <CardHeader className="bg-[#FCFBF9] border-b border-[#F5F5F4] py-6 px-8">
        <CardTitle className="text-xl font-display font-medium text-[#1C1917] flex justify-between items-center">
          <span>Book Consultation</span>
          <span className="text-[#047857] bg-[#D1FAE5] px-3 py-1 rounded-full text-sm">₹{fee}</span>
        </CardTitle>
        
        {/* Progress Indicator */}
        {step < 4 && (
          <div className="flex items-center gap-2 mt-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex-1 h-1.5 rounded-full bg-[#E7E5E4] overflow-hidden">
                <div 
                  className={`h-full bg-[#00A693] transition-all duration-500 ${step >= i ? 'w-full' : 'w-0'}`} 
                />
              </div>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="p-8">
        
        {step === 1 && (
          <div className="space-y-8">
            <div>
              <Label className="text-[15px] font-medium text-[#1C1917] mb-4 block">01 — Select Date</Label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(d) => d < new Date(new Date().setHours(0,0,0,0))}
                className="rounded-2xl border border-[#F5F5F4] bg-white mx-auto w-fit shadow-sm"
              />
            </div>
            
            {date && (
              <div>
                <Label className="text-[15px] font-medium text-[#1C1917] mb-4 block">02 — Available Time</Label>
                {loadingSlots ? (
                  <div className="flex justify-center py-6"><Loader2 className="w-6 h-6 animate-spin text-[#00A693]" /></div>
                ) : slots.length === 0 ? (
                  <div className="bg-[#FCFBF9] border border-[#F5F5F4] rounded-xl p-4 text-center">
                    <p className="text-sm text-[#78716C]">No available slots on this date.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    {slots.map(s => (
                      <button
                        key={s.startTime}
                        onClick={() => setSelectedSlot(s.startTime)}
                        className={`py-3 px-2 text-sm rounded-xl border font-medium transition-all duration-300 ${
                          selectedSlot === s.startTime 
                            ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-md scale-[1.02]' 
                            : 'bg-white text-[#57534E] border-[#E7E5E4] hover:border-[#D6D3D1] hover:bg-[#FCFBF9]'
                        }`}
                      >
                        {s.startTime}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            <Button 
              className="w-full bg-[#1C1917] hover:bg-[#292524] text-white rounded-full h-14 text-base font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50" 
              disabled={!date || !selectedSlot}
              onClick={handleNext}
            >
              Continue to Details
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <Label className="text-[15px] font-medium text-[#1C1917] block">03 — Parent Details</Label>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[#57534E]">Parent Name</Label>
                <Input value={parentName} onChange={e => setParentName(e.target.value)} placeholder="Jane Doe" className="h-12 rounded-xl border-[#E7E5E4] focus-visible:ring-[#00A693]" required />
              </div>
              <div className="space-y-2">
                <Label className="text-[#57534E]">Phone</Label>
                <Input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" className="h-12 rounded-xl border-[#E7E5E4] focus-visible:ring-[#00A693]" required />
              </div>
              <div className="space-y-2">
                <Label className="text-[#57534E]">Email</Label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@example.com" className="h-12 rounded-xl border-[#E7E5E4] focus-visible:ring-[#00A693]" required />
              </div>
              <div className="space-y-2">
                <Label className="text-[#57534E]">Relationship with Child</Label>
                <Input value={relationship} onChange={e => setRelationship(e.target.value)} placeholder="Mother, Father, Guardian..." className="h-12 rounded-xl border-[#E7E5E4] focus-visible:ring-[#00A693]" required />
              </div>
            </div>
            
            <div className="flex gap-4 pt-4">
              <Button variant="outline" onClick={handleBack} className="w-1/3 rounded-full h-14 border-[#E7E5E4] text-[#57534E] hover:bg-[#F5F5F4]">Back</Button>
              <Button 
                className="w-2/3 bg-[#1C1917] hover:bg-[#292524] text-white rounded-full h-14 font-medium shadow-md" 
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
            <Label className="text-[15px] font-medium text-[#1C1917] block">04 — Child & Consultation Details</Label>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[#57534E]">Child Name</Label>
                <Input value={childName} onChange={e => setChildName(e.target.value)} placeholder="John Doe" className="h-12 rounded-xl border-[#E7E5E4] focus-visible:ring-[#00A693]" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#57534E]">Age</Label>
                  <Input type="number" min="0" max="18" value={childAge} onChange={e => setChildAge(e.target.value)} placeholder="e.g. 5" className="h-12 rounded-xl border-[#E7E5E4] focus-visible:ring-[#00A693]" required />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#57534E]">Gender</Label>
                  <select 
                    className="flex h-12 w-full rounded-xl border border-[#E7E5E4] bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A693]"
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
                <Label className="text-[#57534E]">Reason for Consultation</Label>
                <textarea 
                  className="w-full min-h-[100px] p-4 rounded-xl border border-[#E7E5E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#00A693] resize-none"
                  value={reason} 
                  onChange={e => setReason(e.target.value)} 
                  placeholder="Briefly describe what you'd like to discuss..." 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#57534E]">Additional Information (Optional)</Label>
                <textarea 
                  className="w-full min-h-[80px] p-4 rounded-xl border border-[#E7E5E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#00A693] resize-none"
                  value={additionalInfo} 
                  onChange={e => setAdditionalInfo(e.target.value)} 
                  placeholder="Any other details we should know?" 
                />
              </div>
            </div>
            
            <div className="bg-[#FCFBF9] p-5 rounded-xl border border-[#F5F5F4] mt-6">
              <h4 className="font-display font-medium text-[#1C1917] mb-3">Booking Summary</h4>
              <div className="space-y-2 text-[15px]">
                <p className="text-[#78716C] flex justify-between"><span>Date:</span> <strong className="text-[#1C1917]">{date && format(date, "MMM d, yyyy")}</strong></p>
                <p className="text-[#78716C] flex justify-between"><span>Time:</span> <strong className="text-[#1C1917]">{selectedSlot} (60 min)</strong></p>
                <p className="text-[#78716C] flex justify-between pt-2 border-t border-[#E7E5E4]"><span>Total Fee:</span> <strong className="text-[#047857]">₹{fee}</strong></p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button variant="outline" onClick={handleBack} className="w-1/3 rounded-full h-14 border-[#E7E5E4] text-[#57534E] hover:bg-[#F5F5F4]" disabled={isSubmitting}>Back</Button>
              <Button 
                className="w-2/3 bg-gradient-to-br from-[#00A693] to-[#047857] hover:brightness-110 border-0 text-white font-medium rounded-full h-14 shadow-[0_4px_15px_rgba(0,166,147,0.3)] transition-all" 
                onClick={handleCheckout}
                disabled={!childName || !childAge || !childGender || !reason || isSubmitting}
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Pay & Confirm"}
              </Button>
            </div>
          </div>
        )}

      </CardContent>
      <div className="bg-[#FCFBF9] border-t border-[#F5F5F4] p-4 text-center">
        <a 
          href="https://wa.me/919961757373?text=Hello%20Little%20Lantern%2C%20I%20need%20help%20with%20booking%20a%20consultation." 
          target="_blank" 
          rel="noreferrer" 
          className="text-sm font-medium text-[#78716C] hover:text-[#166534] transition-colors inline-flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 3.825 0 6.938 3.112 6.938 6.938-.001 3.825-3.113 6.937-6.938 6.938z"/></svg>
          Need help booking? Chat with us on WhatsApp
        </a>
      </div>
    </Card>
  );
}
