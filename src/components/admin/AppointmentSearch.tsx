"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";

export function AppointmentSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const query = searchParams.get("q") || "";

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const val = e.currentTarget.value;
      const params = new URLSearchParams(searchParams.toString());
      if (val) {
        params.set("q", val);
      } else {
        params.delete("q");
      }
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <div className="flex items-center gap-2 w-full sm:max-w-md bg-white border border-[#E7E5E4] rounded-xl px-4 py-2.5 focus-within:ring-2 ring-[#00A693] focus-within:border-transparent transition-all shadow-sm">
      <Search className="w-4 h-4 text-[#A8A29E]" />
      <input 
        type="text" 
        placeholder="Search by ID, name, email (Press Enter)" 
        className="w-full text-sm outline-none text-[#1C1917] placeholder:text-[#A8A29E]"
        defaultValue={query}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
