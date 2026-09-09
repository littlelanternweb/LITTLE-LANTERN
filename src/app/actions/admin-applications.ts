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
