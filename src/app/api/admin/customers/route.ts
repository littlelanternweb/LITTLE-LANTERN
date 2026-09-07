import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Create customer and child
    const customer = await prisma.customer.create({
      data: {
        name: body.parentName,
        email: body.email,
        phone: body.phone,
        children: {
          create: {
            name: body.childName,
            age: parseInt(body.age),
            gender: body.gender,
            relationship: body.relationship,
          }
        }
      },
      include: {
        children: true,
        _count: {
          select: { appointments: true }
        }
      }
    });

    return NextResponse.json(customer);
  } catch (error: any) {
    console.error("Failed to create customer:", error);
    return NextResponse.json(
      { error: "Failed to create customer." },
      { status: 500 }
    );
  }
}
