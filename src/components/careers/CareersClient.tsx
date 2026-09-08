"use client";

import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, MapPin, Briefcase, ChevronRight, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApplicationModal } from "./ApplicationModal";
import Link from "next/link";
import Image from "next/image";

const FACULTY_CATEGORIES = [
  "Clinical Psychologist",
  "Child Psychologist",
  "Counsellor",
  "Child & Adolescent Counsellor",
  "Special or Remedial Educator",
  "Educational Psychologist",
  "Career Counsellor",
  "Occupational Therapist",
  "Speech & Language Therapist",
  "Behaviour Therapist",
  "ABA Therapist",
  "Learning Support Specialist",
  "Parent & Family Counsellor",
  "Audiologist",
  "Teacher / Faculty",
  "Consultant"
];

export function CareersClient({ initialOpenings }: { initialOpenings: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  
  const openModal = (job: any = null) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  return (
    <div className="relative isolate bg-slate-50 selection:bg-primary/20 selection:text-primary pb-16">
      
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-white border-b border-slate-100">
        <div className="mx-auto max-w-5xl px-6 lg:px-8 text-center z-10 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wider mb-6 uppercase">
              <UserPlus className="w-3.5 h-3.5" /> Join Our Team
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.15]">
              Become Our Faculty
            </h1>
            <p className="mt-6 text-lg text-slate-600 font-light max-w-2xl mx-auto leading-relaxed">
              We are a premium child development centre seeking skilled, caring professionals. Make a meaningful difference alongside a world-class multidisciplinary team.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button onClick={() => openModal()} size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-white rounded-full h-12 px-8 text-[15px] shadow-sm transition-all font-medium">
                Apply to Join Our Faculty
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PROFESSIONAL CATEGORIES DIRECTORY */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mb-10 text-center sm:text-left">
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">Professional Categories</h2>
            <p className="mt-3 text-[15px] text-slate-500 font-light">Select your area of expertise to submit your profile.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {FACULTY_CATEGORIES.map((cat, idx) => (
              <motion.button 
                key={cat}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: idx * 0.03, ease: "easeOut" }}
                onClick={() => openModal({ title: cat })}
                className="group flex items-center justify-between text-left bg-white border border-slate-200 rounded-xl px-5 py-4 transition-all duration-200 hover:border-primary/40 hover:shadow-sm hover:-translate-y-0.5 hover:bg-primary/[0.03]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 group-hover:bg-primary/10 group-hover:border-primary/20 flex items-center justify-center shrink-0 transition-colors">
                    <Users className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-[14px] font-semibold text-slate-800 group-hover:text-primary transition-colors leading-tight">{cat}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 transform transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary shrink-0" />
              </motion.button>
            ))}
          </div>

          <div className="mt-16 flex justify-center">
            <div className="inline-flex items-center gap-4 bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-sm max-w-lg">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <h4 className="text-[15px] font-semibold text-slate-900">Don't see your exact role?</h4>
                <p className="text-[13px] text-slate-500 mt-0.5">Submit your profile under 'Consultant' and our team will review it.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SPECIFIC OPENINGS (if any exist from DB, display compactly) */}
      {initialOpenings.length > 0 && (
        <section className="py-16 bg-white border-y border-slate-100">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <div className="mb-8 text-center sm:text-left">
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">Current Openings</h2>
            </div>
            
            <div className="space-y-4">
              {initialOpenings.map((job) => (
                <div 
                  key={job.id}
                  className="group bg-slate-50 border border-slate-200 p-6 rounded-2xl hover:border-primary/30 hover:bg-white transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="px-2.5 py-1 bg-white border border-slate-200 text-slate-600 rounded-md text-[11px] font-semibold uppercase tracking-wider">{job.department}</span>
                        <span className="px-2.5 py-1 bg-primary/10 border border-primary/20 text-primary rounded-md text-[11px] font-semibold uppercase tracking-wider">{job.type}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-[13px] text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" /> {job.location}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5" /> {job.experience}
                        </div>
                      </div>
                    </div>
                    <Button onClick={() => openModal(job)} className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white rounded-lg h-10 px-6 shadow-sm text-sm">
                      Apply to Join
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {isModalOpen && <ApplicationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} selectedJob={selectedJob} />}
    </div>
  );
}
