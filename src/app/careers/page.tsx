import { prisma } from "@/lib/db";
import { CareersClient } from "@/components/careers/CareersClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Become Our Faculty | Little Lantern Careers in Kerala",
  description: "Join Little Lantern in Wandoor, Kerala as a Psychologist, Special Educator, or Teacher. Apply now to be part of our multidisciplinary team.",
  keywords: ["Careers Little Lantern", "Psychologist Jobs Kerala", "Special Educator Jobs Wandoor", "Teaching Jobs Kerala"],
};

export default async function CareersPage() {
  const openings = await prisma.jobOpening.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
  });

  return <CareersClient initialOpenings={openings} />;
}
