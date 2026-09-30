import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "FACULTY") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const specialist = await prisma.specialist.findUnique({
      where: { userId: (session.user as any).id }
    });

    if (!specialist) {
      return new NextResponse("Specialist not found", { status: 404 });
    }

    // Fetch the fee for the specialist's category
    const settingKey = `fee_${specialist.category}`;
    const setting = await prisma.setting.findUnique({
      where: { key: settingKey }
    });

    const amount = setting ? parseInt(setting.value, 10) : 1500; // Default 1500

    // Create Razorpay Plan on the fly or just create an order if we don't strictly need recurring setup
    // Since plan says "Subscription creation", let's create a plan then a subscription
    const plan = await razorpay.plans.create({
      period: "monthly",
      interval: 1,
      item: {
        name: `Faculty Subscription - ${specialist.category}`,
        amount: amount * 100, // in paise
        currency: "INR",
      }
    });

    const subscription = await razorpay.subscriptions.create({
      plan_id: plan.id,
      customer_notify: 1,
      total_count: 120, // 10 years
    });

    await prisma.specialist.update({
      where: { id: specialist.id },
      data: {
        subscriptionPlanId: plan.id,
        subscriptionId: subscription.id,
        subscriptionFee: amount
      }
    });

    return NextResponse.json({ subscriptionId: subscription.id });
  } catch (error) {
    console.error("Subscription create error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
