"use server";

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ROLES, hasPermission, PERMISSIONS } from "@/lib/permissions";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function getUsers() {
  const session = await getServerSession(authOptions);
  if (!session || !hasPermission(session.user?.role, PERMISSIONS.ADMIN_USERS_MANAGE)) {
    throw new Error("Unauthorized");
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      passwordChangedAt: true,
      passwordChangedBy: true,
      resetRequired: true,
      specialist: {
        select: {
          category: true,
          status: true,
        }
      }
    },
    orderBy: { createdAt: "desc" },
  });

  return users;
}

export async function resetUserPassword(userId: string, newPasswordStr: string) {
  const session = await getServerSession(authOptions);
  
  // Only SUPER_ADMIN can change passwords of other users
  if (!session || session.user?.role !== ROLES.SUPER_ADMIN) {
    throw new Error("Unauthorized: Only Super Admin can change passwords.");
  }

  if (newPasswordStr.length < 8) {
    throw new Error("Password must be at least 8 characters long.");
  }

  const hashedPassword = await bcrypt.hash(newPasswordStr, 12);

  await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
      passwordChangedAt: new Date(),
      passwordChangedBy: "SUPER_ADMIN",
      resetRequired: false,
    },
  });

  // Log the activity
  await prisma.activityLog.create({
    data: {
      userId: session.user.id,
      action: "USER_PASSWORD_CHANGED",
      entity: "User",
      entityId: userId,
      details: "Password reset by Super Admin",
    }
  });

  revalidatePath("/admin/users");
  return { success: true };
}
