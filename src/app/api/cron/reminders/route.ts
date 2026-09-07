import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { emailTemplates } from "@/lib/email";

export async function GET() {
  try {
    // Check settings
    const [h24Setting, h2Setting] = await Promise.all([
      prisma.setting.findUnique({ where: { key: "email_24h_reminder" } }),
      prisma.setting.findUnique({ where: { key: "email_2h_reminder" } }),
    ]);

    const is24hEnabled = h24Setting ? h24Setting.value === "true" : true;
    const is2hEnabled = h2Setting ? h2Setting.value === "true" : false;

    if (!is24hEnabled && !is2hEnabled) {
      return NextResponse.json({ message: "Reminders disabled via settings." });
    }

    const now = new Date();
    
    // 24 Hours from now (window of 15 mins)
    const start24h = new Date(now.getTime() + 23 * 60 * 60 * 1000 + 45 * 60 * 1000); // 23:45 ahead
    const end24h = new Date(now.getTime() + 24 * 60 * 60 * 1000 + 15 * 60 * 1000);   // 24:15 ahead

    // 2 Hours from now (window of 15 mins)
    const start2h = new Date(now.getTime() + 1 * 60 * 60 * 1000 + 45 * 60 * 1000);   // 1:45 ahead
    const end2h = new Date(now.getTime() + 2 * 60 * 60 * 1000 + 15 * 60 * 1000);     // 2:15 ahead

    // Find all upcoming confirmed appointments
    const upcoming = await prisma.appointment.findMany({
      where: {
        status: "CONFIRMED",
        date: { gte: now } // Simple filter to reduce payload
      },
      include: { customer: true, specialist: true, child: true }
    });

    let sentCount = 0;

    for (const appt of upcoming) {
      // Parse the appointment exact time
      const [hours, minutes] = appt.startTime.split(':').map(Number);
      const exactTime = new Date(appt.date);
      exactTime.setHours(hours, minutes, 0, 0);

      // Check if it falls into the 24h window
      if (is24hEnabled && exactTime >= start24h && exactTime <= end24h) {
        // Send 24h reminder
        // Check if we already sent it
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
          sentCount++;
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
          sentCount++;
        }
      }
    }

    return NextResponse.json({ success: true, processed: upcoming.length, sentCount });
  } catch (error) {
    console.error("Cron Error:", error);
    return NextResponse.json({ error: "Failed to run cron." }, { status: 500 });
  }
}
