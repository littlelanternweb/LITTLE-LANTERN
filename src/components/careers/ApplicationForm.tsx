"use client";

import { useState, useEffect } from "react";
import { X, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const CATEGORY_MAP: Record<string, string[]> = {
  Psychologist: [
    "Clinical Psychologist", "Child Psychologist", "Educational Psychologist",
    "Counsellor", "Child & Adolescent Counsellor", "Career Counsellor", "Parent & Family Counsellor"
  ],
  "Special Educator": [
    "Special or Remedial Educator", "Learning Support Specialist", "Behaviour Therapist",
    "ABA Therapist", "Occupational Therapist", "Speech & Language Therapist", "Audiologist"
  ],
  Teacher: [
    "Teacher / Faculty", "Consultant"
  ]
};

const SYLLABUS_OPTIONS = ["CBSE", "ICSE", "State Boards", "NIOS", "International Boards"];
const CLASSES_OPTIONS = [
  "Middle School (Class 6-8)",
  "Secondary (Class 9-10)",
  "Higher Secondary - Science (11-12)",
  "Higher Secondary - Commerce",
  "Higher Secondary - Humanities/Arts",
  "Engineering (B.Tech/Diploma)",
  "Medical & Allied Health",
  "Commerce & Management",
  "Computer & IT Courses",
  "Languages",
  "Professional Certifications",
  "Creative Arts",
  "Skill Development",
  "Competitive Exams"
];

const LANGUAGE_OPTIONS = [
  "Assamese", "Bengali", "Bodo", "Dogri", "English", "Gujarati", "Hindi", "Kannada", 
  "Kashmiri", "Konkani", "Maithili", "Malayalam", "Manipuri", "Marathi", "Nepali", 
  "Odia", "Punjabi", "Sanskrit", "Santali", "Sindhi", "Tamil", "Telugu", "Urdu", "Other"
];

export function ApplicationForm({ mainCategory }: { mainCategory: string }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
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
  
  // Teacher metadata state
  const [teacherData, setTeacherData] = useState({
    teachingMode: "",
    syllabus: [] as string[],
    classes: [] as string[],
    subjects: "",
    languages: [] as string[],
  });

  const isTeacher = mainCategory === "Teacher";

  useEffect(() => {
    setFormData(prev => ({ ...prev, category: "" }));
    setStep(1);
  }, [mainCategory]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File too large. Maximum size is 10MB.");
        return;
      }
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(null);
  };

  const toggleArrayItem = (field: keyof typeof teacherData, item: string) => {
    setTeacherData(prev => {
      const arr = prev[field] as string[];
      if (arr.includes(item)) {
        return { ...prev, [field]: arr.filter(i => i !== item) };
      } else {
        return { ...prev, [field]: [...arr, item] };
      }
    });
  };

  const submitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let uploadedPhotoUrl = null;
      if (photoFile) {
        uploadedPhotoUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(photoFile);
        });
      }

      const metadata = isTeacher ? teacherData : null;

      const payload = {
        ...formData,
        position: mainCategory,
        jobOpeningId: null,
        resumeUrl: isTeacher ? (uploadedPhotoUrl || "Not Provided") : "Not Provided",
        photoUrl: !isTeacher ? uploadedPhotoUrl : null,
        metadata: metadata,
      };

      const submitRes = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!submitRes.ok) throw new Error("Failed to submit application");

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setStep(1);
        setFormData({ name: "", email: "", phone: "", category: "", qualifications: "", experience: "", currentOrg: "", specialisation: "", message: "" });
        setTeacherData({ teachingMode: "", syllabus: [], classes: [], subjects: "", languages: [] });
        removePhoto();
      }, 3000);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const options = CATEGORY_MAP[mainCategory] || [];

  if (isSuccess) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-3xl mx-auto mt-8">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h4 className="text-2xl font-bold text-slate-900 mb-2">Application Received!</h4>
        <p className="text-slate-500">Thank you for your interest. Our team will review your application and get back to you shortly.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm max-w-3xl mx-auto mt-8 overflow-hidden">
      <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-xl font-semibold text-slate-900">
          Apply as a {mainCategory}
        </h3>
        <p className="text-slate-500 text-sm mt-1">Please fill out the form below to submit your application.</p>
      </div>

      <div className="p-8">
        <form id="applicationForm" onSubmit={submitApplication}>
          {/* STEP 1 */}
          <div className={step === 1 ? "space-y-6 block" : "hidden"}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1.5">Full Name *</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1.5">Email Address *</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1.5">WhatsApp Number *</label>
                <input required type="tel" placeholder="+91 90000 00000" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1.5">Highest Qualification *</label>
                <input required type="text" placeholder="e.g. M.Sc. Mathematics" value={formData.qualifications} onChange={e => setFormData({...formData, qualifications: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1.5">Years of Experience *</label>
                <input required type="text" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
              </div>
              {isTeacher ? (
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1.5">Teaching Mode *</label>
                  <select required value={teacherData.teachingMode} onChange={e => setTeacherData({...teacherData, teachingMode: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none">
                    <option value="" disabled>Select...</option>
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1.5">Professional Category *</label>
                  <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none">
                    <option value="" disabled>Select your professional category</option>
                    {options.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              )}
            </div>
            
            {/* Conditional Non-Teacher Photo */}
            {!isTeacher && (
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1.5">Professional Photo</label>
                {!photoPreview ? (
                  <div className="mt-1 flex justify-center rounded-xl border border-dashed border-slate-300 px-6 py-6 bg-slate-50">
                    <div className="text-center">
                      <div className="flex text-sm leading-6 text-slate-600 justify-center">
                        <label htmlFor="photo-upload" className="relative cursor-pointer rounded-md font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary hover:text-primary/80">
                          <span>Upload a file</span>
                          <input id="photo-upload" name="photo-upload" type="file" className="sr-only" accept="image/jpeg, image/png, image/webp" onChange={handlePhotoChange} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-slate-500">PNG, JPG, WebP up to 5MB</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative inline-block mt-2">
                    <img src={photoPreview} alt="Preview" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md" />
                    <button type="button" onClick={removePhoto} className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 shadow-sm hover:bg-rose-600">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* STEP 2 */}
          <div className={step === 2 ? "space-y-6 block" : "hidden"}>
            
            {isTeacher ? (
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-3">Syllabus (optional, select all that apply)</label>
                  <div className="flex flex-wrap gap-4">
                    {SYLLABUS_OPTIONS.map(opt => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={teacherData.syllabus.includes(opt)} onChange={() => toggleArrayItem("syllabus", opt)} className="rounded border-slate-300 text-primary focus:ring-primary/20" />
                        <span className="text-sm text-slate-700">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-3">Classes / Standards (select all that apply)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {CLASSES_OPTIONS.map(opt => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={teacherData.classes.includes(opt)} onChange={() => toggleArrayItem("classes", opt)} className="rounded border-slate-300 text-primary focus:ring-primary/20" />
                        <span className="text-sm text-slate-700">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1.5">Subjects you teach *</label>
                  <input required type="text" placeholder="e.g. Mathematics, Physics, Chemistry" value={teacherData.subjects} onChange={e => setTeacherData({...teacherData, subjects: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-3">Languages</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {LANGUAGE_OPTIONS.map(opt => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={teacherData.languages.includes(opt)} onChange={() => toggleArrayItem("languages", opt)} className="rounded border-slate-300 text-primary focus:ring-primary/20" />
                        <span className="text-sm text-slate-700">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1.5">About You (optional)</label>
                  <textarea value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1.5">Certificates (optional)</label>
                  <div className="mt-1 flex items-center gap-4">
                    <label className="relative cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-200">
                      <span>Choose files</span>
                      <input type="file" className="sr-only" accept="image/*,application/pdf" onChange={handlePhotoChange} />
                    </label>
                    <span className="text-sm text-slate-500">
                      {photoFile ? photoFile.name : "No file chosen"}
                    </span>
                    {photoFile && (
                       <button type="button" onClick={removePhoto} className="text-rose-500 hover:text-rose-600 text-sm font-medium">Remove</button>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">PDF or image files, up to 10MB each.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1.5">Current Organization</label>
                  <input type="text" value={formData.currentOrg} onChange={e => setFormData({...formData, currentOrg: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1.5">Areas of Specialisation</label>
                  <input type="text" value={formData.specialisation} onChange={e => setFormData({...formData, specialisation: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1.5">Cover Letter / Message</label>
                  <textarea value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
              </div>
            )}
            
          </div>
        </form>
      </div>

      <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="flex gap-2">
          <div className={`w-2 h-2 rounded-full ${step === 1 ? "bg-primary" : "bg-slate-300"}`} />
          <div className={`w-2 h-2 rounded-full ${step === 2 ? "bg-primary" : "bg-slate-300"}`} />
        </div>
        
        <div className="flex gap-3">
          {step === 2 && (
            <Button type="button" variant="outline" onClick={() => setStep(1)} disabled={isSubmitting} className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-100 px-6 h-11">
              Back
            </Button>
          )}
          {step === 1 ? (
            <Button type="button" onClick={() => {
              const form = document.getElementById("applicationForm") as HTMLFormElement;
              if (!form) return;
              
              // Only check validity of visible inputs
              const visibleInputs = Array.from(form.elements).filter(el => {
                const input = el as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
                return !input.closest('.hidden') && input.tagName !== 'BUTTON';
              }) as (HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)[];
              
              let isValid = true;
              for (const input of visibleInputs) {
                if (!input.checkValidity()) {
                  input.reportValidity();
                  isValid = false;
                  break;
                }
              }

              if (isValid) {
                setStep(2);
              }
            }} className="bg-primary hover:bg-primary/90 text-white rounded-xl px-8 h-11 shadow-sm">
              Next Step
            </Button>
          ) : (
            <Button type="submit" form="applicationForm" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-white rounded-xl px-8 h-11 shadow-sm">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Application"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
