"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, CheckCircle2, ChevronRight, Clock, Star, Phone, CalendarDays, ShieldCheck, HeartPulse, BrainCircuit, Users } from "lucide-react";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Animation Variants
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export function HomeClient({ specialists }: { specialists: any[] }) {
  return (
    <div className="bg-white text-slate-800 selection:bg-primary/20 selection:text-primary">
      
      {/* 1. HERO SECTION */}
      <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            <motion.div 
              initial="hidden" animate="visible" variants={staggerContainer}
              className="max-w-2xl"
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <ShieldCheck className="w-4 h-4" />
                Child Consultation Centre
              </motion.div>
              
              <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1]">
                Helping children grow with <span className="text-primary">confidence.</span>
              </motion.h1>
              
              <motion.p variants={fadeUp} className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
                Expert guidance for every child's unique journey. We provide a safe, warm, and professional environment to support learning, behavior, communication, and family well-being.
              </motion.p>
              
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-md h-12 px-8 text-base">
                  <Link href="/specialists">Book a Consultation</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-md h-12 px-8 text-base border-slate-200 hover:bg-slate-50">
                  <Link href="#services">Explore Our Services</Link>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
              className="relative lg:ml-auto w-full max-w-lg aspect-[4/5] lg:aspect-square"
            >
              <div className="absolute inset-0 bg-secondary rounded-[2rem] -rotate-3 scale-105 origin-bottom-right transition-transform" />
              <div className="relative h-full w-full rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 bg-slate-50">
                <Image 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1000&auto=format&fit=crop" 
                  alt="Therapist helping child" 
                  fill 
                  className="object-cover"
                  priority
                />
              </div>
              
              {/* Floating trust badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-50 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Star className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">4.9/5 Rating</div>
                  <div className="text-sm text-slate-500">Trusted by parents</div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. TRUST STRIP */}
      <section className="border-y border-slate-100 bg-secondary/50 py-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <HeartPulse className="w-6 h-6 text-primary flex-shrink-0" />
              <span className="text-sm font-medium text-slate-700">Personalized Support</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Users className="w-6 h-6 text-primary flex-shrink-0" />
              <span className="text-sm font-medium text-slate-700">Qualified Professionals</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <BrainCircuit className="w-6 h-6 text-primary flex-shrink-0" />
              <span className="text-sm font-medium text-slate-700">Child-Centred Approach</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <CalendarDays className="w-6 h-6 text-primary flex-shrink-0" />
              <span className="text-sm font-medium text-slate-700">Convenient Booking</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SERVICES SECTION */}
      <section id="services" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Support designed around your child</h2>
            <p className="mt-4 text-lg text-slate-600">
              We offer comprehensive, multidisciplinary services tailored to meet the developmental, emotional, and educational needs of every child.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Child Counselling", desc: "Professional support for emotional and behavioral challenges." },
              { title: "Special Education", desc: "Tailored educational support for children with learning differences." },
              { title: "Speech & Language", desc: "Therapy to improve communication and speech clarity." },
              { title: "Occupational Therapy", desc: "Developing fine motor skills and sensory processing abilities." },
              { title: "Behavioural Support", desc: "Strategies to manage and improve difficult behaviors." },
              { title: "Learning Support", desc: "Focused interventions for specific academic difficulties." },
            ].map((service, i) => (
              <div key={i} className="group relative bg-white border border-slate-100 rounded-2xl p-8 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-primary/20 transition-all">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{service.title}</h3>
                <p className="text-slate-600 mb-6 text-sm leading-relaxed">{service.desc}</p>
                <Link href={`/services#${service.title.toLowerCase().replace(/\s+/g, '-')}`} className="inline-flex items-center text-sm font-medium text-primary group-hover:text-primary/80">
                  Learn more <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button asChild variant="outline" className="rounded-md border-slate-200">
              <Link href="/services">View All 13 Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 4. SPECIALISTS SECTION */}
      <section id="specialists" className="py-24 bg-secondary/30 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Meet our specialists</h2>
              <p className="mt-4 text-lg text-slate-600">
                Our team of licensed professionals brings years of experience and deep compassion to every consultation.
              </p>
            </div>
            <Button asChild variant="outline" className="shrink-0 rounded-md bg-white">
              <Link href="/specialists">View Directory</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {specialists.slice(0, 3).map((spec) => (
              <div key={spec.id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all">
                <div className="aspect-[4/3] relative bg-slate-100">
                  {spec.imageUrl ? (
                    <Image src={spec.imageUrl} alt={spec.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <Users className="w-12 h-12" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="text-sm font-medium text-primary mb-1">{spec.designation}</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{spec.name}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-6">{spec.bio || "Dedicated professional committed to child development."}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-600 font-medium">₹{spec.consultationFee} / hr</div>
                    <Link href={`/specialists/${spec.id}`} className="text-sm font-medium text-primary hover:underline">
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            
            {specialists.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500 bg-white border border-slate-100 rounded-2xl">
                Specialists directory is currently being updated.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. ABOUT / APPROACH */}
      <section id="about" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm bg-slate-100">
              <Image 
                src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=1000&auto=format&fit=crop" 
                alt="Child playing with wooden blocks" 
                fill 
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-6">Our approach to care</h2>
              <div className="space-y-6 text-lg text-slate-600">
                <p>
                  At Little Lantern, we believe every child has a unique light. Our approach is deeply rooted in child-centred care, focusing on discovering and nurturing individual strengths rather than just addressing challenges.
                </p>
                <p>
                  We partner closely with parents and families, creating a holistic ecosystem of support. Our environment is deliberately designed to feel safe, welcoming, and entirely non-clinical, encouraging children to express themselves freely.
                </p>
              </div>
              <ul className="mt-8 space-y-4">
                {['Evidence-based interventions', 'Collaborative family approach', 'Neurodiversity affirming', 'Play-based methodologies'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. LOCATION & CONTACT */}
      <section id="contact" className="py-24 bg-secondary/30 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="p-10 lg:p-16 flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-slate-900 mb-8">Visit our centre</h2>
                
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Location</h3>
                      <p className="text-slate-600">Little Lantern<br/>Wandoor, Kerala 679328</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Contact</h3>
                      <p className="text-slate-600">Phone: 99617 57373<br/>WhatsApp: +91 99617 57373</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Hours</h3>
                      <p className="text-slate-600">Monday - Saturday: 9:00 AM - 6:00 PM<br/>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-10 flex flex-wrap gap-4">
                  <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-md">
                    <a href="tel:+919961757373">Call Us Now</a>
                  </Button>
                  <Button asChild variant="outline" className="rounded-md border-slate-200">
                    <a href="https://wa.me/919961757373" target="_blank" rel="noopener noreferrer">WhatsApp</a>
                  </Button>
                </div>
              </div>
              <div className="bg-slate-200 min-h-[300px] lg:min-h-full relative">
                 {/* Clean Map Placeholder - In a real app this would be a Google Maps iframe */}
                 <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-400 p-6 text-center">
                    <div>
                      <MapPin className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                      <p>Interactive Map Component</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Frequently Asked Questions</h2>
            <p className="mt-4 text-lg text-slate-600">Common questions about our services and booking process.</p>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            {[
              {
                q: "How do I book a consultation?",
                a: "You can easily book a consultation through our website by visiting the Specialists directory, selecting a professional, and choosing an available time slot. An advance payment of ₹150 is required to confirm the booking."
              },
              {
                q: "What should we bring to the first session?",
                a: "Please bring any previous medical records, school reports, or assessments related to your child's development. Most importantly, bring an open mind!"
              },
              {
                q: "Are parents involved in the sessions?",
                a: "Absolutely. We strongly believe in a family-centered approach. Depending on the child's age and needs, parents are actively involved in setting goals and practicing strategies at home."
              },
              {
                q: "How long is a typical consultation?",
                a: "A standard consultation slot is 60 minutes, which includes time for direct interaction, parent feedback, and clinical documentation."
              }
            ].map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-slate-100">
                <AccordionTrigger className="text-left font-medium text-slate-900 hover:text-primary">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

    </div>
  );
}
