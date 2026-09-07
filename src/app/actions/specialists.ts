"use server";

import { prisma } from "@/lib/db";

export async function getSpecialists(searchParams?: { service?: string; q?: string }) {
  const where: any = { isActive: true };

  if (searchParams?.service) {
    where.services = {
      some: { slug: searchParams.service }
    };
  }

  if (searchParams?.q) {
    where.name = { contains: searchParams.q };
  }

  return await prisma.specialist.findMany({
    where,
    include: {
      services: true,
    },
    orderBy: { name: 'asc' }
  });
}

export async function getSpecialistById(id: string) {
  return await prisma.specialist.findUnique({
    where: { id, isActive: true },
    include: {
      services: true,
      availability: true,
    }
  });
}
