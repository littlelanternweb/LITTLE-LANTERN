"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/faculty") || pathname?.startsWith("/invoice")) {
    return null;
  }

  return (
    <footer className="bg-white border-t border-slate-100 text-slate-600 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-12">
          
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 rounded-md overflow-hidden border border-slate-100 bg-white">
                <img src="/logo.jpg" alt="Little Lantern Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-semibold text-xl text-slate-900">Little Lantern</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-500 max-w-sm">
              Expert guidance for every child's unique journey. A premium child development and consultation centre.
            </p>
          </div>
          
          <div className="lg:col-span-2">
            <h3 className="text-slate-900 font-semibold mb-4 text-sm">Navigation</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/#about" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link href="/#services" className="hover:text-primary transition-colors">Services</Link></li>
              <li><Link href="/#specialists" className="hover:text-primary transition-colors">Specialists</Link></li>
              <li><Link href="/careers" className="hover:text-primary transition-colors">Become Our Faculty</Link></li>
              <li><Link href="/admin/login" className="hover:text-primary transition-colors">Faculty Portal</Link></li>
              <li><Link href="/#contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Services Col */}
          <div className="lg:col-span-3">
            <h3 className="text-slate-900 font-semibold mb-4 text-sm">Services</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/specialists?service=child-counselling" className="hover:text-primary transition-colors">Child Counselling</Link></li>
              <li><Link href="/specialists?service=special-education" className="hover:text-primary transition-colors">Special Education</Link></li>
              <li><Link href="/specialists?service=speech-language-support" className="hover:text-primary transition-colors">Speech & Language</Link></li>
              <li><Link href="/specialists?service=psychometric-testing" className="hover:text-primary transition-colors">Psychometric Testing</Link></li>
              <li><Link href="/specialists?service=career-counselling" className="hover:text-primary transition-colors">Career Counselling</Link></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="lg:col-span-3">
            <h3 className="text-slate-900 font-semibold mb-4 text-sm">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="text-slate-500">
                Little Lantern<br/>
                Wandoor, Kerala 679328
              </li>
              <li className="pt-2">
                <a href="tel:+919961757373" className="block text-primary hover:underline">99617 57373</a>
                <a href="https://wa.me/919961757373" className="block text-primary hover:underline">WhatsApp Us</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-xs">
            © {new Date().getFullYear()} Little Lantern. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-slate-400">
            <Link href="#" className="hover:text-slate-600">Privacy Policy</Link>
            <Link href="#" className="hover:text-slate-600">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
