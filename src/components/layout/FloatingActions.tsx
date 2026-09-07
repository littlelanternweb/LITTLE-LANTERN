"use client";

import { Phone, CalendarDays } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function FloatingActions() {
  const pathname = usePathname();

  // Hide on admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const WHATSAPP_NUMBER = "919961757373";
  const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20Little%20Lantern%2C%20I%20would%20like%20to%20know%20more%20about%20your%20consultation%20services.`;
  const PHONE_LINK = "tel:+919961757373";

  const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 3.825 0 6.938 3.112 6.938 6.938-.001 3.825-3.113 6.937-6.938 6.938z"/>
    </svg>
  );

  return (
    <>
      {/* Desktop & Tablet Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-40 hidden sm:flex flex-col items-end gap-3">
        <a 
          href={WHATSAPP_LINK}
          target="_blank" 
          rel="noreferrer"
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-[0_8px_30px_rgba(37,211,102,0.3)] hover:shadow-[0_12px_40px_rgba(37,211,102,0.4)] hover:bg-[#20bd5a] transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-[#25D366]/30"
          aria-label="Chat with Little Lantern on WhatsApp"
        >
          <WhatsAppIcon className="w-7 h-7 relative z-10" />

          {/* Tooltip on Hover */}
          <span className="absolute right-full mr-4 bg-[#1C1917] text-white px-4 py-2 rounded-xl text-sm font-medium shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-[#292524]">
            Chat on WhatsApp
          </span>
        </a>
      </div>

      {/* Mobile Action Bar (Hidden on sm and above) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-[#F5F5F4] px-4 py-3 shadow-[0_-4px_20px_rgb(0,0,0,0.05)] pb-safe flex gap-2">
        <a 
          href={PHONE_LINK} 
          className="flex-1 flex flex-col items-center justify-center py-2 bg-[#FCFBF9] text-[#1C1917] rounded-xl border border-[#F5F5F4] hover:bg-[#F5F5F4] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1C1917]"
          aria-label="Call Little Lantern"
        >
          <Phone className="w-5 h-5 mb-1 text-[#57534E]" />
          <span className="text-[10px] font-medium uppercase tracking-wider text-[#57534E]">Call</span>
        </a>
        
        <a 
          href={WHATSAPP_LINK}
          target="_blank" 
          rel="noreferrer"
          className="flex-1 flex flex-col items-center justify-center py-2 bg-[#25D366]/10 text-[#1da851] rounded-xl border border-[#25D366]/20 transition-colors focus:outline-none focus:ring-2 focus:ring-[#25D366]"
          aria-label="Chat with Little Lantern on WhatsApp"
        >
          <WhatsAppIcon className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium uppercase tracking-wider">WhatsApp</span>
        </a>

        <Link href="/specialists" className="flex-[1.5] flex flex-col items-center justify-center py-2 bg-gradient-to-br from-[#00A693] to-[#047857] text-white rounded-xl shadow-[0_4px_15px_rgba(0,166,147,0.3)] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00A693] focus:ring-offset-2">
          <CalendarDays className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium uppercase tracking-wider text-white">Book Now</span>
        </Link>
      </div>

      {/* Mobile Floating WhatsApp Button (Positioned above the action bar to prevent overlap) */}
      <div className="sm:hidden fixed bottom-24 right-4 z-40">
        <a 
          href={WHATSAPP_LINK}
          target="_blank" 
          rel="noreferrer"
          className="relative flex items-center justify-center w-12 h-12 rounded-full bg-[#25D366] text-white shadow-[0_8px_20px_rgba(37,211,102,0.3)] focus:outline-none focus:ring-4 focus:ring-[#25D366]/30"
          aria-label="Chat with Little Lantern on WhatsApp"
        >
          <WhatsAppIcon className="w-6 h-6 relative z-10" />
        </a>
      </div>
    </>
  );
}
