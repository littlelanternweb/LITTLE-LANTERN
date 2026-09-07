import { prisma } from "@/lib/db";
import { JobsClient } from "./page-client";

export const dynamic = "force-dynamic";

export default async function AdminJobsPage() {
  const applications = await prisma.jobApplication.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      jobOpening: true,
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-medium text-stone-900 tracking-tight">Job Applications</h1>
        <p className="text-stone-500 mt-2">Review and manage candidates who have applied to join your team.</p>
      </div>

      <JobsClient initialApplications={applications} />
    </div>
  );
}
