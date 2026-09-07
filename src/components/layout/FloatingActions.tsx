"use client";

import { Phone, CalendarDays } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// New WhatsApp logo (2024 redesign — filled, rounded square style)
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 175.216 175.552" className={className}>
    <defs>
      <linearGradient id="wa-gradient" x1="85.915" y1="132.085" x2="85.916" y2="43.932" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#20b038"/>
        <stop offset="1" stopColor="#60d66a"/>
      </linearGradient>
    </defs>
    <path fill="url(#wa-gradient)" d="M87.6 0C39.3 0 0 39.3 0 87.6c0 15.9 4.3 30.8 11.8 43.7L0 175.6l45.8-11.6c12.4 6.7 26.6 10.6 41.7 10.6 48.3 0 87.6-39.3 87.6-87.6C175.2 39.3 135.9 0 87.6 0z"/>
    <path fill="#fff" d="M131.5 107.6c-1.8-3-3.5-4.9-5.2-5.6-1.3-.5-2.8-.8-4.4-.8-1 0-2.1.1-3.2.4-1.9.5-3.7 1.4-5.4 2.5-1.2.8-2.3 1.8-3.1 2.9l-.2.3c-1.3 2-3.2 2.4-5.1 1.5-7.6-3.8-14.3-9.2-19.5-15.9-2.4-3-4.2-6.5-5-10.2-.3-1.3 0-2.5.8-3.5l2.3-2.8c1.3-1.5 2.2-3.3 2.7-5.2.5-2 .4-4.1-.3-6.1l-4.6-12.3c-.9-2.5-2.8-4.2-5.2-4.7-1.1-.2-2.2-.3-3.3-.3-3.6 0-7.1 1.3-9.7 3.8-5.5 5.1-8 12.3-7.2 19.6 1.5 13.3 8.4 25.2 17.5 35 9.1 9.8 21 17.7 34.2 20.8 3.9.9 7.9 1.4 11.9 1.4 5 0 9.7-1 13.9-3.1 5.4-2.6 8.8-7.7 9-13.4.1-1.7-.5-3.5-1.9-5z"/>
  </svg>
);

export function FloatingActions() {
  const pathname = usePathname();
  const [showTooltip, setShowTooltip] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Delay mount so button slides in after page load
    const t = setTimeout(() => setMounted(true), 800);
    return () => clearTimeout(t);
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  const WHATSAPP_NUMBER = "919961757373";
  const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20Little%20Lantern%2C%20I%20would%20like%20to%20know%20more%20about%20your%20consultation%20services.`;
  const PHONE_LINK = "tel:+919961757373";

  return (
    <>
      {/* Desktop Floating WhatsApp Button */}
      <AnimatePresence>
        {mounted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-6 right-6 z-40 hidden sm:flex flex-col items-end gap-3"
          >
            {/* Tooltip */}
            <AnimatePresence>
              {showTooltip && (
                <motion.span
                  initial={{ opacity: 0, x: 10, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-xl whitespace-nowrap"
                >
                  Chat on WhatsApp
                </motion.span>
              )}
            </AnimatePresence>

            <motion.a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
              aria-label="Chat with Little Lantern on WhatsApp"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-[0_8px_30px_rgba(37,211,102,0.35)] focus:outline-none focus:ring-4 focus:ring-[#25D366]/30"
            >
              {/* Pulse ring */}
              <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
              <WhatsAppIcon className="w-7 h-7 relative z-10" />
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Action Bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.6 }}
        className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-slate-100 px-4 py-3 pb-safe flex gap-2 shadow-[0_-4px_20px_rgb(0,0,0,0.05)]"
      >
        <a
          href={PHONE_LINK}
          className="flex-1 flex flex-col items-center justify-center py-2 bg-slate-50 text-slate-900 rounded-xl border border-slate-100 active:bg-slate-100 transition-colors"
          aria-label="Call Little Lantern"
        >
          <Phone className="w-5 h-5 mb-1 text-slate-600" />
          <span className="text-[10px] font-medium uppercase tracking-wider text-slate-600">Call</span>
        </a>

        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noreferrer"
          className="flex-1 flex flex-col items-center justify-center py-2 bg-[#25D366]/10 rounded-xl border border-[#25D366]/20 active:bg-[#25D366]/20 transition-colors"
          aria-label="Chat on WhatsApp"
        >
          <WhatsAppIcon className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium uppercase tracking-wider text-[#128C7E]">WhatsApp</span>
        </a>

        <Link
          href="/specialists"
          className="flex-[1.5] flex flex-col items-center justify-center py-2 bg-primary text-white rounded-xl shadow-[0_4px_15px_rgba(0,166,147,0.25)] active:bg-primary/90 transition-colors"
        >
          <CalendarDays className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium uppercase tracking-wider">Book Now</span>
        </Link>
      </motion.div>
    </>
  );
}
