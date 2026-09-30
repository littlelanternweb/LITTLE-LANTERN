"use server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function adminMarkSubscriptionPaid(specialistId: string, amount: number) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") throw new Error("Unauthorized");

  const specialist = await prisma.specialist.findUnique({ where: { id: specialistId } });
  if (!specialist) throw new Error("Not found");

  const nextBilling = new Date();
  nextBilling.setMonth(nextBilling.getMonth() + 1);

  await prisma.$transaction([
    prisma.specialist.update({
      where: { id: specialistId },
      data: {
        subscriptionStatus: "ACTIVE",
        isActive: true,
        nextBillingDate: nextBilling,
        subscriptionFee: amount
      }
    }),
    prisma.subscriptionLog.create({
      data: {
        specialistId,
        razorpayPaymentId: "CASH_MANUAL",
        amount,
        status: "SUCCESS"
      }
    })
  ]);

  revalidatePath("/admin/specialists");
  return { success: true };
}

export async function adminGrantFreeSubscription(specialistId: string) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") throw new Error("Unauthorized");

  // For free subscription, next billing date is far in future or null. Let's set it 10 years ahead.
  const nextBilling = new Date();
  nextBilling.setFullYear(nextBilling.getFullYear() + 10);

  await prisma.specialist.update({
    where: { id: specialistId },
    data: {
      subscriptionStatus: "ACTIVE",
      isActive: true,
      nextBillingDate: nextBilling,
      subscriptionFee: 0
    }
  });

  revalidatePath("/admin/specialists");
  return { success: true };
}
