"use client";

import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, CheckCircle2, Clock, Star, Phone, ShieldCheck, Users } from "lucide-react";
import { useRef } from "react";

// Reusable scroll-triggered section wrapper
function AnimatedSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Animation Variants
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const ALL_SERVICES = [
  { title: "Child Counselling", slug: "child-counselling" },
  { title: "Individual Counselling", slug: "individual-counselling" },
  { title: "Group Counselling", slug: "group-counselling" },
  { title: "Special Education", slug: "special-education" },
  { title: "Speech & Language Support", slug: "speech-language-support" },
  { title: "Occupational Therapy", slug: "occupational-therapy" },
  { title: "Behavioural Support", slug: "behavioural-support" },
  { title: "Learning Support", slug: "learning-support" },
  { title: "Psychological Consultation", slug: "psychological-consultation" },
  { title: "Psychometric Testing", slug: "psychometric-testing" },
  { title: "Career Counselling", slug: "career-counselling" },
  { title: "Remedial Teaching", slug: "remedial-teaching" },
  { title: "Parent Counselling", slug: "parent-counselling" }
];

export function HomeClient({ specialists }: { specialists: any[] }) {
  return (
    <div className="bg-white text-slate-800 selection:bg-primary/20 selection:text-primary">
      
      {/* 1. HERO SECTION */}
      <section id="home" className="relative pt-24 pb-12 lg:pt-32 lg:pb-16 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-8 items-center">
            
            <motion.div 
              initial="hidden" animate="visible" variants={staggerContainer}
              className="max-w-xl"
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[13px] font-medium mb-4">
                <ShieldCheck className="w-3.5 h-3.5" />
                Child Consultation Centre
              </motion.div>
              
              <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-4 leading-[1.15]">
                Helping children grow with <span className="text-primary">confidence.</span>
              </motion.h1>
              
              <motion.p variants={fadeUp} className="text-base text-slate-600 mb-6 leading-relaxed max-w-md">
                Expert guidance for every child's unique journey. A warm, professional environment for learning, behavior, and well-being.
              </motion.p>
              
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
                <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-md h-11 px-6 text-sm font-medium">
                  <Link href="/specialists">Book Consultation</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-md h-11 px-6 text-sm font-medium border-slate-200 hover:bg-slate-50">
                  <Link href="/careers">Become Our Faculty</Link>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              className="relative lg:ml-auto w-full max-w-sm aspect-[4/3]"
            >
              <div className="absolute inset-0 bg-secondary rounded-2xl -rotate-2 scale-105 origin-bottom-right transition-transform" />
              <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-sm border border-slate-100 bg-slate-50">
                <Image 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop" 
                  alt="Therapist helping child" 
                  fill 
                  className="object-cover"
                  priority
                />
              </div>
              
              {/* Floating trust badge - made smaller */}
              <div className="absolute -bottom-4 -left-4 bg-white p-3 rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.06)] border border-slate-50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">4.9/5</div>
                  <div className="text-xs text-slate-500 font-medium">Trusted Care</div>
                </div>
              </div>
            </motion.div>
            
          </div>
        </div>
      </section>

      {/* 2. TRUST BANNER */}
      <section className="border-y border-slate-100 bg-slate-50/50 py-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection className="flex flex-col sm:flex-row items-center justify-center gap-x-12 gap-y-6 text-center sm:text-left">
            <div className="flex items-center gap-3 text-slate-600">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium">Licensed<br/>Professionals</span>
            </div>
            <div className="hidden sm:block w-px h-10 bg-slate-200" />
            <div className="flex items-center gap-3 text-slate-600">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium">Personalized<br/>Treatment</span>
            </div>
            <div className="hidden sm:block w-px h-10 bg-slate-200" />
            <div className="flex items-center gap-3 text-slate-600">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium">Safe &<br/>Confidential</span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* 3. SERVICES SECTION (REFINED COMPACT GRID) */}
      <section id="services" className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection className="max-w-2xl mb-10 text-center mx-auto">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Support designed around your child</h2>
            <p className="mt-2 text-sm text-slate-500">Select a service to book a consultation</p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 max-w-5xl mx-auto">
            {ALL_SERVICES.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.04, ease: "easeOut" }}
              >
                <Link 
                  href={`/specialists?service=${service.slug}`} 
                  className="group flex items-center justify-between bg-white border border-slate-200 rounded-xl px-5 py-4 transition-all duration-200 hover:shadow-[0_4px_12px_rgba(0,166,147,0.15)] hover:border-primary/30 hover:-translate-y-0.5 hover:bg-primary/[0.02] active:scale-[0.98] active:bg-primary active:text-white"
                >
                  <span className="text-[15px] font-medium text-slate-800 group-active:text-white transition-colors">{service.title}</span>
                  <ArrowRight className="w-4 h-4 text-primary group-active:text-white transform transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SPECIALISTS SECTION */}
      <section id="specialists" className="py-16 bg-slate-50/50 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Meet our specialists</h2>
              <p className="mt-2 text-sm text-slate-600">
                Our team brings years of experience and deep compassion to every consultation.
              </p>
            </div>
            <Button asChild variant="outline" className="shrink-0 h-10 px-5 text-sm border-slate-200">
              <Link href="/specialists">View All</Link>
            </Button>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {specialists.slice(0, 4).map((spec, i) => (
              <motion.div
                key={spec.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.1, ease: "easeOut" }}
                className="group bg-white border border-slate-100 rounded-xl overflow-hidden hover:shadow-[0_4px_20px_rgb(0,0,0,0.04)] transition-all duration-300"
              >
                <div className="aspect-[4/5] relative bg-slate-100 overflow-hidden">
                  {spec.imageUrl ? (
                    <Image src={spec.imageUrl} alt={spec.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <Users className="w-10 h-10" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="text-[13px] font-medium text-primary mb-1">{spec.designation}</div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 truncate">{spec.name}</h3>
                  <p className="text-[13px] text-slate-500 line-clamp-2 mb-4 leading-relaxed">{spec.bio || "Dedicated professional committed to child development."}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="text-[13px] text-slate-600 font-medium">₹{spec.consultationFee} / hr</div>
                    <Link href={`/specialists/${spec.id}`} className="text-[13px] font-semibold text-primary hover:text-primary/80 transition-colors">
                      Book →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {specialists.length === 0 && (
              <div className="col-span-full py-10 text-center text-sm text-slate-500 bg-white border border-slate-100 rounded-xl">
                Specialists directory is currently being updated.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. ABOUT / APPROACH */}
      <section id="about" className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative aspect-[4/3] max-w-lg mx-auto lg:mx-0 w-full rounded-2xl overflow-hidden shadow-sm bg-slate-100"
            >
              <Image 
                src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=800&auto=format&fit=crop" 
                alt="Child playing with wooden blocks" 
                fill 
                className="object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            >
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl mb-4">Our approach to care</h2>
              <div className="space-y-4 text-sm sm:text-base text-slate-600">
                <p>
                  We provide a warm, welcoming space where children can feel entirely comfortable. Rather than focusing solely on challenges, we look at your child's unique strengths and build from there.
                </p>
                <p>
                  We work closely with parents to understand what's happening at home and school, creating practical, step-by-step plans that make a real difference in daily life.
                </p>
              </div>
              <ul className="mt-6 space-y-3">
                {['Practical, step-by-step guidance', 'Close partnership with parents', 'Comfortable, non-clinical environment', 'Focus on real-world results'].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.2 + i * 0.05, ease: "easeOut" }}
                    className="flex items-center gap-3 text-sm font-medium text-slate-700"
                  >
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. LOCATION & CONTACT */}
      <section id="contact" className="py-16 bg-slate-50/50 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-8 sm:p-10 flex flex-col justify-center">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Visit our centre</h2>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-0.5">Location</h3>
                      <p className="text-[13px] text-slate-600">Little Lantern<br/>Wandoor, Kerala 679328</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-0.5">Contact</h3>
                      <p className="text-[13px] text-slate-600">Phone: 99617 57373<br/>WhatsApp: +91 99617 57373</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-0.5">Hours</h3>
                      <p className="text-[13px] text-slate-600">Mon - Sat: 9:00 AM - 6:00 PM<br/>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-md h-10 px-5 text-sm">
                    <a href="tel:+919961757373">Call Us</a>
                  </Button>
                  <Button asChild variant="outline" className="rounded-md border-slate-200 h-10 px-5 text-sm hover:bg-slate-50">
                    <a href="https://wa.me/919961757373" target="_blank" rel="noopener noreferrer">WhatsApp</a>
                  </Button>
                </div>
              </div>
              <div className="bg-slate-100 min-h-[250px] md:min-h-full relative overflow-hidden">
                 <iframe 
                   src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.035342674488!2d76.2307844!3d11.1851941!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba631b1c55d0121%3A0x8e87d1dfc83690d7!2sWandoor%2C%20Kerala%20679328!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                   width="100%" 
                   height="100%" 
                   style={{ border: 0, position: 'absolute', inset: 0 }} 
                   allowFullScreen 
                   loading="lazy" 
                   referrerPolicy="no-referrer-when-downgrade"
                 />
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
