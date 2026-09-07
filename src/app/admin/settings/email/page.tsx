import { prisma } from "@/lib/db";
import { EmailSettingsClient } from "./page-client";

export const dynamic = "force-dynamic";

export default async function AdminEmailSettingsPage() {
  const settings = await prisma.setting.findMany();
  const logs = await prisma.emailLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  // Convert settings array to object
  const settingsObj = settings.reduce((acc, s) => {
    acc[s.key] = s.value === "true";
    return acc;
  }, {} as Record<string, boolean>);

  // Default values if not in DB
  const defaults = {
    email_booking_confirmation: true,
    email_application_confirmation: true,
    email_admin_notification: true,
    email_cancellation: true,
    email_reschedule: true,
    email_24h_reminder: true,
    email_2h_reminder: false,
  };

  const finalSettings = { ...defaults, ...settingsObj };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-medium text-stone-900 tracking-tight">Email Automation</h1>
        <p className="text-stone-500 mt-2">Manage automated email triggers and view sending logs.</p>
      </div>

      <EmailSettingsClient initialSettings={finalSettings} logs={logs} />
    </div>
  );
}
