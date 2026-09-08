"use client";

import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, CheckCircle2, Clock, Star, Phone, CalendarDays, ShieldCheck, HeartPulse, BrainCircuit, Users } from "lucide-react";
import { useRef } from "react";


// Reusable scroll-triggered section wrapper
function AnimatedSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Animation Variants
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }
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
                  <Link href="/careers">Become Our Faculty</Link>
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
          <AnimatedSection>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center sm:text-left">
              {[
                { icon: <HeartPulse className="w-6 h-6 text-primary flex-shrink-0" />, label: "Personalized Support" },
                { icon: <Users className="w-6 h-6 text-primary flex-shrink-0" />, label: "Qualified Professionals" },
                { icon: <BrainCircuit className="w-6 h-6 text-primary flex-shrink-0" />, label: "Child-Centred Approach" },
                { icon: <CalendarDays className="w-6 h-6 text-primary flex-shrink-0" />, label: "Convenient Booking" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col sm:flex-row items-center gap-3"
                >
                  {item.icon}
                  <span className="text-sm font-medium text-slate-700">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* 3. SERVICES SECTION */}
      <section id="services" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection className="max-w-3xl mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Support designed around your child</h2>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Child Counselling", slug: "child-counselling" },
              { title: "Special Education", slug: "special-education" },
              { title: "Speech & Language", slug: "speech-language-support" },
              { title: "Occupational Therapy", slug: "occupational-therapy" },
              { title: "Behavioural Support", slug: "behavioural-support" },
              { title: "Learning Support", slug: "learning-support" },
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="group relative bg-white border border-slate-100 rounded-2xl p-8 hover:shadow-[0_8px_30px_rgb(0,0,0,0.05)] hover:border-primary/20 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">{service.title}</h3>
                <Link href={`/specialists?service=${service.slug}`} className="inline-flex items-center text-sm font-medium text-primary group-hover:text-primary/80">
                  Book this service <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            ))}
          </div>
          
          <AnimatedSection className="mt-12 text-center" delay={0.2}>
            <Button asChild variant="outline" className="rounded-md border-slate-200">
              <Link href="/specialists">View All Services</Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>


      {/* 4. SPECIALISTS SECTION */}
      <section id="specialists" className="py-24 bg-secondary/30 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Meet our specialists</h2>
              <p className="mt-4 text-lg text-slate-600">
                Our team of licensed professionals brings years of experience and deep compassion to every consultation.
              </p>
            </div>
            <Button asChild variant="outline" className="shrink-0 rounded-md bg-white">
              <Link href="/specialists">View Directory</Link>
            </Button>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {specialists.slice(0, 3).map((spec, i) => (
              <motion.div
                key={spec.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4 }}
                className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-[0_2px_8px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_35px_rgb(0,0,0,0.07)] transition-shadow duration-300"
              >
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
              </motion.div>
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
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm bg-slate-100"
            >
              <Image 
                src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=1000&auto=format&fit=crop" 
                alt="Child playing with wooden blocks" 
                fill 
                className="object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-6">Our approach to care</h2>
              <div className="space-y-6 text-lg text-slate-600">
                <p>
                  We provide a warm, welcoming space where children can feel entirely comfortable. Rather than focusing solely on challenges, we look at your child's unique strengths and build from there.
                </p>
                <p>
                  We work closely with parents to understand what's happening at home and school, creating practical, step-by-step plans that make a real difference in daily life. Our clinic is designed to feel like a place to play and learn, completely avoiding the intimidating atmosphere of a traditional hospital.
                </p>
              </div>
              <ul className="mt-8 space-y-4">
                {['Practical, step-by-step guidance', 'Close partnership with parents', 'Comfortable, non-clinical environment', 'Focus on real-world results'].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center gap-3 text-slate-700"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
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
              <div className="bg-slate-200 min-h-[300px] lg:min-h-full relative overflow-hidden rounded-r-[2rem]">
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
