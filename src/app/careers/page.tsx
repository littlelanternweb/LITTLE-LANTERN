import { prisma } from "@/lib/db";
import { CareersClient } from "@/components/careers/CareersClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Become Our Faculty | Little Lantern",
  description: "Join our multidisciplinary team of professionals at Little Lantern.",
};

export default async function CareersPage() {
  const openings = await prisma.jobOpening.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
  });

  return <CareersClient initialOpenings={openings} />;
}
