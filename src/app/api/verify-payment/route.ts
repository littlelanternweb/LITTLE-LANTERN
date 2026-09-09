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

    // 1. Fetch initial appointment to get specialist details
    const initialAppointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { specialist: true }
    });
    
    if (!initialAppointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }
    
    const advanceAmountPaid = Math.round(initialAppointment.specialist.advanceAmount ?? (initialAppointment.specialist.consultationFee * 0.25));

    // 2. Update Appointment Status and Payment Fields
    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { 
        status: "CONFIRMED",
        totalAmount: initialAppointment.specialist.consultationFee,
        advanceAmount: advanceAmountPaid,
        advancePaid: advanceAmountPaid,
        balancePaid: 0,
        paymentStatus: advanceAmountPaid >= initialAppointment.specialist.consultationFee ? "FULLY_PAID" : "ADVANCE_PAID"
      },
      include: { specialist: true, customer: true }
    });

    // 3. Create Payment Record (Legacy support)
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
        amount: advanceAmountPaid,
        status: "SUCCESS"
      }
    });
    
    // 4. Create Transaction Record
    await prisma.transaction.create({
      data: {
        appointmentId,
        amount: advanceAmountPaid,
        type: "ADVANCE",
        method: "RAZORPAY",
        status: "SUCCESS",
        reference: razorpay_payment_id || razorpay_order_id || "mock_payment",
        notes: "Online Advance Payment"
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
