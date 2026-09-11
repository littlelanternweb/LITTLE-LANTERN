import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { CustomerDetailClient } from "./CustomerDetailClient";

export const metadata = {
  title: "Customer Details | Little Lantern Admin",
};

export default async function CustomerDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || !hasPermission(session.user?.role, PERMISSIONS.CUSTOMERS_VIEW)) {
    redirect("/admin");
  }

  const customer = await prisma.customer.findUnique({
    where: { id: params.id },
    include: {
      children: true,
      notes: {
        orderBy: { createdAt: "desc" }
      },
      invoices: {
        orderBy: { createdAt: "desc" }
      },
      appointments: {
        orderBy: { date: "desc" },
        include: {
          specialist: true,
          child: true,
          transactions: {
            orderBy: { date: "desc" }
          }
        }
      }
    }
  });

  if (!customer) {
    redirect("/admin/customers");
  }

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <CustomerDetailClient customer={customer} />
    </div>
  );
}
