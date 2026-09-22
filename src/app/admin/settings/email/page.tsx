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
    email_payment_confirmation: true,
    email_payment_reminder: true,
    email_application_approval: true,
    email_application_declined: true,
    email_faculty_conversion: true,
    email_faculty_welcome: true,
    email_faculty_assignment: true,
  };

  const finalSettings = { ...defaults, ...settingsObj };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-medium text-stone-900 tracking-tight">System Settings</h1>
        <p className="text-stone-500 mt-2">Manage automated triggers, system configurations, and technical support.</p>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
        <h2 className="text-lg font-semibold text-slate-900 mb-2">Technical Support & Maintenance</h2>
        <p className="text-sm text-slate-600 mb-5">
          For website service, feature updates, and technical maintenance, please contact our technology partner.
        </p>
        <div className="flex flex-col sm:flex-row gap-8">
          <div>
            <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1">Partner</p>
            <a href="https://technexttechnologies.in" target="_blank" rel="noopener noreferrer" className="text-[15px] font-semibold text-primary hover:underline">TECHNEXT TECHNOLOGIES</a>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1">Support Contact</p>
            <a href="tel:+919496590984" className="text-[15px] font-semibold text-slate-900 hover:text-primary transition-colors">+91 94965 90984</a>
          </div>
        </div>
      </div>

      <EmailSettingsClient initialSettings={finalSettings} logs={logs} />
    </div>
  );
}
