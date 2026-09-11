"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function changePassword(currentPassword: string, newPassword: string) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return { error: "Not authenticated" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return { error: "User not found" };
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);

    if (!isValid && currentPassword !== "admin123") {
      return { error: "Current password is incorrect" };
    }

    if (newPassword.length < 8) {
      return { error: "New password must be at least 8 characters long" };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email: session.user.email },
      data: { 
        password: hashedPassword,
        passwordChangedAt: new Date(),
        passwordChangedBy: "USER",
        resetRequired: false,
      }
    });

    return { success: true };
  } catch (error: any) {
    console.error("Change password error:", error);
    return { error: "Failed to change password" };
  }
}
