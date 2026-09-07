"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createSpecialist(data: any) {
  try {
    const { services, ...rest } = data;
    
    await prisma.specialist.create({
      data: {
        ...rest,
        // Assuming services is an array of service IDs
        ...(services && services.length > 0 && {
          services: {
            connect: services.map((id: string) => ({ id }))
          }
        })
      }
    });

    revalidatePath("/admin/specialists");
    revalidatePath("/specialists");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to create specialist" };
  }
}

export async function updateSpecialist(id: string, data: any) {
  try {
    const { services, ...rest } = data;
    
    // For simplicity, we just set the new services array (replacing old ones)
    await prisma.specialist.update({
      where: { id },
      data: {
        ...rest,
        ...(services && {
          services: {
            set: services.map((serviceId: string) => ({ id: serviceId }))
          }
        })
      }
    });

    revalidatePath("/admin/specialists");
    revalidatePath("/specialists");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to update specialist" };
  }
}

export async function deleteSpecialist(id: string) {
  try {
    // Instead of actual delete, we can also deactivate. But here is the delete:
    await prisma.specialist.delete({
      where: { id }
    });
    revalidatePath("/admin/specialists");
    revalidatePath("/specialists");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to delete specialist" };
  }
}

export async function toggleSpecialistStatus(id: string, currentStatus: boolean) {
  try {
    await prisma.specialist.update({
      where: { id },
      data: { isActive: !currentStatus }
    });
    revalidatePath("/admin/specialists");
    revalidatePath("/specialists");
    return { success: true };
  } catch (error: any) {
    return { error: "Failed to update status" };
  }
}

// Manage availability rules
export async function updateSpecialistAvailability(specialistId: string, availabilities: { dayOfWeek: number, startTime: string, endTime: string }[]) {
  try {
    // Transaction to replace all availability rules for this specialist
    await prisma.$transaction(async (tx) => {
      await tx.availability.deleteMany({ where: { specialistId } });
      if (availabilities.length > 0) {
        for (const a of availabilities) {
          await tx.availability.create({
            data: { ...a, specialistId }
          });
        }
      }
    });
    return { success: true };
  } catch (error: any) {
    return { error: "Failed to update availability" };
  }
}

export async function addLockedSlot(data: { specialistId: string, date: string, startTime?: string, endTime?: string, reason?: string }) {
  try {
    await prisma.lockedSlot.create({
      data: {
        specialistId: data.specialistId,
        date: new Date(data.date),
        startTime: data.startTime || null,
        endTime: data.endTime || null,
        reason: data.reason || null
      }
    });
    revalidatePath("/admin/specialists");
    revalidatePath("/specialists");
    return { success: true };
  } catch (e: any) {
    return { error: "Failed to lock slot" };
  }
}

export async function removeLockedSlot(id: string) {
  try {
    await prisma.lockedSlot.delete({ where: { id } });
    revalidatePath("/admin/specialists");
    revalidatePath("/specialists");
    return { success: true };
  } catch (e: any) {
    return { error: "Failed to remove locked slot" };
  }
}
