"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ApplicationModal({ isOpen, onClose, selectedJob }: { isOpen: boolean, onClose: () => void, selectedJob: any }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    qualifications: "",
    experience: "",
    currentOrg: "",
    specialisation: "",
    message: "",
  });

  const submitApplication = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      // Send directly without resume upload
      const payload = {
        ...formData,
        position: selectedJob?.title || "General Application",
        jobOpeningId: selectedJob?.id || null,
        resumeUrl: "Not Provided", // dummy string since DB schema requires it
      };

      const submitRes = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!submitRes.ok) {
        throw new Error("Failed to submit application");
      }

      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setStep(1);
        setFormData({ name: "", email: "", phone: "", qualifications: "", experience: "", currentOrg: "", specialisation: "", message: "" });
      }, 3000);

    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
            onClick={onClose} 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-[#F5F5F4] flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-2xl font-display font-medium text-[#1C1917]">
                  {selectedJob ? `Apply for ${selectedJob.title}` : "Join Our Faculty"}
                </h3>
                <p className="text-[#78716C] text-sm mt-1">Please fill out the form below to submit your application.</p>
              </div>
              <button onClick={onClose} className="p-2 text-[#A8A29E] hover:text-[#1C1917] hover:bg-[#F5F5F4] rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-8 overflow-y-auto custom-scrollbar">
              {isSuccess ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-[#D1FAE5] text-[#047857] rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-2xl font-display font-medium text-[#1C1917] mb-2">Application Received!</h4>
                  <p className="text-[#57534E]">Thank you for your interest. Our team will review your application and get back to you shortly.</p>
                </div>
              ) : (
                <form id="applicationForm" onSubmit={submitApplication}>
                  
                  {step === 1 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-[#292524] mb-1.5">Full Name *</label>
                          <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#E7E5E4] bg-[#FCFBF9] focus:outline-none focus:ring-2 focus:ring-[#00A693]/20 focus:border-[#00A693] transition-all" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#292524] mb-1.5">Email Address *</label>
                          <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#E7E5E4] bg-[#FCFBF9] focus:outline-none focus:ring-2 focus:ring-[#00A693]/20 focus:border-[#00A693] transition-all" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#292524] mb-1.5">Phone Number *</label>
                        <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#E7E5E4] bg-[#FCFBF9] focus:outline-none focus:ring-2 focus:ring-[#00A693]/20 focus:border-[#00A693] transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#292524] mb-1.5">Professional Category *</label>
                        <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#E7E5E4] bg-[#FCFBF9] focus:outline-none focus:ring-2 focus:ring-[#00A693]/20 focus:border-[#00A693] transition-all appearance-none">
                          <option value="" disabled>Select your professional category</option>
                          {[
                            "Clinical Psychologist", "Child Psychologist", "Counsellor", 
                            "Child & Adolescent Counsellor", "Special or Remedial Educator", 
                            "Educational Psychologist", "Career Counsellor", "Occupational Therapist", 
                            "Speech & Language Therapist", "Behaviour Therapist", "ABA Therapist", 
                            "Learning Support Specialist", "Parent & Family Counsellor", 
                            "Audiologist", "Teacher / Faculty", "Consultant"
                          ].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#292524] mb-1.5">Highest Qualification *</label>
                        <input required type="text" value={formData.qualifications} onChange={e => setFormData({...formData, qualifications: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#E7E5E4] bg-[#FCFBF9] focus:outline-none focus:ring-2 focus:ring-[#00A693]/20 focus:border-[#00A693] transition-all" />
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-[#292524] mb-1.5">Years of Experience *</label>
                          <input required type="text" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#E7E5E4] bg-[#FCFBF9] focus:outline-none focus:ring-2 focus:ring-[#00A693]/20 focus:border-[#00A693] transition-all" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#292524] mb-1.5">Current Organization</label>
                          <input type="text" value={formData.currentOrg} onChange={e => setFormData({...formData, currentOrg: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#E7E5E4] bg-[#FCFBF9] focus:outline-none focus:ring-2 focus:ring-[#00A693]/20 focus:border-[#00A693] transition-all" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#292524] mb-1.5">Areas of Specialisation</label>
                        <input type="text" value={formData.specialisation} onChange={e => setFormData({...formData, specialisation: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#E7E5E4] bg-[#FCFBF9] focus:outline-none focus:ring-2 focus:ring-[#00A693]/20 focus:border-[#00A693] transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#292524] mb-1.5">Cover Letter / Message</label>
                        <textarea rows={3} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#E7E5E4] bg-[#FCFBF9] focus:outline-none focus:ring-2 focus:ring-[#00A693]/20 focus:border-[#00A693] transition-all resize-none" />
                      </div>
                    </div>
                  )}

                </form>
              )}
            </div>

            {/* Footer */}
            {!isSuccess && (
              <div className="px-8 py-5 border-t border-[#F5F5F4] bg-[#FCFBF9] flex items-center justify-between sticky bottom-0">
                <div className="flex gap-2">
                  <div className={`w-2 h-2 rounded-full ${step === 1 ? 'bg-[#00A693]' : 'bg-[#D6D3D1]'}`} />
                  <div className={`w-2 h-2 rounded-full ${step === 2 ? 'bg-[#00A693]' : 'bg-[#D6D3D1]'}`} />
                </div>
                
                <div className="flex gap-3">
                  {step === 2 && (
                    <Button type="button" variant="outline" onClick={() => setStep(1)} disabled={isSubmitting} className="rounded-xl border-[#E7E5E4] text-[#57534E] hover:bg-[#F5F5F4] px-6 h-11">
                      Back
                    </Button>
                  )}
                  {step === 1 ? (
                    <Button type="button" onClick={() => setStep(2)} className="bg-[#00A693] hover:bg-[#047857] text-white rounded-xl px-8 h-11 shadow-sm">
                      Next Step
                    </Button>
                  ) : (
                    <Button type="submit" form="applicationForm" disabled={isSubmitting} className="bg-[#00A693] hover:bg-[#047857] text-white rounded-xl px-8 h-11 shadow-sm">
                      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Application"}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
