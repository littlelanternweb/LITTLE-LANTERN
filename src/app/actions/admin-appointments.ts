"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { addMinutes } from "date-fns";

async function logActivity(action: string, entityId: string, details?: string) {
  const session = await getServerSession(authOptions);
  await prisma.activityLog.create({
    data: {
      userId: session?.user ? (session.user as any).id : null,
      action,
      entity: "Appointment",
      entityId,
      details
    }
  });
}

export async function cancelAppointment(appointmentId: string, reason: string) {
  const session = await getServerSession(authOptions);
  if (!hasPermission((session?.user as any)?.role, PERMISSIONS.APPOINTMENTS_CANCEL)) {
    return { error: "Unauthorized" };
  }

  try {
    const apt = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: "CANCELLED",
        cancellationReason: reason
      },
      include: { customer: true, specialist: true }
    });

    try {
      const { emailTemplates } = await import("@/lib/email");
      await emailTemplates.appointmentCancelled(
        apt.customer.email,
        apt.customer.name,
        apt.specialist.name,
        apt.date.toLocaleDateString(),
        apt.startTime,
        apt.id
      );
    } catch (e) {
      console.error("Failed to send cancel email:", e);
    }

    await logActivity("APPOINTMENT_CANCELLED", appointmentId, `Reason: ${reason}`);
    
    revalidatePath("/admin/appointments");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    return { error: "Failed to cancel appointment." };
  }
}

export async function changeAppointmentStatus(appointmentId: string, newStatus: string, reason?: string) {
  const session = await getServerSession(authOptions);
  if (!hasPermission((session?.user as any)?.role, PERMISSIONS.APPOINTMENTS_MANAGE)) {
    return { error: "Unauthorized" };
  }

  try {
    const oldApt = await prisma.appointment.findUnique({ where: { id: appointmentId }});
    if (!oldApt) return { error: "Appointment not found" };

    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: newStatus }
    });

    await logActivity("STATUS_CHANGED", appointmentId, `Changed from ${oldApt.status} to ${newStatus}${reason ? ' - ' + reason : ''}`);
    
    revalidatePath("/admin/appointments");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    return { error: "Failed to change status." };
  }
}

export async function rescheduleAppointment(appointmentId: string, newDate: string, newStartTime: string) {
  const session = await getServerSession(authOptions);
  if (!hasPermission((session?.user as any)?.role, PERMISSIONS.APPOINTMENTS_RESCHEDULE)) {
    return { error: "Unauthorized" };
  }

  try {
    const apt = await prisma.appointment.findUnique({ 
      where: { id: appointmentId },
      include: { customer: true, specialist: true } 
    });
    if (!apt) return { error: "Appointment not found" };

    // Prevent overlap
    const existing = await prisma.appointment.findFirst({
      where: {
        specialistId: apt.specialistId,
        date: new Date(newDate),
        startTime: newStartTime,
        status: { not: "CANCELLED" }
      }
    });

    if (existing) {
      return { error: "This slot is already booked." };
    }

    const newEndTime = addMinutes(new Date(`1970-01-01T${newStartTime}:00`), 60).toTimeString().substring(0,5);

    const oldDateStr = apt.date.toLocaleDateString();
    const oldTimeStr = apt.startTime;

    const updatedApt = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        date: new Date(newDate),
        startTime: newStartTime,
        endTime: newEndTime,
      }
    });

    try {
      const { emailTemplates } = await import("@/lib/email");
      await emailTemplates.appointmentRescheduled(
        apt.customer.email,
        apt.customer.name,
        apt.specialist.name,
        oldDateStr,
        oldTimeStr,
        updatedApt.date.toLocaleDateString(),
        updatedApt.startTime,
        apt.id
      );
    } catch (e) {
      console.error("Failed to send reschedule email:", e);
    }

    await logActivity("APPOINTMENT_RESCHEDULED", appointmentId, `Rescheduled to ${newDate} at ${newStartTime}`);
    
    revalidatePath("/admin/appointments");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    return { error: "Failed to reschedule appointment." };
  }
}
