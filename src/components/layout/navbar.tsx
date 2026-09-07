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
  { name: "Careers", href: "/careers" },
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

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header 
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled 
          ? "bg-[#FCFBF9]/90 backdrop-blur-md border-b border-[#F5F5F4] py-3 shadow-sm" 
          : "bg-transparent py-5"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-3 group">
            <span className="sr-only">Little Lantern</span>
            <div className="relative overflow-hidden rounded-md h-10 w-10 shadow-sm border border-stone-100 group-hover:shadow-md transition-shadow">
              <Image src="/logo.jpg" alt="Little Lantern Logo" fill className="object-cover" />
            </div>
            <span className="font-display font-semibold text-2xl tracking-tight text-[#292524] hidden sm:inline-block">Little Lantern</span>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-[#292524] hover:bg-stone-100 transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-10">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-[15px] font-medium leading-6 transition-all duration-300 relative group",
                pathname === item.href ? "text-[#047857]" : "text-[#57534E] hover:text-[#292524]"
              )}
            >
              {item.name}
              <span className={cn(
                "absolute -bottom-1 left-0 h-[2px] bg-[#047857] transition-all duration-300",
                pathname === item.href ? "w-full" : "w-0 group-hover:w-full"
              )}></span>
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-5 items-center">
          <div className="hidden xl:flex items-center gap-5 mr-2">
            <a href="tel:+919961757373" className="text-sm font-medium text-[#57534E] hover:text-[#047857] transition-colors flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#F5F5F4] flex items-center justify-center group-hover:bg-[#E6F8F3] transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </span>
              99617 57373
            </a>
          </div>
          <Link href="/specialists">
            <Button variant="default" className="bg-gradient-to-br from-[#00A693] to-[#047857] hover:brightness-110 text-white rounded-full px-7 py-5 text-sm font-medium hover-lift shadow-[0_4px_15px_rgba(0,166,147,0.3)] transition-all">
              Book Consultation
            </Button>
          </Link>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 bg-[#292524]/40 backdrop-blur-sm" 
            onClick={() => setMobileMenuOpen(false)} 
          >
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-[#FCFBF9] px-6 py-6 sm:max-w-sm shadow-2xl border-l border-[#F5F5F4]"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                  <div className="relative h-10 w-10 rounded-md overflow-hidden shadow-sm border border-stone-100">
                    <Image src="/logo.jpg" alt="Little Lantern Logo" fill className="object-cover" />
                  </div>
                  <span className="font-display font-semibold text-2xl text-[#292524]">Little Lantern</span>
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-full p-2.5 text-[#57534E] hover:bg-stone-100 transition-colors"
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
                    <Link
                      href="/specialists"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full rounded-full px-3 py-4 text-center text-base font-medium text-white bg-gradient-to-br from-[#00A693] to-[#047857] hover:brightness-110 hover:shadow-lg transition-all"
                    >
                      Book Consultation
                    </Link>
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
