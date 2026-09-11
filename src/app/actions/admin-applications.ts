"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";

export async function updateJobApplicationStatus(id: string, newStatus: string) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    // Faculty should not be able to modify job applications
    if (role !== "SUPER_ADMIN" && role !== "ADMIN") {
      return { error: "Unauthorized access. Only admins can update applications." };
    }

    if (!id || !newStatus) {
      return { error: "Invalid parameters provided." };
    }

    // Update the database
    const updatedApplication = await prisma.jobApplication.update({
      where: { id },
      data: { status: newStatus },
    });

    // Revalidate the applications page to reflect the new status
    revalidatePath("/admin/jobs");

    return { success: true, data: updatedApplication };
  } catch (error) {
    console.error("Failed to update application status:", error);
    return { error: "Unable to update application status. Please try again." };
  }
}

export async function convertApplicationToFaculty(id: string) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    if (role !== "SUPER_ADMIN" && role !== "ADMIN") {
      return { error: "Unauthorized access." };
    }

    const application = await prisma.jobApplication.findUnique({ where: { id } });
    if (!application) return { error: "Application not found." };
    
    if (application.status !== "ACCEPTED") {
      return { error: "Only ACCEPTED applications can be converted." };
    }

    if (application.convertedAt || application.convertedSpecialistId) {
      return { error: "This application has already been converted." };
    }

    // Attempt to extract years of experience from string
    const expMatch = application.experience.match(/\d+/);
    const expYears = expMatch ? parseInt(expMatch[0], 10) : 0;

    // Create User account (random password for now)
    const randomPassword = Math.random().toString(36).slice(-10) + "A1!";
    // Hash password (using simple hash for mock, ideally bcrypt)
    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const user = await prisma.user.create({
      data: {
        email: application.email,
        password: hashedPassword,
        name: application.name,
        role: "FACULTY",
      }
    });

    const specialist = await prisma.specialist.create({
      data: {
        name: application.name,
        email: application.email,
        designation: application.position || "Consultant",
        qualifications: application.qualifications,
        experience: expYears,
        languages: "English",
        bio: application.message || "New faculty member",
        category: application.category,
        consultationType: "In-Person",
        consultationFee: 1500, // Default
        advanceAmount: 500,
        isActive: true,
        imageUrl: application.photoUrl || null,
        userId: user.id
      }
    });

    await prisma.jobApplication.update({
      where: { id },
      data: {
        convertedAt: new Date(),
        convertedUserId: user.id,
        convertedSpecialistId: specialist.id
      }
    });

    revalidatePath("/admin/jobs");
    revalidatePath("/admin/specialists");

    return { success: true, specialistId: specialist.id, randomPassword };
  } catch (error: any) {
    console.error("Conversion failed:", error);
    // Handle unique constraint failure (e.g. email already exists)
    if (error.code === 'P2002') {
      return { error: "An account with this email already exists." };
    }
    return { error: "Failed to convert application." };
  }
}
