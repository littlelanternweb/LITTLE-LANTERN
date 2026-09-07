import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    const opening = await prisma.jobOpening.update({
      where: { id: params.id },
      data: { isPublished: data.isPublished }
    });
    return NextResponse.json(opening);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update opening' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.jobOpening.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete opening' }, { status: 500 });
  }
}
