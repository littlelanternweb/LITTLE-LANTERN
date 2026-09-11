import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { emailTemplates } from "@/lib/email";

export async function GET() {
  try {
    // Check settings
    const [h24Setting, h2Setting, paymentReminderSetting] = await Promise.all([
      prisma.setting.findUnique({ where: { key: "email_24h_reminder" } }),
      prisma.setting.findUnique({ where: { key: "email_2h_reminder" } }),
      prisma.setting.findUnique({ where: { key: "email_payment_reminder" } }),
    ]);

    const is24hEnabled = h24Setting ? h24Setting.value === "true" : true;
    const is2hEnabled = h2Setting ? h2Setting.value === "true" : false;
    const isPaymentReminderEnabled = paymentReminderSetting ? paymentReminderSetting.value === "true" : true;

    if (!is24hEnabled && !is2hEnabled && !isPaymentReminderEnabled) {
      return NextResponse.json({ message: "Reminders disabled via settings." });
    }

    const now = new Date();
    
    // Appointment Reminder Windows
    const start24h = new Date(now.getTime() + 23 * 60 * 60 * 1000 + 45 * 60 * 1000); 
    const end24h = new Date(now.getTime() + 24 * 60 * 60 * 1000 + 15 * 60 * 1000);   
    const start2h = new Date(now.getTime() + 1 * 60 * 60 * 1000 + 45 * 60 * 1000);   
    const end2h = new Date(now.getTime() + 2 * 60 * 60 * 1000 + 15 * 60 * 1000);     

    // Payment Reminder Windows (broader since they are usually run daily)
    // 3 Days before
    const start3d = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    const end3d = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    // 1 Day before
    const start1d = new Date(now.getTime() + 0 * 24 * 60 * 60 * 1000);
    const end1d = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);
    // 0 Days before (Today)
    const start0d = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
    const end0d = new Date(now.getTime());

    // Find all upcoming confirmed appointments
    const upcoming = await prisma.appointment.findMany({
      where: {
        status: "CONFIRMED",
        date: { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) } // Include today
      },
      include: { customer: true, specialist: true, child: true }
    });

    let apptSentCount = 0;
    let paymentSentCount = 0;

    for (const appt of upcoming) {
      // Parse the appointment exact time
      const [hours, minutes] = appt.startTime.split(':').map(Number);
      const exactTime = new Date(appt.date);
      exactTime.setHours(hours, minutes, 0, 0);

      // --- APPOINTMENT REMINDERS ---
      if (is24hEnabled && exactTime >= start24h && exactTime <= end24h) {
        const existingLog = await prisma.emailLog.findFirst({
          where: { relatedId: appt.id, type: "REMINDER_24H" }
        });
        if (!existingLog) {
          await emailTemplates.reminderEmail(
            appt.customer.email,
            appt.customer.name,
            appt.child.name,
            appt.specialist.name,
            appt.date.toLocaleDateString(),
            appt.startTime,
            true,
            appt.id
          );
          apptSentCount++;
        }
      } else if (is2hEnabled && exactTime >= start2h && exactTime <= end2h) {
        const existingLog = await prisma.emailLog.findFirst({
          where: { relatedId: appt.id, type: "REMINDER_2H" }
        });
        if (!existingLog) {
          await emailTemplates.reminderEmail(
            appt.customer.email,
            appt.customer.name,
            appt.child.name,
            appt.specialist.name,
            appt.date.toLocaleDateString(),
            appt.startTime,
            false,
            appt.id
          );
          apptSentCount++;
        }
      }

      // --- PAYMENT REMINDERS ---
      if (isPaymentReminderEnabled && appt.paymentStatus !== "FULLY_PAID") {
        const totalPaid = appt.advancePaid + appt.balancePaid;
        const balance = appt.totalAmount - totalPaid;
        
        if (balance > 0) {
          let reminderPhase = 0;
          
          if (exactTime >= start3d && exactTime <= end3d) reminderPhase = 1; // 3 Days
          else if (exactTime >= start1d && exactTime <= end1d) reminderPhase = 2; // 1 Day
          else if (exactTime >= start0d && exactTime <= end0d) reminderPhase = 3; // Today
          
          if (reminderPhase > 0) {
            const { success, duplicate } = await emailTemplates.paymentDueReminder(
              appt.customer.email,
              appt.customer.name,
              appt.child.name,
              appt.specialist.name,
              appt.date.toLocaleDateString(),
              appt.startTime,
              appt.totalAmount,
              totalPaid,
              balance,
              appt.id,
              reminderPhase
            );
            if (success && !duplicate) paymentSentCount++;
          }
        }
      }
    }

    return NextResponse.json({ success: true, processed: upcoming.length, apptSentCount, paymentSentCount });
  } catch (error) {
    console.error("Cron Error:", error);
    return NextResponse.json({ error: "Failed to run cron." }, { status: 500 });
  }
}
