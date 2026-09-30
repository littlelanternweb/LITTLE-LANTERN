const fs = require('fs');
let cronContent = fs.readFileSync('src/app/api/cron/reminders/route.ts', 'utf-8');

const subscriptionLogic = `
    // --- FACULTY SUBSCRIPTION REMINDERS ---
    let subSentCount = 0;
    const facultyToRemind = await prisma.specialist.findMany({
      where: {
        OR: [
          { subscriptionStatus: "PAST_DUE" },
          { nextBillingDate: { gte: start3d, lte: end3d } }, // 3 days before renewal
        ],
        email: { not: null }
      }
    });

    for (const faculty of facultyToRemind) {
      const isPastDue = faculty.subscriptionStatus === "PAST_DUE";
      const logType = isPastDue ? "SUB_REMINDER_PAST_DUE" : "SUB_REMINDER_UPCOMING";
      
      const existingLog = await prisma.emailLog.findFirst({
        where: { relatedId: faculty.id, type: logType, createdAt: { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) } } // Only 1 per day
      });

      if (!existingLog && faculty.email) {
        await emailTemplates.facultySubscriptionReminder(
          faculty.email,
          faculty.name,
          faculty.subscriptionFee || 0,
          faculty.nextBillingDate ? faculty.nextBillingDate.toLocaleDateString() : 'N/A',
          isPastDue
        );
        subSentCount++;
      }
    }

    return NextResponse.json({ success: true, processed: upcoming.length, apptSentCount, paymentSentCount, subSentCount });
`;

cronContent = cronContent.replace(/return NextResponse\.json\(\{ success: true, processed: upcoming\.length, apptSentCount, paymentSentCount \}\);/, subscriptionLogic);
fs.writeFileSync('src/app/api/cron/reminders/route.ts', cronContent);
console.log('Appended subscription cron logic');
