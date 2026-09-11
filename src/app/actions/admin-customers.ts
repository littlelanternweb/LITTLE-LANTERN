"use server";

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ROLES, hasPermission, PERMISSIONS } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

export async function addCustomerNote(customerId: string, noteText: string) {
  const session = await getServerSession(authOptions);
  if (!session || !hasPermission(session.user?.role, PERMISSIONS.CUSTOMERS_VIEW)) {
    throw new Error("Unauthorized");
  }

  await prisma.customerNote.create({
    data: {
      customerId,
      authorId: session.user.id,
      authorName: session.user.name,
      note: noteText,
    }
  });

  revalidatePath(`/admin/customers/${customerId}`);
  return { success: true };
}

export async function deleteCustomerNote(noteId: string, customerId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !hasPermission(session.user?.role, PERMISSIONS.CUSTOMERS_VIEW)) {
    throw new Error("Unauthorized");
  }

  await prisma.customerNote.delete({
    where: { id: noteId }
  });

  revalidatePath(`/admin/customers/${customerId}`);
  return { success: true };
}

export async function updateCustomerNote(noteId: string, customerId: string, noteText: string) {
  const session = await getServerSession(authOptions);
  if (!session || !hasPermission(session.user?.role, PERMISSIONS.CUSTOMERS_VIEW)) {
    throw new Error("Unauthorized");
  }

  await prisma.customerNote.update({
    where: { id: noteId },
    data: { note: noteText }
  });

  revalidatePath(`/admin/customers/${customerId}`);
  return { success: true };
}
