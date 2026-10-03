import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

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

    const specialist = await prisma.specialist.findUnique({ where: { id } });

    await prisma.$transaction(async (tx) => {
      const apps = await tx.appointment.findMany({ where: { specialistId: id }, select: { id: true } });
      const appIds = apps.map(a => a.id);
      
      if (appIds.length > 0) {
        await tx.payment.deleteMany({ where: { appointmentId: { in: appIds } } });
        await tx.transaction.deleteMany({ where: { appointmentId: { in: appIds } } });
        await tx.invoice.deleteMany({ where: { appointmentId: { in: appIds } } });
      }

      await tx.appointment.deleteMany({ where: { specialistId: id } });
      await tx.availability.deleteMany({ where: { specialistId: id } });
      await tx.lockedSlot.deleteMany({ where: { specialistId: id } });
      await tx.slotHold.deleteMany({ where: { specialistId: id } });
      await tx.subscriptionLog.deleteMany({ where: { specialistId: id } });

      await tx.jobApplication.updateMany({
        where: { convertedSpecialistId: id },
        data: { convertedSpecialistId: null }
      });

      await tx.specialist.delete({ where: { id } });

      if (specialist?.userId) {
        await tx.user.deleteMany({ where: { id: specialist.userId } });
      }
    });

    revalidatePath("/admin/specialists");
    revalidatePath("/specialists");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[SPECIALIST_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
