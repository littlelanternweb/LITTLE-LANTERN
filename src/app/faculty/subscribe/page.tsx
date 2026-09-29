import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SubscribeClient } from "./page-client";

export const dynamic = "force-dynamic";

export default async function FacultySubscribePage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "FACULTY") {
    redirect("/admin/login");
  }

  const specialist = await prisma.specialist.findUnique({
    where: { userId: session.user.id }
  });

  if (!specialist) {
    redirect("/admin/login");
  }

  if (specialist.subscriptionStatus === "ACTIVE" && specialist.isActive) {
    redirect("/faculty/dashboard");
  }

  const settingKey = `fee_${specialist.category}`;
  const setting = await prisma.setting.findUnique({
    where: { key: settingKey }
  });

  const amount = setting ? parseInt(setting.value, 10) : 1500;

  return (
    <div className="max-w-xl mx-auto mt-10">
      <SubscribeClient 
        specialistName={specialist.name} 
        category={specialist.category} 
        fee={amount} 
        razorpayKey={process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || ""}
      />
    </div>
  );
}
