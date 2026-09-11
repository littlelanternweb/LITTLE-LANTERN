import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import InvoiceClient from "./InvoiceClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function InvoicePage({ params }: { params: Promise<{ token: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/admin/login");
  }

  const { token } = await params;
  
  const invoice = await prisma.invoice.findUnique({
    where: { token },
    include: {
      appointment: {
        include: {
          customer: true,
          child: true,
          specialist: true,
          transactions: {
            orderBy: { date: 'asc' }
          }
        }
      }
    }
  });

  if (!invoice) return notFound();

  return <InvoiceClient invoice={invoice} />;
}
