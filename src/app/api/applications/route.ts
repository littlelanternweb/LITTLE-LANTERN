import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Create the application in the DB
    const application = await prisma.jobApplication.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        position: body.position, // e.g., "Special Educator" or the specific JobOpening title
        category: body.category || "Consultant",
        jobOpeningId: body.jobOpeningId || null,
        qualifications: body.qualifications,
        experience: body.experience,
        currentOrg: body.currentOrg || null,
        specialisation: body.specialisation || null,
        resumeUrl: body.resumeUrl,
        message: body.message || null,
        status: "NEW", // Default status
      },
    });

    // Send Emails
    try {
      const { emailTemplates } = await import("@/lib/email");
      await emailTemplates.applicationReceived(application.email, application.name, application.position);
      
      await emailTemplates.adminNotification(
        "New Job Application Received",
        `${application.name} has applied for the ${application.position} position.`
      );
    } catch (emailError) {
      console.error("Failed to send emails:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (error: any) {
    console.error("Failed to submit application:", error);
    return NextResponse.json(
      { error: "Failed to submit application." },
      { status: 500 }
    );
  }
}
