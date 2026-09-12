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

    await prisma.$transaction([
      prisma.appointment.deleteMany({ where: { specialistId: id } }),
      prisma.availability.deleteMany({ where: { specialistId: id } }),
      prisma.lockedSlot.deleteMany({ where: { specialistId: id } }),
      prisma.slotHold.deleteMany({ where: { specialistId: id } }),
      prisma.specialist.delete({ where: { id } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[SPECIALIST_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
