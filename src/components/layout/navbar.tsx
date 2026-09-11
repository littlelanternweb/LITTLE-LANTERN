"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/#about" },
  { name: "Services", href: "/#services" },
  { name: "Specialists", href: "/#specialists" },
  { name: "Become Our Faculty", href: "/careers" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/faculty") || pathname?.startsWith("/invoice")) {
    return null;
  }

  return (
    <header 
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-400",
        scrolled 
          ? "bg-white/90 backdrop-blur-md border-b border-slate-100 py-2.5 shadow-sm" 
          : "bg-transparent py-4"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-3.5 group">
            <span className="sr-only">Little Lantern</span>
            <div className="relative overflow-hidden rounded-[0.4rem] h-10 w-10 sm:h-11 sm:w-11 shadow-sm border border-slate-100 group-hover:shadow-md transition-all bg-white">
              <img src="/logo.jpg" alt="Little Lantern Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-display font-semibold text-xl sm:text-[22px] tracking-tight text-slate-900 hidden sm:inline-block">Little Lantern</span>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-slate-800 hover:bg-slate-100 transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium leading-6 transition-all duration-200 relative group",
                pathname === item.href ? "text-primary" : "text-slate-600 hover:text-primary"
              )}
            >
              {item.name}
              <span className={cn(
                "absolute -bottom-1 left-0 h-[2px] bg-primary transition-all duration-300",
                pathname === item.href ? "w-full" : "w-0 group-hover:w-full"
              )}></span>
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center">
          <motion.div whileHover={{ y: -1, boxShadow: "0 4px 12px rgba(0,166,147,0.2)" }} whileTap={{ scale: 0.97 }}>
            <Button asChild variant="default" className="bg-primary hover:bg-primary/95 text-white rounded-md h-9 px-5 text-sm font-medium shadow-[0_2px_8px_rgba(0,166,147,0.15)] transition-colors">
              <Link href="/specialists">Book Consultation</Link>
            </Button>
          </motion.div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm" 
            onClick={() => setMobileMenuOpen(false)} 
          >
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm shadow-2xl border-l border-slate-100"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                  <div className="relative h-12 w-12 rounded-lg overflow-hidden shadow-sm border border-slate-100 bg-white">
                    <img src="/logo.jpg" alt="Little Lantern Logo" className="w-full h-full object-cover" />
                  </div>
                  <span className="font-display font-semibold text-2xl text-slate-900">Little Lantern</span>
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-full p-2.5 text-slate-500 hover:bg-slate-100 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-10 flow-root">
                <div className="-my-6 divide-y divide-[#E7E5E4]">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "-mx-3 block rounded-xl px-4 py-3 text-lg font-medium leading-7 transition-colors",
                          pathname === item.href ? "text-[#047857] bg-[#D1FAE5]/50" : "text-[#292524] hover:bg-[#F5F5F4]"
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  <div className="py-6">
                    <motion.a
                      href="/specialists"
                      onClick={() => setMobileMenuOpen(false)}
                      whileTap={{ scale: 0.97 }}
                      className="block w-full rounded-md px-3 py-4 text-center text-base font-medium text-white bg-primary hover:bg-primary/90 hover:shadow-lg transition-all"
                    >
                      Book Consultation
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
