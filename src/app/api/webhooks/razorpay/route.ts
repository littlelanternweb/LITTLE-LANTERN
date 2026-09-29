import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return new NextResponse("Missing signature", { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET || "")
      .update(bodyText)
      .digest("hex");

    if (expectedSignature !== signature) {
      return new NextResponse("Invalid signature", { status: 400 });
    }

    const event = JSON.parse(bodyText);

    if (event.event === "subscription.charged") {
      const subscriptionId = event.payload.subscription.entity.id;
      const paymentId = event.payload.payment.entity.id;
      const amount = event.payload.payment.entity.amount / 100;

      const specialist = await prisma.specialist.findUnique({
        where: { subscriptionId }
      });

      if (specialist) {
        await prisma.specialist.update({
          where: { id: specialist.id },
          data: {
            subscriptionStatus: "ACTIVE",
            isActive: true, // Activate the account when subscription is paid
            nextBillingDate: new Date(event.payload.subscription.entity.current_end * 1000)
          }
        });

        await prisma.subscriptionLog.create({
          data: {
            specialistId: specialist.id,
            razorpayPaymentId: paymentId,
            amount: amount,
            status: "SUCCESS"
          }
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
