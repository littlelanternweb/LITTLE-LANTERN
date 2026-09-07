import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const { emailTemplates } = await import("@/lib/email");
    
    const result = await emailTemplates.testEmail(email);

    if (result && result.success) {
      return NextResponse.json({ success: true });
    } else {
      throw new Error("Failed to send");
    }
  } catch (error) {
    console.error("Test Email Error:", error);
    return NextResponse.json({ error: "Failed to send test email." }, { status: 500 });
  }
}
