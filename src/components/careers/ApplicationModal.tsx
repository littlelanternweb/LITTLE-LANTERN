"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UploadCloud, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedJob: any | null;
}

export function ApplicationModal({ isOpen, onClose, selectedJob }: ApplicationModalProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    qualifications: "",
    experience: "",
    currentOrg: "",
    specialisation: "",
    message: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Only allow PDF/DOC/DOCX and size < 5MB
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      setResumeFile(file);
    }
  };

  const submitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) {
      alert("Please upload your resume.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload Resume
      const fileData = new FormData();
      fileData.append("file", resumeFile);
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: fileData,
      });
      const uploadJson = await uploadRes.json();

      if (!uploadJson.success) throw new Error("File upload failed");

      // 2. Submit Application
      const applicationData = {
        ...formData,
        position: selectedJob?.title || "General Application",
        jobOpeningId: selectedJob?.id || null,
        resumeUrl: uploadJson.url,
      };

      const submitRes = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(applicationData),
      });

      if (submitRes.ok) {
        setIsSuccess(true);
      } else {
        throw new Error("Application submission failed");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while submitting your application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#1C1917]/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-[#F5F5F4] flex items-center justify-between bg-gradient-to-r from-[#F0FDF4] to-[#FCFBF9]">
              <div>
                <h2 className="text-2xl font-display font-medium text-[#1C1917]">
                  {selectedJob ? `Apply for ${selectedJob.title}` : "Join Our Team"}
                </h2>
                <p className="text-[#57534E] text-sm mt-1">Make a meaningful difference.</p>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white border border-[#E7E5E4] flex items-center justify-center text-[#57534E] hover:bg-[#F5F5F4] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-[#D1FAE5] flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-[#047857]" />
                  </div>
                  <h3 className="text-2xl font-display font-medium text-[#1C1917] mb-4">Application Received</h3>
                  <p className="text-[#57534E] max-w-md mx-auto leading-relaxed">
                    Thank you for your interest in joining Little Lantern. Our team will review your application and contact you if your profile matches an opportunity.
                  </p>
                  <Button 
                    onClick={onClose}
                    className="mt-8 bg-[#047857] hover:bg-[#065F46] text-white rounded-full px-8"
                  >
                    Back to Careers
                  </Button>
                </div>
              ) : (
                <form id="application-form" onSubmit={submitApplication} className="space-y-8">
                  {/* Personal Details */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-[#00A693]">Applicant Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#292524] mb-1.5">Full Name</label>
                        <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#E7E5E4] bg-[#FCFBF9] focus:outline-none focus:ring-2 focus:ring-[#00A693]/20 focus:border-[#00A693] transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#292524] mb-1.5">Email</label>
                        <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#E7E5E4] bg-[#FCFBF9] focus:outline-none focus:ring-2 focus:ring-[#00A693]/20 focus:border-[#00A693] transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#292524] mb-1.5">Phone Number</label>
                        <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#E7E5E4] bg-[#FCFBF9] focus:outline-none focus:ring-2 focus:ring-[#00A693]/20 focus:border-[#00A693] transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#292524] mb-1.5">Location</label>
                        <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#E7E5E4] bg-[#FCFBF9] focus:outline-none focus:ring-2 focus:ring-[#00A693]/20 focus:border-[#00A693] transition-all" />
                      </div>
                    </div>
                  </div>

                  {/* Professional Details */}
                  <div className="space-y-4 pt-4 border-t border-[#F5F5F4]">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-[#00A693]">Professional Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#292524] mb-1.5">Highest Qualification</label>
                        <input required type="text" placeholder="e.g. M.Sc. Psychology" value={formData.qualifications} onChange={e => setFormData({...formData, qualifications: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#E7E5E4] bg-[#FCFBF9] focus:outline-none focus:ring-2 focus:ring-[#00A693]/20 focus:border-[#00A693] transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#292524] mb-1.5">Years of Experience</label>
                        <input required type="text" placeholder="e.g. 5 Years" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#E7E5E4] bg-[#FCFBF9] focus:outline-none focus:ring-2 focus:ring-[#00A693]/20 focus:border-[#00A693] transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#292524] mb-1.5">Current Organisation</label>
                        <input type="text" value={formData.currentOrg} onChange={e => setFormData({...formData, currentOrg: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#E7E5E4] bg-[#FCFBF9] focus:outline-none focus:ring-2 focus:ring-[#00A693]/20 focus:border-[#00A693] transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#292524] mb-1.5">Specialisation</label>
                        <input type="text" value={formData.specialisation} onChange={e => setFormData({...formData, specialisation: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#E7E5E4] bg-[#FCFBF9] focus:outline-none focus:ring-2 focus:ring-[#00A693]/20 focus:border-[#00A693] transition-all" />
                      </div>
                    </div>
                  </div>

                  {/* Document & Message */}
                  <div className="space-y-4 pt-4 border-t border-[#F5F5F4]">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-[#00A693]">Application</h3>
                    <div>
                      <label className="block text-sm font-medium text-[#292524] mb-1.5">Cover Message (Optional)</label>
                      <textarea rows={3} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#E7E5E4] bg-[#FCFBF9] focus:outline-none focus:ring-2 focus:ring-[#00A693]/20 focus:border-[#00A693] transition-all resize-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#292524] mb-1.5">Resume / CV</label>
                      <div className="mt-2 flex justify-center rounded-xl border border-dashed border-[#A8A29E] px-6 py-8 bg-[#FCFBF9] hover:bg-[#F5F5F4] transition-colors relative">
                        <div className="text-center">
                          <UploadCloud className="mx-auto h-10 w-10 text-[#047857]" aria-hidden="true" />
                          <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer rounded-md bg-transparent font-semibold text-[#00A693] hover:text-[#047857] focus-within:outline-none"
                            >
                              <span>Upload a file</span>
                              <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs leading-5 text-gray-500">PDF, DOC, DOCX up to 5MB</p>
                          {resumeFile && (
                            <p className="mt-3 text-sm font-medium text-[#047857] bg-[#D1FAE5] inline-block px-3 py-1 rounded-full">{resumeFile.name}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Footer */}
            {!isSuccess && (
              <div className="px-8 py-5 border-t border-[#F5F5F4] bg-white flex justify-end gap-3">
                <Button variant="outline" onClick={onClose} disabled={isSubmitting} className="rounded-full px-6">
                  Cancel
                </Button>
                <Button type="submit" form="application-form" disabled={isSubmitting} className="rounded-full px-8 bg-[#047857] hover:bg-[#065F46] text-white">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Application"}
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
