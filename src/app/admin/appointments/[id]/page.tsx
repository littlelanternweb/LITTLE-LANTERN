import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { AppointmentDetailClient } from "./AppointmentDetailClient";

export const dynamic = "force-dynamic";

export default async function AppointmentDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");
  
  const id = await params.id;

  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: {
      customer: true,
      child: true,
      specialist: true,
      transactions: {
        orderBy: { date: 'desc' }
      }
    }
  });

  if (!appointment) {
    return <div className="p-10 text-center">Appointment not found.</div>;
  }

  // Fetch specialists for reassignment
  const specialists = await prisma.specialist.findMany({
    where: { isActive: true },
    select: { id: true, name: true, category: true }
  });

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <AppointmentDetailClient 
        appointment={appointment} 
        specialists={specialists} 
        isAdmin={session.user?.role !== "FACULTY"} 
      />
    </div>
  );
}
