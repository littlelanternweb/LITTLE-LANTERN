import { prisma } from "@/lib/db";
import { OpeningsClient } from "./page-client";

export const dynamic = "force-dynamic";

export default async function AdminOpeningsPage() {
  const openings = await prisma.jobOpening.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { applications: true },
      },
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-medium text-stone-900 tracking-tight">Job Openings</h1>
        <p className="text-stone-500 mt-2">Manage open positions and career opportunities.</p>
      </div>

      <OpeningsClient initialOpenings={openings} />
    </div>
  );
}
