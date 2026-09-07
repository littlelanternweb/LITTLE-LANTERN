"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";

export function AppointmentFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status") || "ALL";
  const currentDate = searchParams.get("date") || "";

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status === "ALL") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    router.push(`?${params.toString()}`);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateVal = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (dateVal) {
      params.set("date", dateVal);
    } else {
      params.delete("date");
    }
    router.push(`?${params.toString()}`);
  };

  const clearDate = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("date");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 w-full">
      {/* Date Filter */}
      <div className="relative flex items-center">
        <input 
          type="date" 
          value={currentDate}
          onChange={handleDateChange}
          className="bg-white border border-[#E7E5E4] rounded-xl h-10 px-3 text-[#57534E] text-sm focus:outline-none focus:ring-2 ring-[#00A693] transition-all shadow-sm w-[140px]"
        />
        {currentDate && (
          <button onClick={clearDate} className="absolute right-2 text-[#A8A29E] hover:text-[#57534E]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        )}
      </div>

      {/* Status Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="bg-white border-[#E7E5E4] rounded-xl h-10 px-4 text-[#57534E] hover:bg-[#F5F5F4] shadow-sm">
            <Filter className="w-4 h-4 mr-2" /> 
            {currentStatus === "ALL" ? "Status" : currentStatus}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuRadioGroup value={currentStatus} onValueChange={handleStatusChange}>
            <DropdownMenuRadioItem value="ALL">All Status</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="PENDING">Pending</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="CONFIRMED">Confirmed</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="COMPLETED">Completed</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="CANCELLED">Cancelled</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
