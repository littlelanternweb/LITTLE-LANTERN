import { prisma } from "@/lib/db";
import { CustomersClient } from "./page-client";

export const dynamic = "force-dynamic";

export default async function AdminCustomers() {
  const customers = await prisma.customer.findMany({
    include: {
      children: true,
      _count: {
        select: { appointments: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const specialists = await prisma.specialist.findMany({
    where: { isActive: true },
    select: { id: true, name: true, services: true, consultationFee: true }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customers (Parents)</h1>
          <p className="text-sm text-slate-500 mt-1">Manage parent accounts, child profiles, and their appointments.</p>
        </div>
      </div>

      <CustomersClient initialCustomers={customers} specialists={specialists} />
    </div>
  );
}
