"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, Brain, BookOpen, GraduationCap } from "lucide-react";
import { ApplicationForm } from "./ApplicationForm";

const CATEGORIES = [
  { id: "Psychologist", label: "Psychologist", icon: Brain },
  { id: "Special Educator", label: "Special Educator", icon: BookOpen },
  { id: "Teacher", label: "Teacher", icon: GraduationCap },
];

export function CareersClient({ initialOpenings }: { initialOpenings: any[] }) {
  const [activeCategory, setActiveCategory] = useState("Psychologist");

  return (
    <div className="relative isolate bg-slate-50 selection:bg-primary/20 selection:text-primary min-h-screen pb-16">
      
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
              Join the Little Lantern professional team. We are a premium child development centre seeking skilled, caring professionals. Make a meaningful difference alongside a world-class multidisciplinary team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* THREE ENTRY BUTTONS */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center justify-center gap-2 w-full sm:w-[220px] h-14 rounded-2xl border font-medium text-[15px] transition-all duration-300 ${
                    isActive 
                      ? "bg-primary text-white border-primary shadow-md" 
                      : "bg-white text-slate-700 border-slate-200 hover:bg-primary/5 hover:border-primary/30 hover:shadow-sm hover:-translate-y-0.5"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-primary/70"}`} />
                  {cat.label}
                </button>
              );
            })}
          </div>

          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ApplicationForm mainCategory={activeCategory} />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
