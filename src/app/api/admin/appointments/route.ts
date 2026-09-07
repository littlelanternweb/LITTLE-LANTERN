import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Convert date and time
    const appointmentDate = new Date(body.date);
    
    // Create Appointment (Admin side bypasses payment for now)
    const appointment = await prisma.appointment.create({
      data: {
        customerId: body.customerId,
        childId: body.childId,
        specialistId: body.specialistId,
        date: appointmentDate,
        startTime: body.time,
        endTime: body.time, // For simplicity, though usually +1 hour
        reason: body.reason,
        status: "CONFIRMED", // Admin booked means confirmed
      },
      include: { customer: true, specialist: true }
    });

    // Send Confirmation Email
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
    } catch (emailError) {
      console.error("Failed to send emails:", emailError);
    }

    return NextResponse.json(appointment);
  } catch (error: any) {
    console.error("Failed to book appointment:", error);
    return NextResponse.json(
      { error: "Failed to book appointment." },
      { status: 500 }
    );
  }
}
