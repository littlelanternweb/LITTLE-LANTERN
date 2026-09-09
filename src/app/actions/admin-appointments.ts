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

export async function markBalanceReceived(appointmentId: string, amount: number, method: string, notes: string) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role === "FACULTY") {
    return { error: "Unauthorized" };
  }

  try {
    const apt = await prisma.appointment.findUnique({ where: { id: appointmentId } });
    if (!apt) return { error: "Appointment not found" };

    const newBalancePaid = apt.balancePaid + amount;
    const isFullyPaid = (apt.advancePaid + newBalancePaid) >= apt.totalAmount;

    await prisma.transaction.create({
      data: {
        appointmentId,
        amount,
        type: "BALANCE",
        method,
        status: "SUCCESS",
        notes
      }
    });

    await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        balancePaid: newBalancePaid,
        paymentStatus: isFullyPaid ? "FULLY_PAID" : "PARTIALLY_PAID"
      }
    });

    await logActivity("BALANCE_RECEIVED", appointmentId, `Amount: ${amount}, Method: ${method}`);

    revalidatePath(`/admin/appointments/${appointmentId}`);
    revalidatePath("/admin/appointments");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    return { error: "Failed to record payment" };
  }
}

export async function reassignFaculty(appointmentId: string, newSpecialistId: string) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role === "FACULTY") {
    return { error: "Unauthorized" };
  }

  try {
    const apt = await prisma.appointment.findUnique({ 
      where: { id: appointmentId },
      include: { customer: true, child: true }
    });
    if (!apt) return { error: "Appointment not found" };

    const newSpec = await prisma.specialist.findUnique({ where: { id: newSpecialistId } });
    if (!newSpec) return { error: "Specialist not found" };

    // Prevent overlap
    const existing = await prisma.appointment.findFirst({
      where: {
        specialistId: newSpecialistId,
        date: apt.date,
        startTime: apt.startTime,
        status: { not: "CANCELLED" }
      }
    });

    if (existing) {
      return { error: "This specialist is already booked at that time." };
    }

    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { specialistId: newSpecialistId }
    });

    await logActivity("FACULTY_REASSIGNED", appointmentId, `Assigned to ${newSpec.name}`);

    // Notify new faculty if they have an email
    if (newSpec.email) {
      try {
        const { emailTemplates } = await import("@/lib/email");
        if (emailTemplates.assignmentNotification) {
          await emailTemplates.assignmentNotification(
            newSpec.email,
            newSpec.name,
            {
              id: apt.id,
              date: apt.date.toLocaleDateString(),
              time: apt.startTime,
              patient: apt.child.name,
              service: "Consultation"
            }
          );
        }
      } catch (e) {
         console.error("Failed to notify new faculty:", e);
      }
    }

    revalidatePath(`/admin/appointments/${appointmentId}`);
    revalidatePath("/admin/appointments");
    return { success: true };
  } catch (error: any) {
    return { error: "Failed to reassign faculty" };
  }
}

export async function editOfflinePayment(transactionId: string, updates: { amount: number, method: string, date: string, reference?: string, notes?: string }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role === "FACULTY") {
    return { error: "Unauthorized" };
  }

  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { appointment: true }
    });

    if (!transaction) return { error: "Transaction not found" };
    if (transaction.type !== "BALANCE" && transaction.type !== "OTHER") {
      return { error: "Only offline balance/other payments can be edited." };
    }
    
    // Prevent negative or zero amounts
    if (updates.amount <= 0) {
      return { error: "Amount must be greater than zero." };
    }

    const apt = transaction.appointment;
    const oldAmount = transaction.amount;
    const newAmount = updates.amount;

    // Recalculate Appointment balance
    // balancePaid should be updated by the difference
    const amountDifference = newAmount - oldAmount;
    const newBalancePaid = apt.balancePaid + amountDifference;

    // Validate that new balance doesn't exceed total amount
    if ((apt.advancePaid + newBalancePaid) > apt.totalAmount) {
      return { error: "Updated amount exceeds the total consultation fee." };
    }

    const isFullyPaid = (apt.advancePaid + newBalancePaid) >= apt.totalAmount;

    // Update Transaction
    await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        amount: newAmount,
        method: updates.method,
        date: new Date(updates.date),
        reference: updates.reference || null,
        notes: updates.notes || null,
      }
    });

    // Update Appointment
    await prisma.appointment.update({
      where: { id: apt.id },
      data: {
        balancePaid: newBalancePaid,
        paymentStatus: isFullyPaid ? "FULLY_PAID" : "PARTIALLY_PAID"
      }
    });

    // Audit Log
    const auditDetails = `Edited TX: ${transactionId}. Amount: ₹${oldAmount} -> ₹${newAmount}. Method: ${transaction.method} -> ${updates.method}.`;
    await logActivity("OFFLINE_PAYMENT_EDITED", apt.id, auditDetails);

    revalidatePath(`/admin/appointments/${apt.id}`);
    revalidatePath("/admin/appointments");
    revalidatePath("/admin/payments");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to edit offline payment:", error);
    return { error: "Failed to edit offline payment." };
  }
}