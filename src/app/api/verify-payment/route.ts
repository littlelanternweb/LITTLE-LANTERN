import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { appointmentId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = data;

    // Verify signature if we have the secret (Standard Razorpay Security)
    if (process.env.RAZORPAY_KEY_SECRET && razorpay_order_id && razorpay_signature) {
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    }

    // 1. Update Appointment Status
    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: "CONFIRMED" },
      include: { specialist: true, customer: true }
    });

    // 2. Create Payment Record
    await prisma.payment.upsert({
      where: { appointmentId },
      update: {
        razorpayPaymentId: razorpay_payment_id,
        status: "SUCCESS"
      },
      create: {
        appointmentId,
        razorpayOrderId: razorpay_order_id || `mock_order_${Date.now()}`,
        razorpayPaymentId: razorpay_payment_id,
        amount: appointment.specialist.consultationFee,
        status: "SUCCESS"
      }
    });

    // 3. Send Confirmation Email
    try {
      const { emailTemplates } = await import("@/lib/email");
      const dateStr = appointment.date.toLocaleDateString();
      await emailTemplates.bookingConfirmation(
        appointment.customer.email,
        appointment.customer.name,
        appointment.specialist.name,
        dateStr,
        appointment.startTime
      );
      
      // Also notify Admin
      await emailTemplates.adminNotification(
        "New Appointment Booked",
        `A new appointment has been confirmed for ${appointment.customer.name} with ${appointment.specialist.name} on ${dateStr} at ${appointment.startTime}.`
      );
    } catch (emailError) {
      console.error("Failed to send emails:", emailError);
      // We don't throw here because payment was successful
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Payment Verification Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
