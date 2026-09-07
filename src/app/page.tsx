import { HomeClient } from "@/components/home/HomeClient";
import { prisma } from "@/lib/db";

export const revalidate = 60; // ISR for homepage

export default async function Home() {
  // Fetch a few featured specialists for the homepage
  const specialists = await prisma.specialist.findMany({
    include: { services: true },
    take: 3,
  });

  return <HomeClient specialists={specialists} />;
}
