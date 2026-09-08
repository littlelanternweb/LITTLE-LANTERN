"use client";

import { Phone, CalendarDays } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// Official WhatsApp 2024 icon - white silhouette
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
  </svg>
);

export function FloatingActions() {
  const pathname = usePathname();
  const [showTooltip, setShowTooltip] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 800);
    return () => clearTimeout(t);
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  const WHATSAPP_NUMBER = "919961757373";
  const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20Little%20Lantern%2C%20I%20would%20like%20to%20know%20more%20about%20your%20consultation%20services.`;
  const PHONE_LINK = "tel:+919961757373";

  return (
    <>
      {/* WhatsApp Floating Button (Both Mobile & Desktop) */}
      <AnimatePresence>
        {mounted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.4 }}
            className="fixed z-50 flex flex-col items-end gap-3 right-5 bottom-24 sm:right-7 sm:bottom-7"
          >
            {/* Animated tooltip (Desktop only) */}
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, x: 8, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="hidden sm:block bg-slate-900 text-white text-[13px] font-medium px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap mr-2"
                >
                  Chat with us on WhatsApp
                  <span className="absolute right-[-4px] top-1/2 -translate-y-1/2 border-[4px] border-transparent border-l-slate-900" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Button with breathing animation */}
            <motion.a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
              aria-label="Chat with Little Lantern on WhatsApp"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.06, y: -2, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.95 }}
              className="relative flex items-center justify-center w-[52px] h-[52px] sm:w-[56px] sm:h-[56px] rounded-full bg-[#25D366] text-white shadow-[0_4px_16px_rgba(37,211,102,0.3)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.4)] transition-shadow"
            >
              <WhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7 relative z-10" />
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE: Sticky bottom action bar */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center gap-3 px-4 py-3 bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-[0_-2px_15px_rgba(0,0,0,0.03)]"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        {/* Call Now */}
        <motion.a
          whileTap={{ scale: 0.97 }}
          href={PHONE_LINK}
          className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 transition-colors"
          aria-label="Call Now"
        >
          <Phone className="w-[18px] h-[18px]" />
          <span className="text-[13px] font-semibold">Call Now</span>
        </motion.a>

        {/* Book Now */}
        <motion.a
          whileTap={{ scale: 0.97 }}
          href="/specialists"
          className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-primary text-white shadow-[0_2px_12px_rgba(0,166,147,0.2)]"
        >
          <CalendarDays className="w-[18px] h-[18px]" />
          <span className="text-[13px] font-semibold">Book Now</span>
        </motion.a>
      </motion.div>

      {/* Spacer so page content isn't hidden behind the bar on mobile */}
      <div className="sm:hidden h-[80px]" style={{ paddingBottom: "env(safe-area-inset-bottom)" }} aria-hidden="true" />
    </>
  );
}
