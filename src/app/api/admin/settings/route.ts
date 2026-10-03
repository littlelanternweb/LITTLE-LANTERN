import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function POST(request: Request) {
  try {
    const { key, value } = await request.json();
    
    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });

    // If the setting is a subscription fee, update existing active specialists
    if (key.startsWith("fee_")) {
      const category = key.replace("fee_", "");
      const newAmount = parseInt(value, 10);

      const specialists = await prisma.specialist.findMany({
        where: {
          designation: category,
          subscriptionStatus: "ACTIVE"
        }
      });

      for (const spec of specialists) {
        try {
          if (spec.subscriptionId && spec.subscriptionPlanId && spec.subscriptionPlanId.startsWith("plan_")) {
            // Create a new plan with the updated amount
            const plan = await razorpay.plans.create({
              period: "monthly",
              interval: 1,
              item: {
                name: `Faculty Subscription - ${spec.category}`,
                amount: newAmount * 100, // in paise
                currency: "INR",
              }
            });

            // Update the subscription in Razorpay to use the new plan
            await razorpay.subscriptions.update(spec.subscriptionId, {
              plan_id: plan.id
            });

            // Update local DB
            await prisma.specialist.update({
              where: { id: spec.id },
              data: { 
                subscriptionPlanId: plan.id,
                subscriptionFee: newAmount 
              }
            });
          } else {
            // For manual cash/free subscriptions, just update the fee in DB
            await prisma.specialist.update({
              where: { id: spec.id },
              data: { subscriptionFee: newAmount }
            });
          }
        } catch (subErr) {
          console.error(`Failed to update subscription for specialist ${spec.id}:`, subErr);
          // We continue to next specialist instead of failing the whole request
        }
      }
    }

    return NextResponse.json({ success: true, setting });
  } catch (error) {
    console.error("Failed to save setting:", error);
    return NextResponse.json({ error: "Failed to save setting." }, { status: 500 });
  }
}
