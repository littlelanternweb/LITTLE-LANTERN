import { prisma } from "@/lib/db";
import { FeeSettingsClient } from "./page-client";

export const dynamic = "force-dynamic";

export default async function AdminFeeSettingsPage() {
  const settings = await prisma.setting.findMany({
    where: {
      key: {
        startsWith: "fee_",
      },
    },
  });

  // Convert settings array to object
  const settingsObj = settings.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {} as Record<string, string>);

  const categories = [
    "Psychologist",
    "Special Educator",
    "Remedial Teacher"
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-medium text-stone-900 tracking-tight">Subscription Fees</h1>
        <p className="text-stone-500 mt-2">Manage default subscription fees by faculty category.</p>
      </div>
      <FeeSettingsClient initialSettings={settingsObj} categories={categories} />
    </div>
  );
}
