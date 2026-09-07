"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-[#1C1917] text-[#D6D3D1] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 border-b border-[#44403C] pb-16">
          
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 rounded-md overflow-hidden bg-white">
                <Image src="/logo.jpg" alt="Little Lantern Logo" fill className="object-cover" />
              </div>
              <span className="font-display font-semibold text-2xl text-white">Little Lantern</span>
            </div>
            <p className="text-[15px] leading-relaxed text-[#A8A29E] max-w-sm">
              Expert guidance for every child's unique journey. A premium child development and consultation centre.
            </p>
          </div>
          
          <div className="lg:col-span-2">
            <h3 className="text-white font-medium mb-6 tracking-wide text-sm uppercase">Navigation</h3>
            <ul className="space-y-4 text-[15px]">
              <li><Link href="/" className="hover:text-[#D1FAE5] transition-colors">Home</Link></li>
              <li><Link href="/#about" className="hover:text-[#D1FAE5] transition-colors">About</Link></li>
              <li><Link href="/#services" className="hover:text-[#D1FAE5] transition-colors">Services</Link></li>
              <li><Link href="/#specialists" className="hover:text-[#D1FAE5] transition-colors">Specialists</Link></li>
              <li><Link href="/careers" className="hover:text-[#D1FAE5] transition-colors">Careers</Link></li>
              <li><Link href="/#contact" className="hover:text-[#D1FAE5] transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Services Col */}
          <div className="lg:col-span-3">
            <h3 className="text-white font-medium mb-6 tracking-wide text-sm uppercase">Services</h3>
            <ul className="space-y-4 text-[15px]">
              <li><Link href="/specialists?service=child-counselling" className="hover:text-[#D1FAE5] transition-colors">Child Counselling</Link></li>
              <li><Link href="/specialists?service=special-education" className="hover:text-[#D1FAE5] transition-colors">Special Education</Link></li>
              <li><Link href="/specialists?service=speech-language-support" className="hover:text-[#D1FAE5] transition-colors">Speech & Language Support</Link></li>
              <li><Link href="/specialists?service=psychometric-testing" className="hover:text-[#D1FAE5] transition-colors">Psychometric Testing</Link></li>
              <li><Link href="/specialists?service=career-counselling" className="hover:text-[#D1FAE5] transition-colors">Career Counselling</Link></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="lg:col-span-3">
            <h3 className="text-white font-medium mb-6 tracking-wide text-sm uppercase">Contact Us</h3>
            <ul className="space-y-4 text-[15px]">
              <li className="text-[#A8A29E]">
                Little Lantern<br/>
                Wandoor, Kerala 679328
              </li>
              <li>
                <div className="flex flex-col gap-3 mt-4">
                  <a href="tel:+919961757373" className="inline-flex items-center justify-center w-full bg-white/10 hover:bg-white/20 text-white rounded-lg py-2.5 px-4 text-sm font-medium transition-colors border border-white/5">
                    Call Us: 9961757373
                  </a>
                  <a href="https://wa.me/919961757373?text=Hello%20Little%20Lantern%2C%20I%20would%20like%20to%20know%20more%20about%20your%20consultation%20services." target="_blank" rel="noreferrer" className="inline-flex items-center justify-center w-full bg-gradient-to-br from-[#00A693] to-[#047857] hover:brightness-110 text-white rounded-lg py-2.5 px-4 text-sm font-medium transition-colors border border-[#047857]/50">
                    WhatsApp: +91 99617 57373
                  </a>
                  <a href="https://maps.app.goo.gl/Q15zWDVibbi3mzvw7?g_st=ac" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center w-full bg-[#047857] hover:bg-[#065F46] text-white rounded-lg py-2.5 px-4 text-sm font-medium transition-colors border border-[#065F46]/20">
                    Get Directions
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/60 text-sm">
            © {new Date().getFullYear()} Little Lantern. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
