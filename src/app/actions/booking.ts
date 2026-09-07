"use server";

import { prisma } from "@/lib/db";
import { addMinutes, format, parse, isBefore, isAfter, startOfDay } from "date-fns";

export async function getAvailableSlots(specialistId: string, dateString: string) {
  // dateString is "yyyy-MM-dd"
  const date = new Date(dateString);
  const dayOfWeek = date.getDay(); // 0-6

  // 1. Get specialist availability for this day of week
  const availabilities = await prisma.availability.findMany({
    where: {
      specialistId,
      dayOfWeek,
    }
  });

  if (availabilities.length === 0) return [];

  // 2. Generate 60-min slots
  const allSlots: { startTime: string; endTime: string }[] = [];
  
  for (const av of availabilities) {
    let current = parse(av.startTime, "HH:mm", date);
    const end = parse(av.endTime, "HH:mm", date);
    
    while (isBefore(current, end)) {
      const next = addMinutes(current, 60);
      if (isAfter(next, end)) break;
      
      allSlots.push({
        startTime: format(current, "HH:mm"),
        endTime: format(next, "HH:mm"),
      });
      
      current = next;
    }
  }

  // 3. Get existing appointments and locked slots
  const appointments = await prisma.appointment.findMany({
    where: {
      specialistId,
      date: {
        gte: startOfDay(date),
        lt: addMinutes(startOfDay(date), 24 * 60),
      },
      status: { not: "CANCELLED" }
    }
  });

  const lockedSlots = await prisma.lockedSlot.findMany({
    where: {
      specialistId,
      date: {
        gte: startOfDay(date),
        lt: addMinutes(startOfDay(date), 24 * 60),
      }
    }
  });

  // Active holds
  const activeHolds = await prisma.slotHold.findMany({
    where: {
      specialistId,
      date: {
        gte: startOfDay(date),
        lt: addMinutes(startOfDay(date), 24 * 60),
      },
      expiresAt: {
        gt: new Date()
      }
    }
  });

  // Filter available
  return allSlots.filter(slot => {
    // Check if whole day is locked
    const isWholeDayLocked = lockedSlots.some(l => l.startTime === null && l.endTime === null);
    if (isWholeDayLocked) return false;

    // Check specific locks (simplified matching for prototype)
    const isLocked = lockedSlots.some(l => l.startTime === slot.startTime);
    if (isLocked) return false;

    const isBooked = appointments.some(a => a.startTime === slot.startTime);
    if (isBooked) return false;

    const isHeld = activeHolds.some(h => h.startTime === slot.startTime);
    if (isHeld) return false;

    return true;
  });
}
