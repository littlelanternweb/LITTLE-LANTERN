import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const opening = await prisma.jobOpening.create({
      data: {
        title: data.title,
        department: data.department,
        location: data.location,
        experience: data.experience,
        type: data.type,
        description: data.description,
        requirements: data.requirements,
      }
    });
    return NextResponse.json(opening);
  } catch (error) {
    console.error('Failed to create opening:', error);
    return NextResponse.json({ error: 'Failed to create opening' }, { status: 500 });
  }
}
