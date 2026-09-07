"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Sparkles, MoveRight, ChevronRight, Award, Clock, Languages, Phone, CalendarDays, MessageCircle } from "lucide-react";
import { useRef, useState } from "react";
import Image from "next/image";

export function HomeClient({ specialists }: { specialists: any[] }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const yImage = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const textScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.85]);
  const textY = useTransform(scrollYProgress, [0, 0.15], ["0%", "20%"]);
  const textRotateX = useTransform(scrollYProgress, [0, 0.15], [0, 15]);

  return (
    <div ref={containerRef} className="relative isolate bg-[#1C1917] selection:bg-[#00A693]/30 selection:text-[#D1FAE5] scroll-smooth">
      
      {/* SECTION: HOME (Hero - 3D & Animated) */}
      <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden perspective-1000">
        
        {/* Parallax Background Image */}
        <motion.div 
          className="absolute inset-0 -z-30 h-[120%]"
          style={{ y: yImage }}
        >
          <img 
            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1080&auto=format&fit=crop" 
            alt="Mother and child smiling" 
            className="w-full h-full object-cover opacity-[0.35] mix-blend-luminosity object-top" 
          />
        </motion.div>
        
        {/* Dynamic Gradient Overlay */}
        <div className="absolute inset-0 -z-20 bg-gradient-to-br from-[#065F46]/95 via-[#047857]/80 to-[#1C1917]/90" />
        
        {/* Animated Premium Background Shapes */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-[#00A693] opacity-20 blur-[120px] rounded-full mix-blend-screen" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.5, 1],
              x: [0, -40, 0],
              y: [0, 50, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-[#047857] opacity-30 blur-[100px] rounded-full mix-blend-screen" 
          />
        </div>

        {/* 3D Floating Particles Removed for Cleaner UI */}

        {/* 3D Scrolling Content */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full z-10 flex items-center justify-between">
          
          <motion.div 
            className="max-w-3xl transform-gpu preserve-3d"
            style={{ scale: textScale, y: textY, rotateX: textRotateX, opacity }}
          >
            <motion.div
              initial={{ opacity: 0, y: 50, rotateX: 20 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/5 border border-white/10 text-[#D1FAE5] text-xs font-semibold tracking-widest mb-8 uppercase backdrop-blur-md shadow-[0_4px_20px_rgba(0,166,147,0.2)]">
                <div className="w-5 h-5 relative rounded-[4px] overflow-hidden">
                  <Image src="/logo.jpg" alt="Little Lantern" fill className="object-cover" />
                </div>
                Premium Child Consultation
              </span>
              <h1 className="font-display text-5xl md:text-7xl lg:text-[6rem] font-medium tracking-tight text-white leading-[1.05] drop-shadow-lg">
                Helping Every Child Find Their Way <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D1FAE5] via-[#00A693] to-[#047857] drop-shadow-sm">Forward.</span>
              </h1>
              <p className="mt-8 text-lg md:text-xl leading-relaxed text-white/80 max-w-2xl font-light">
                Supporting children with thoughtful guidance, specialised care and personalised learning in a calm, welcoming environment.
              </p>
              <div className="mt-12 flex flex-col sm:flex-row items-center gap-6">
                <Link href="#specialists" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-br from-[#00A693] to-[#047857] hover:brightness-110 text-white rounded-full h-16 px-10 text-[17px] shadow-[0_10px_30px_rgba(0,166,147,0.3)] transition-all duration-300 hover:scale-105 font-medium group border-0">
                    Book a Consultation
                  </Button>
                </Link>
                <Link href="/specialists" className="text-[16px] font-medium leading-6 text-white group flex items-center gap-2 hover:text-[#D1FAE5] transition-colors py-2">
                  Meet Our Specialists
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#00A693]" />
                </Link>
              </div>
            </motion.div>
          </motion.div>

          {/* Abstract 3D Glass Object */}
          <motion.div 
            className="hidden lg:flex w-[400px] h-[400px] absolute right-10 top-1/2 -translate-y-1/2 items-center justify-center pointer-events-none preserve-3d"
            style={{ y: textY, opacity }}
            animate={{ rotateY: 360, rotateZ: [0, 10, -10, 0] }}
            transition={{ rotateY: { duration: 30, repeat: Infinity, ease: "linear" }, rotateZ: { duration: 10, repeat: Infinity, ease: "easeInOut" } }}
          >
            <div className="absolute w-[250px] h-[250px] rounded-full border border-white/20 bg-gradient-to-br from-white/10 to-[#00A693]/10 backdrop-blur-xl shadow-[inset_0_0_50px_rgba(255,255,255,0.2),0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-center preserve-3d">
              <motion.div 
                animate={{ rotateX: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-[150px] h-[150px] rounded-full border-2 border-[#00A693]/30 border-t-[#D1FAE5] border-b-[#D1FAE5]"
              />
              <div className="absolute w-[100px] h-[100px] rounded-full bg-gradient-to-tr from-[#00A693] to-[#047857] blur-md opacity-80" />
            </div>
          </motion.div>
          
        </div>
      </section>

      {/* SECTION: ABOUT */}
      <section id="about" className="py-32 bg-[#F5F5F4] relative z-10 border-t border-[#E7E5E4] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-[#00A693]/10 to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <h2 className="font-display text-4xl md:text-5xl font-medium text-[#1C1917] mb-6">Personalised Support.<br/>Meaningful <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#047857] to-[#00A693]">Progress.</span></h2>
              <p className="text-lg text-[#57534E] font-light leading-relaxed mb-6">
                Every child is different. Our specialists work closely with children and parents to understand individual needs and create practical support plans.
              </p>
              <p className="text-lg text-[#57534E] font-light leading-relaxed mb-10">
                Founded in Wandoor, Kerala, our centre brings together compassionate experts dedicated to providing world-class developmental support in a warm, premium environment.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative aspect-[4/5] md:aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl group"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#047857]/40 to-transparent mix-blend-overlay z-10 transition-opacity duration-1000 group-hover:opacity-20" />
              <img src="https://images.unsplash.com/photo-1576402327429-c8fcfa127532?q=80&w=800&auto=format&fit=crop" alt="Child learning" className="w-full h-full object-cover transform transition-transform duration-[2000ms] group-hover:scale-105" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION: PREMIUM FEATURE */}
      <section className="py-32 bg-[#1C1917] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#00A693]/20 to-transparent pointer-events-none" />
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.4 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 -z-10 bg-[url('https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?q=80&w=1080&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay grayscale"
        />
        
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h3 className="font-display text-3xl md:text-5xl font-medium text-white mb-8 leading-tight drop-shadow-sm">
              Every Child Has Their Own Path.
            </h3>
            <p className="text-lg md:text-xl text-[#A8A29E] font-light leading-relaxed max-w-2xl mx-auto">
              We provide thoughtful <span className="font-medium text-white">guidance</span> and personalised support to help children move forward with <span className="font-medium text-white">confidence</span>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION: SERVICES */}
      <section id="services" className="py-32 bg-gradient-to-b from-[#F5F5F4] to-[#FCFBF9] relative z-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-20"
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 relative rounded-2xl overflow-hidden shadow-sm border border-[#E7E5E4]">
                <Image src="/logo.jpg" alt="Little Lantern" fill className="object-cover" />
              </div>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-medium text-[#1C1917] tracking-tight mb-6">Our Services</h2>
            <p className="text-lg text-[#78716C] font-light leading-relaxed">Comprehensive, evidence-based support tailored to your child's developmental milestones and unique needs.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { num: "01", title: "Child Counselling", desc: "Emotional support for children and adolescents." },
              { num: "02", title: "Individual Counselling", desc: "One-to-one professional counselling tailored to individual needs." },
              { num: "03", title: "Group Counselling", desc: "Supportive sessions in a small group setting to develop communication." },
              { num: "04", title: "Special Education", desc: "Personalised learning support for individual neurodivergent needs." },
              { num: "05", title: "Speech & Language", desc: "Expert support for communication, articulation, and comprehension." },
              { num: "06", title: "Occupational Therapy", desc: "Developing fine motor skills, sensory processing, and daily living." },
              { num: "07", title: "Behavioural Support", desc: "Practical strategies for positive behavioural development." },
              { num: "08", title: "Learning Support", desc: "Focused support for learning challenges and overall academic growth." },
              { num: "09", title: "Psychological Consult", desc: "Professional assessment, clinical insight and comprehensive guidance." },
              { num: "10", title: "Psychometric Testing", desc: "Assessment to understand cognitive, behavioural, and learning areas." },
              { num: "11", title: "Career Counselling", desc: "Guidance to help students understand strengths and suitable pathways." },
              { num: "12", title: "Remedial Teaching", desc: "Academic support designed to strengthen foundational skills." },
              { num: "13", title: "Parent Counselling", desc: "Helping parents understand, support and guide their child's journey." }
            ].map((service, index) => {
              return (
                <motion.div 
                  key={service.num}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
                  className="group"
                >
                  <div className="h-full bg-white p-10 rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-all duration-500 hover:shadow-[0_20px_40px_rgba(4,120,87,0.06)] hover:-translate-y-1 border border-[#F5F5F4] flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00A693] to-[#047857] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    
                    <div className="relative z-10">
                      <div className="mb-6">
                        <span className="text-sm font-medium text-[#00A693] tracking-wider">{service.num}</span>
                      </div>
                      <h3 className="text-2xl font-medium text-[#1C1917] mb-3 font-display leading-tight">{service.title}</h3>
                      <p className="text-[#78716C] font-light leading-relaxed text-[15px]">{service.desc}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION: SPECIALISTS */}
      <section id="specialists" className="py-32 bg-[#1C1917] relative z-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl"
            >
              <h2 className="font-display text-4xl md:text-5xl font-medium text-white tracking-tight mb-4">Our Specialists</h2>
              <p className="text-lg text-[#A8A29E] font-light">Meet the experts guiding your child's journey.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Link href="/specialists" className="inline-flex items-center gap-2 text-sm font-medium text-[#D1FAE5] hover:text-white transition-colors group px-6 py-3 rounded-full bg-[#047857]/20 border border-[#047857]/40 hover:bg-[#047857]/40">
                View Directory
                <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {specialists.slice(0, 3).map((s, idx) => (
              <motion.div 
                key={s.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="h-full"
              >
                <Link href={`/specialists/${s.id}`} className="group block h-full">
                  <div className="h-full bg-[#292524] rounded-[2rem] border border-[#44403C] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:-translate-y-2 flex flex-col relative">
                    
                    {/* Image container */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#1C1917]">
                      {s.imageUrl ? (
                        <img src={s.imageUrl} alt={s.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#292524] to-[#1C1917]">
                          <span className="text-5xl font-display text-[#57534E]">{s.name.charAt(0)}</span>
                        </div>
                      )}
                      <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
                        {s.services.slice(0, 2).map((srv: any) => (
                          <span key={srv.id} className="inline-flex items-center rounded-lg bg-[#1C1917]/90 backdrop-blur px-3 py-1.5 text-[11px] uppercase tracking-wider font-semibold text-[#D1FAE5] shadow-sm border border-white/5">
                            {srv.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-8 flex flex-col flex-grow relative z-10">
                      <h3 className="font-display text-2xl font-medium text-white group-hover:text-[#D1FAE5] transition-colors">{s.name}</h3>
                      <p className="text-[#00A693] text-sm font-medium mt-1">{s.designation}</p>
                      
                      <div className="mt-6 space-y-3 text-[13px] text-[#A8A29E] flex-grow">
                        <div className="flex items-start gap-3">
                          <Award className="w-4 h-4 text-[#78716C] shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{s.qualifications}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-[#78716C] shrink-0" />
                          <span>{s.experience} Years Experience</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Footer CTA */}
                    <div className="p-8 pt-0 mt-auto flex items-center justify-between border-t border-[#44403C] pt-6">
                      <div className="text-sm">
                        <span className="font-semibold text-white">₹{s.consultationFee}</span>
                        <span className="text-[#78716C]"> / session</span>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-[#1C1917] flex items-center justify-center text-white border border-[#44403C] group-hover:bg-[#00A693] group-hover:border-[#00A693] transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: CONTACT */}
      <section id="contact" className="py-32 bg-[#F5F5F4] overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#D1FAE5]/30 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="max-w-lg"
            >
              <h2 className="font-display text-4xl md:text-5xl font-medium text-[#1C1917] mb-6">Visit Our Centre</h2>
              <p className="text-lg text-[#57534E] font-light leading-relaxed mb-12">
                Our beautifully designed space in Wandoor provides a calm, safe, and inspiring environment for children and their families to thrive.
              </p>
              
              <div className="space-y-8 mb-12">
                <div className="flex gap-5 items-start group">
                  <div className="mt-1 w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 border border-[#E7E5E4] group-hover:border-[#047857] transition-colors">
                    <MapPin className="w-5 h-5 text-[#047857]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-[#A8A29E] mb-1">Location</h4>
                    <p className="text-[#1C1917] font-medium text-lg">Little Lantern</p>
                    <p className="text-[#78716C]">Wandoor, Kerala 679328</p>
                  </div>
                </div>
                
                <div className="flex gap-5 items-start group">
                  <div className="mt-1 w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 border border-[#E7E5E4] group-hover:border-[#047857] transition-colors">
                    <Phone className="w-5 h-5 text-[#047857]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-[#A8A29E] mb-1">Phone</h4>
                    <a href="tel:+919961757373" className="text-[#1C1917] font-medium text-lg hover:text-[#00A693] transition-colors">9961757373</a>
                  </div>
                </div>

                <div className="flex gap-5 items-start group">
                  <div className="mt-1 w-12 h-12 rounded-full bg-[#25D366] shadow-sm flex items-center justify-center shrink-0 border border-[#20bd5a] hover:brightness-110 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 3.825 0 6.938 3.112 6.938 6.938-.001 3.825-3.113 6.937-6.938 6.938z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-[#A8A29E] mb-1">WhatsApp</h4>
                    <a href="https://wa.me/919961757373?text=Hello%20Little%20Lantern%2C%20I%20would%20like%20to%20know%20more%20about%20your%20consultation%20services." target="_blank" rel="noreferrer" className="text-[#047857] hover:text-[#065F46] font-medium text-lg transition-colors">Chat with us</a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Real Map UI Element */}
            <motion.div 
              initial={{ opacity: 0, rotateY: -10, scale: 0.95 }}
              whileInView={{ opacity: 1, rotateY: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative aspect-square md:aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white group"
            >
              <iframe 
                src="https://maps.google.com/maps?q=Wandoor,+Kerala&t=m&z=15&output=embed&iwloc=near" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full grayscale-[30%] contrast-125 opacity-90 transition-all duration-1000 group-hover:grayscale-0 group-hover:opacity-100"
              />
              <div className="absolute top-4 right-4 z-10 pointer-events-none">
                <span className="bg-[#047857]/90 backdrop-blur-md px-4 py-2 rounded-full text-xs font-semibold text-white shadow-lg tracking-wide border border-white/20">
                  Wandoor, Kerala
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION: CTA */}
      <section className="py-32 bg-[#065F46] text-center relative overflow-hidden">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#00A693] to-transparent scale-150 mix-blend-overlay" 
        />
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-3xl mx-auto px-6"
        >
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 relative rounded-2xl overflow-hidden shadow-xl border-2 border-white/20">
              <Image src="/logo.jpg" alt="Little Lantern" fill className="object-cover" />
            </div>
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-medium text-white mb-6 tracking-tight drop-shadow-sm">Ready to take the next step?</h2>
          <p className="text-[#D1FAE5] text-lg md:text-xl font-light mb-12 max-w-xl mx-auto leading-relaxed opacity-90">
            Schedule a consultation with our specialists to discuss your child's unique needs.
          </p>
          <Link href="#specialists">
            <Button size="lg" className="bg-white text-[#065F46] hover:bg-[#D1FAE5] rounded-full h-16 px-12 text-lg shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition-all duration-300 hover:scale-105 font-medium border-0">
              Book a Consultation
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
