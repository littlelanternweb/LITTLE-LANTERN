import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/lib/db";
import { addMinutes } from "date-fns";

let RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
let RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

// Use provided valid test keys if old invalid keys are found or if missing
if (!RAZORPAY_KEY_ID || RAZORPAY_KEY_ID === "rzp_test_TanKDNTqT7aYnp") {
  RAZORPAY_KEY_ID = "rzp_test_TcoUXh5qbfpKr0";
  RAZORPAY_KEY_SECRET = "nqCZ32NRKPYKBwPteRc1CCKB";
}

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

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
      where: { specialistId, date: new Date(date), startTime, status: { in: ["CONFIRMED", "COMPLETED"] } }
    });

    if (existingAppointment) {
      return NextResponse.json({ error: "Slot already booked" }, { status: 400 });
    }

    const existingHold = await prisma.slotHold.findFirst({
      where: { specialistId, date: new Date(date), startTime, expiresAt: { gt: new Date() } }
    });

    if (existingHold) {
      // Allow retry if this exact user already holds a PENDING appointment for this slot
      const myPending = await prisma.appointment.findFirst({
        where: { specialistId, date: new Date(date), startTime, status: "PENDING", customer: { email } }
      });
      if (!myPending) {
        return NextResponse.json({ error: "Slot is currently being held by someone else" }, { status: 400 });
      }
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

    // 5. Create or Update Slot Hold (10 minutes)
    const hold = await prisma.slotHold.upsert({
      where: {
        specialistId_date_startTime: { specialistId, date: new Date(date), startTime }
      },
      update: {
        expiresAt: addMinutes(new Date(), 10)
      },
      create: {
        specialistId,
        date: new Date(date),
        startTime,
        expiresAt: addMinutes(new Date(), 10)
      }
    });

    // We can also create a pending appointment immediately, linked to the hold.
    // If it already exists for this user, we reuse it.
    let appointment = await prisma.appointment.findFirst({
      where: { specialistId, date: new Date(date), startTime, status: "PENDING", customerId: customer.id }
    });

    if (!appointment) {
      appointment = await prisma.appointment.create({
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
    }

    // Use the actual advance amount set by admin for the specialist
    const advanceAmount = specialist.advanceAmount || Math.round(specialist.consultationFee * 0.25);

    // 6. Create Razorpay order (if keys exist)
    if (razorpay) {
      try {
        const order = await razorpay.orders.create({
          amount: Math.round(advanceAmount * 100), // strictly integer paise
          currency: "INR",
          receipt: appointment.id
        });

        return NextResponse.json({
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          appointmentId: appointment.id
        });
      } catch (rzpError: any) {
        console.error("Razorpay Error:", rzpError);
        
        // If they are using a test key that is invalid, fallback to mock flow so they can still test booking
        if (process.env.RAZORPAY_KEY_ID?.startsWith("rzp_test_")) {
          console.log("Test key invalid, falling back to mock flow");
          return NextResponse.json({
            orderId: `mock_order_${Date.now()}`,
            amount: Math.round(advanceAmount * 100),
            currency: "INR",
            appointmentId: appointment.id,
            mock: true
          });
        }

        return NextResponse.json({ 
          error: "Payment gateway error: " + (rzpError.error?.description || rzpError.message || "Failed to initialize payment") 
        }, { status: 400 });
      }
    } else {
      // Mock flow if no keys (for local development)
      return NextResponse.json({
        orderId: `mock_order_${Date.now()}`,
        amount: Math.round(advanceAmount * 100),
        currency: "INR",
        appointmentId: appointment.id,
        mock: true
      });
    }

  } catch (error: any) {
    console.error("CHECKOUT_ERROR:", error.stack || error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
