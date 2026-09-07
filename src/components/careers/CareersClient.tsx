"use client";

import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, MapPin, Briefcase, GraduationCap, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApplicationModal } from "./ApplicationModal";
import Link from "next/link";
import Image from "next/image";

export function CareersClient({ initialOpenings }: { initialOpenings: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const openModal = (job: any = null) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  return (
    <div className="relative isolate bg-white selection:bg-[#00A693]/30 selection:text-[#047857]">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-white">
        
        <div className="absolute inset-0 -z-10 overflow-hidden bg-[#FCFBF9]">
          <div className="absolute inset-0 bg-gradient-to-b from-[#F5F5F4] to-[#FCFBF9]" />
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-[#00A693]/10 border border-[#00A693]/20 text-[#047857] text-xs font-semibold tracking-widest mb-6 uppercase">
              Join Our Team
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-medium tracking-tight text-[#1C1917] leading-[1.05]">
              Make a meaningful difference in a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A693] to-[#047857]">child's journey.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl leading-relaxed text-[#57534E] font-light">
              We’re looking for caring, skilled professionals who believe every child deserves the right support to grow with confidence.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-6">
              <Link href="#openings" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-br from-[#00A693] to-[#047857] hover:brightness-110 text-white rounded-full h-14 px-8 text-[16px] shadow-[0_8px_20px_rgba(0,166,147,0.2)] transition-all duration-300 hover:-translate-y-1 font-medium border-0">
                  View Opportunities
                </Button>
              </Link>
              <button onClick={() => openModal()} className="text-[16px] font-medium text-[#047857] hover:text-[#00A693] transition-colors py-2 flex items-center gap-2 group">
                Apply Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          {/* Premium Human Photography */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotateY: -10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl preserve-3d group hidden lg:block"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#047857]/40 to-transparent mix-blend-overlay z-10 transition-opacity duration-1000 group-hover:opacity-20" />
            <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&auto=format&fit=crop" alt="Professionals collaborating" className="w-full h-full object-cover transform transition-transform duration-[2000ms] group-hover:scale-105" />
          </motion.div>
        </div>
      </section>

      {/* WHY JOIN US */}
      <section className="py-24 bg-[#F5F5F4] relative border-y border-[#E7E5E4]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-medium text-[#1C1917] tracking-tight mb-4">Why Little Lantern?</h2>
            <p className="text-lg text-[#78716C] font-light">Join a premium centre dedicated to world-class developmental support.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Meaningful Work", desc: "Make a positive difference in children's lives every day." },
              { title: "Collaborative Team", desc: "Work alongside experts from multiple disciplines." },
              { title: "Professional Growth", desc: "Develop your skills through meaningful practice." },
              { title: "Child-Centred", desc: "Be part of a team that puts every child’s needs first." }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-[#E7E5E4] hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-[#F0FDF4] border border-[#D1FAE5] flex items-center justify-center mb-6">
                  <div className="w-3 h-3 rounded-full bg-[#00A693]" />
                </div>
                <h3 className="text-xl font-display font-medium text-[#1C1917] mb-3">{feature.title}</h3>
                <p className="text-[#57534E] text-sm leading-relaxed font-light">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* OPEN OPPORTUNITIES */}
      <section id="openings" className="py-32 bg-white relative">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-medium text-[#1C1917] tracking-tight mb-4">Open Opportunities</h2>
            <p className="text-lg text-[#78716C] font-light">Find the role that matches your expertise and passion.</p>
          </div>

          {initialOpenings.length === 0 ? (
            <div className="text-center py-20 bg-[#FCFBF9] rounded-3xl border border-[#F5F5F4]">
              <h3 className="text-xl font-medium text-[#292524] mb-2">No specific openings at the moment</h3>
              <p className="text-[#78716C] mb-8">We are always on the lookout for great talent. Feel free to submit a general application.</p>
              <Button onClick={() => openModal()} className="bg-white text-[#047857] border border-[#047857]/20 hover:bg-[#F0FDF4] rounded-full px-8 shadow-sm">
                Submit General Application
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {initialOpenings.map((job) => (
                <motion.div 
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group bg-white border border-[#E7E5E4] p-8 rounded-3xl hover:border-[#00A693]/50 hover:shadow-[0_8px_30px_rgba(0,166,147,0.08)] transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-[#F5F5F4] text-[#57534E] rounded-full text-xs font-semibold uppercase tracking-wider">{job.department}</span>
                        <span className="px-3 py-1 bg-[#F0FDF4] text-[#047857] rounded-full text-xs font-semibold uppercase tracking-wider">{job.type}</span>
                      </div>
                      <h3 className="text-2xl font-display font-medium text-[#1C1917] mb-3">{job.title}</h3>
                      <p className="text-[#57534E] text-[15px] leading-relaxed mb-6 max-w-3xl font-light">
                        {job.description}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-6 text-sm text-[#78716C]">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#00A693]" /> {job.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-[#00A693]" /> {job.experience}
                        </div>
                      </div>
                    </div>
                    
                    <div className="shrink-0 mt-2 md:mt-0">
                      <Button onClick={() => openModal(job)} className="w-full md:w-auto bg-[#047857] hover:bg-[#065F46] text-white rounded-full px-8 shadow-sm">
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 bg-[#1C1917] relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#00A693]/20 to-transparent pointer-events-none" />
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-2xl mx-auto px-6"
        >
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 relative rounded-2xl overflow-hidden shadow-xl border border-white/20">
              <Image src="/logo.jpg" alt="Little Lantern" fill className="object-cover" />
            </div>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-medium text-white mb-6 tracking-tight">
            Ready to help children move forward?
          </h2>
          <Button onClick={() => openModal()} size="lg" className="mt-8 bg-white text-[#047857] hover:bg-[#F0FDF4] rounded-full px-10 text-[16px] font-medium border-0 shadow-xl transition-transform hover:-translate-y-1">
            Apply to Join Us
          </Button>
        </motion.div>
      </section>

      <ApplicationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} selectedJob={selectedJob} />
    </div>
  );
}
