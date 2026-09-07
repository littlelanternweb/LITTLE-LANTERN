import { prisma } from "@/lib/db";
import { CareersClient } from "@/components/careers/CareersClient";

export const dynamic = "force-dynamic";

export default async function CareersPage() {
  const openings = await prisma.jobOpening.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
  });

  return <CareersClient initialOpenings={openings} />;
}
