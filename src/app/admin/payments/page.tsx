import { prisma } from "@/lib/db";
import { startOfDay, endOfDay } from "date-fns";
import { PaymentsClient } from "./PaymentsClient";

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage(props: { searchParams: Promise<{ filter?: string, date?: string, view?: string }> }) {
  const searchParams = await props.searchParams;
  const filter = searchParams?.filter || "";
  const dateFilter = searchParams?.date;

  // 1. Fetch All Transactions
  let tQuery: any = { status: "SUCCESS" };
  if (dateFilter) {
    tQuery.date = { gte: startOfDay(new Date(dateFilter)), lte: endOfDay(new Date(dateFilter)) };
  }
  const transactions = await prisma.transaction.findMany({
    where: tQuery,
    orderBy: { date: "desc" },
    include: {
      appointment: {
        include: { customer: true, child: true, specialist: true }
      }
    }
  });

  // 2. Fetch All Appointments
  let aQuery: any = { status: { not: "CANCELLED" } };
  if (filter === "pending") {
    aQuery.paymentStatus = { in: ["PENDING", "ADVANCE_PAID", "PARTIALLY_PAID"] };
  }
  if (dateFilter) {
    aQuery.date = { gte: startOfDay(new Date(dateFilter)), lte: endOfDay(new Date(dateFilter)) };
  }
  const appointments = await prisma.appointment.findMany({
    where: aQuery,
    orderBy: { date: "desc" },
    include: {
      customer: true,
      child: true,
      specialist: true,
      transactions: true
    },
  });

  return (
    <PaymentsClient 
      initialAppointments={appointments} 
      initialTransactions={transactions} 
      initialFilter={filter}
    />
  );
}
