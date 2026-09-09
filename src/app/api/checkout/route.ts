import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/lib/db";
import { addMinutes } from "date-fns";

const razorpay = process.env.RAZORPAY_KEY_ID ? new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
}) : null;

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { 
      specialistId, date, startTime, 
      parentName, email, phone, relationship,
      childName, childAge, childGender, reason, additionalInfo 
    } = data;

    // 1. Double-check availability & duplicate booking
    const existingAppointment = await prisma.appointment.findFirst({
      where: { specialistId, date: new Date(date), startTime, status: { not: "CANCELLED" } }
    });

    if (existingAppointment) {
      return NextResponse.json({ error: "Slot already booked" }, { status: 400 });
    }

    const existingHold = await prisma.slotHold.findFirst({
      where: { specialistId, date: new Date(date), startTime, expiresAt: { gt: new Date() } }
    });

    if (existingHold) {
      return NextResponse.json({ error: "Slot is currently being held by someone else" }, { status: 400 });
    }

    // 2. Get specialist fee
    const specialist = await prisma.specialist.findUnique({ where: { id: specialistId } });
    if (!specialist) {
      return NextResponse.json({ error: "Specialist not found" }, { status: 404 });
    }

    // 3. Create or Update Customer
    const customer = await prisma.customer.upsert({
      where: { email },
      update: { name: parentName, phone },
      create: { name: parentName, email, phone }
    });

    // 4. Create Child
    const child = await prisma.child.create({
      data: {
        customerId: customer.id,
        name: childName,
        age: parseInt(childAge, 10) || null,
        gender: childGender,
        relationship,
      }
    });

    // 5. Create Slot Hold (10 minutes)
    const hold = await prisma.slotHold.create({
      data: {
        specialistId,
        date: new Date(date),
        startTime,
        expiresAt: addMinutes(new Date(), 10)
      }
    });

    // We can also create a pending appointment immediately, linked to the hold, 
    // but typically we'll do it on success verification. Let's create it as PENDING.
    const appointment = await prisma.appointment.create({
      data: {
        specialistId,
        customerId: customer.id,
        childId: child.id,
        date: new Date(date),
        startTime,
        endTime: addMinutes(new Date(`1970-01-01T${startTime}:00`), 60).toTimeString().substring(0,5),
        status: "PENDING",
        reason,
        additionalInfo,
      }
    });

    // Calculate advance amount based on specialist's configured advance amount
    const advanceAmount = Math.round(specialist.advanceAmount ?? (specialist.consultationFee * 0.25));

    // 6. Create Razorpay order (if keys exist)
    if (razorpay) {
      const order = await razorpay.orders.create({
        amount: advanceAmount * 100, // in paise
        currency: "INR",
        receipt: appointment.id
      });

      return NextResponse.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        appointmentId: appointment.id
      });
    } else {
      // Mock flow if no keys (for local development)
      return NextResponse.json({
        orderId: `mock_order_${Date.now()}`,
        amount: advanceAmount * 100,
        currency: "INR",
        appointmentId: appointment.id,
        mock: true
      });
    }

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
