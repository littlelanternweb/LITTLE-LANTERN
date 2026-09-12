import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = params;

    // Get all appointments for this customer to delete their associated records
    const apps = await prisma.appointment.findMany({ where: { customerId: id }, select: { id: true } });
    const appIds = apps.map(a => a.id);

    await prisma.$transaction([
      prisma.payment.deleteMany({ where: { appointmentId: { in: appIds } } }),
      prisma.transaction.deleteMany({ where: { appointmentId: { in: appIds } } }),
      prisma.invoice.deleteMany({ where: { appointmentId: { in: appIds } } }),
      prisma.child.deleteMany({ where: { customerId: id } }),
      prisma.appointment.deleteMany({ where: { customerId: id } }),
      prisma.customerNote.deleteMany({ where: { customerId: id } }),
      prisma.customer.delete({ where: { id } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[CUSTOMER_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
