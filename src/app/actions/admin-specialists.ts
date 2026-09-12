"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function createSpecialist(data: any) {
  try {
    const { services, ...rest } = data;
    
    // Ensure advanceAmount is float
    if (rest.advanceAmount) rest.advanceAmount = parseFloat(rest.advanceAmount);
    
    const specialist = await prisma.specialist.create({
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

    // Auto-create faculty user if active and email provided
    if (specialist.email && specialist.status === "ACTIVE" && !specialist.userId) {
      await setupFacultyUser(specialist);
    }

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
    
    if (rest.advanceAmount) rest.advanceAmount = parseFloat(rest.advanceAmount);
    
    // For simplicity, we just set the new services array (replacing old ones)
    const specialist = await prisma.specialist.update({
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

    // Auto-create faculty user if they just became active or email was added
    if (specialist.email && specialist.status === "ACTIVE" && !specialist.userId) {
      await setupFacultyUser(specialist);
    }

    revalidatePath("/admin/specialists");
    revalidatePath("/specialists");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to update specialist" };
  }
}

export async function updateSpecialistOrder(id: string, newOrder: number) {
  try {
    const target = await prisma.specialist.findUnique({ where: { id } });
    if (!target) return { error: "Not found" };

    const allSpecialists = await prisma.specialist.findMany({
      orderBy: { displayOrder: "asc" },
    });

    let others = allSpecialists.filter(s => s.id !== id);
    const targetIndex = Math.max(0, Math.min(newOrder - 1, others.length));
    others.splice(targetIndex, 0, target);

    await prisma.$transaction(
      others.map((s, idx) =>
        prisma.specialist.update({
          where: { id: s.id },
          data: { displayOrder: idx + 1 },
        })
      )
    );

    revalidatePath("/admin/specialists");
    revalidatePath("/specialists");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to update order" };
  }
}

export async function deleteSpecialist(id: string) {
  try {
    const apps = await prisma.appointment.findMany({ where: { specialistId: id }, select: { id: true } });
    const appIds = apps.map(a => a.id);
    
    await prisma.$transaction([
      prisma.payment.deleteMany({ where: { appointmentId: { in: appIds } } }),
      prisma.transaction.deleteMany({ where: { appointmentId: { in: appIds } } }),
      prisma.invoice.deleteMany({ where: { appointmentId: { in: appIds } } }),
      prisma.appointment.deleteMany({ where: { specialistId: id } }),
      prisma.availability.deleteMany({ where: { specialistId: id } }),
      prisma.lockedSlot.deleteMany({ where: { specialistId: id } }),
      prisma.slotHold.deleteMany({ where: { specialistId: id } }),
      prisma.specialist.delete({ where: { id } })
    ]);
    revalidatePath("/admin/specialists");
    revalidatePath("/specialists");
    return { success: true };
  } catch (error: any) {
    console.error("[SPECIALIST_DELETE]", error);
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


async function setupFacultyUser(specialist: any) {
  try {
    const existingUser = await prisma.user.findUnique({ where: { email: specialist.email } });
    
    let userId;
    if (existingUser) {
      userId = existingUser.id;
      await prisma.specialist.update({ where: { id: specialist.id }, data: { userId } });
    } else {
      const tempPassword = crypto.randomBytes(8).toString("hex");
      const hashedPassword = await bcrypt.hash(tempPassword, 10);
      
      const newUser = await prisma.user.create({
        data: {
          name: specialist.name,
          email: specialist.email,
          password: hashedPassword,
          role: "FACULTY",
        }
      });
      userId = newUser.id;
      
      await prisma.specialist.update({ where: { id: specialist.id }, data: { userId } });
      
      const { emailTemplates } = await import("@/lib/email");
      try {
        // We assume an email template exists, if not we fall back gracefully
        if (emailTemplates.facultyWelcome) {
            await emailTemplates.facultyWelcome(specialist.email, specialist.name, tempPassword);
        }
      } catch (e) {
        console.error("Failed to send faculty welcome email", e);
      }
    }
  } catch (err) {
    console.error("Faculty user setup error:", err);
  }
}

