import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ReportsClient } from "./ReportsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Reports | Admin",
};

export default async function ReportsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) redirect("/admin/login");
  
  // Security check: Only SUPER_ADMIN and ADMIN can access reports
  const role = (session.user as any).role;
  if (role !== "SUPER_ADMIN" && role !== "ADMIN") {
    redirect("/admin"); // Redirect Faculty away from financial reports
  }

  // Fetch base data needed for all reports
  // We fetch a wide array of data. In a real massive enterprise app, 
  // we would paginate or use API routes to fetch asynchronously, 
  // but for the scope of this dashboard, loading the active recent window is acceptable.

  const [appointments, transactions, specialists] = await Promise.all([
    prisma.appointment.findMany({
      orderBy: { date: 'desc' },
      include: {
        customer: true,
        child: true,
        specialist: true,
      }
    }),
    prisma.transaction.findMany({
      orderBy: { date: 'desc' },
      include: {
        appointment: {
          include: {
            customer: true,
            child: true,
            specialist: true,
            invoice: true,
          }
        }
      }
    }),
    prisma.specialist.findMany({
      orderBy: { name: 'asc' }
    })
  ]);

  return (
    <ReportsClient 
      initialAppointments={appointments}
      initialTransactions={transactions}
      specialists={specialists}
    />
  );
}
