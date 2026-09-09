import nodemailer from "nodemailer";
import { prisma } from "@/lib/db";

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "littlelanternweb@gmail.com",
    pass: process.env.EMAIL_PASS,
  },
});

// Helper to check settings
const isEmailEnabled = async (key: string) => {
  const setting = await prisma.setting.findUnique({ where: { key } });
  return setting ? setting.value === "true" : true; // Default to true if not set
};

const sendEmail = async (
  to: string, 
  subject: string, 
  html: string, 
  type: string, 
  relatedId?: string
) => {
  let status = "FAILED";
  let errorMsg = null;

  try {
    if (!process.env.EMAIL_PASS) {
      console.log("----------------------------------------------------------");
      console.log(`[EMAIL SIMULATION] Type: ${type} | To: ${to} | Subject: ${subject}`);
      console.log(html);
      console.log("----------------------------------------------------------");
      status = "SUCCESS";
    } else {
      await transporter.sendMail({
        from: `"Little Lantern" <${process.env.EMAIL_USER || "littlelanternweb@gmail.com"}>`,
        to,
        subject,
        html,
      });
      status = "SUCCESS";
    }
  } catch (error: any) {
    console.error(`Failed to send email (${type}):`, error);
    errorMsg = error.message || "Unknown error";
  }

  // Log to database
  try {
    await prisma.emailLog.create({
      data: {
        type,
        recipient: to,
        subject,
        status,
        relatedId,
        error: errorMsg,
      }
    });
  } catch (logErr) {
    console.error("Failed to log email:", logErr);
  }

  return { success: status === "SUCCESS", error: errorMsg };
};

const baseUrl = process.env.NEXTAUTH_URL || "https://littlelantern.vercel.app";
const premiumWrapper = (content: string) => `
<!DOCTYPE html>
<html>
<head>
<style>
  body { margin: 0; padding: 0; background-color: #F8FAF9; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
  .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,166,147,0.04); border: 1px solid #F1F5F4; }
  .header { padding: 48px 40px; text-align: center; border-bottom: 1px solid #F1F5F4; background: #ffffff; }
  .logo-img { width: 64px; height: 64px; border-radius: 14px; margin-bottom: 16px; border: 1px solid #E2E8F0; object-fit: cover; box-shadow: 0 4px 10px rgba(0,0,0,0.03); }
  .logo { font-size: 22px; font-weight: 600; color: #0F172A; letter-spacing: -0.5px; }
  .content { padding: 48px 40px; color: #475569; font-size: 16px; line-height: 1.6; font-weight: 400; }
  .title { color: #00A693; font-size: 24px; font-weight: 600; margin: 0 0 24px 0; letter-spacing: -0.5px; }
  .box { background: #F8FAF9; border: 1px solid #F1F5F4; border-radius: 12px; padding: 24px; margin: 32px 0; }
  .box-row { display: flex; margin-bottom: 12px; }
  .box-row:last-child { margin-bottom: 0; }
  .box-label { font-weight: 500; color: #334155; width: 130px; flex-shrink: 0; font-size: 14px; }
  .box-value { color: #0F172A; font-weight: 500; font-size: 14px; }
  .footer { padding: 40px; text-align: center; background: #0F172A; color: #94A3B8; font-size: 13px; line-height: 1.6; }
  .footer strong { color: #FFFFFF; font-weight: 600; font-size: 14px; }
  .btn { display: inline-block; background: #00A693; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 500; margin-top: 32px; font-size: 15px; box-shadow: 0 4px 12px rgba(0,166,147,0.2); }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${baseUrl}/logo.jpg" alt="Little Lantern" class="logo-img" />
      <div class="logo">Little Lantern</div>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <strong>Little Lantern</strong><br/>
      Child Consultation Centre<br/>
      Wandoor, Kerala 679328<br/><br/>
      9961757373<br/>
      WhatsApp: +91 99617 57373
    </div>
  </div>
</body>
</html>
`;

export const emailTemplates = {
  // 1. Appointment Booking Confirmation (To Customer)
  bookingConfirmation: async (
    to: string,
    customerName: string,
    specialistName: string,
    date: string,
    time: string,
    bookingId?: string
  ) => {
    if (!(await isEmailEnabled("email_booking_confirmation"))) return;

    const subject = `Your Little Lantern booking details`;
    const content = `
      <h2 class="title">Booking Confirmed</h2>
      <p>Dear ${customerName},</p>
      <p>Your appointment has been successfully scheduled. We look forward to welcoming you.</p>
      <div class="box">
        ${bookingId ? `<div class="box-row"><div class="box-label">Booking ID</div><div class="box-value">${bookingId}</div></div>` : ''}
        <div class="box-row"><div class="box-label">Specialist</div><div class="box-value">${specialistName}</div></div>
        <div class="box-row"><div class="box-label">Date</div><div class="box-value">${date}</div></div>
        <div class="box-row"><div class="box-label">Time</div><div class="box-value">${time}</div></div>
      </div>
      <p>If you need to reschedule or have any questions, please contact our support team.</p>
    `;
    return sendEmail(to, subject, premiumWrapper(content), "BOOKING_CONFIRMATION", bookingId);
  },

  // 2. New Job Application Confirmation (To Applicant)
  applicationReceived: async (to: string, applicantName: string, position: string) => {
    if (!(await isEmailEnabled("email_application_confirmation"))) return;

    const subject = `We received your application — Little Lantern`;
    const content = `
      <h2 class="title">Thank you for your interest</h2>
      <p>Dear ${applicantName},</p>
      <p>We have successfully received your application for the <strong>${position}</strong> position.</p>
      <p>Our team will carefully review your profile. If your qualifications match our current needs, we will reach out to discuss the next steps.</p>
      <p>Thank you for your interest in joining Little Lantern.</p>
    `;
    return sendEmail(to, subject, premiumWrapper(content), "APPLICATION_CONFIRMATION");
  },

  // 3. Admin Notification (To Admin)
  adminNotification: async (subject: string, message: string) => {
    if (!(await isEmailEnabled("email_admin_notification"))) return;

    const adminEmail = process.env.ADMIN_EMAIL || "littlelanternweb@gmail.com";
    const content = `
      <h2 class="title" style="color: #9A3412;">System Alert</h2>
      <p>${message}</p>
    `;
    return sendEmail(adminEmail, subject, premiumWrapper(content), "ADMIN_NOTIFICATION");
  },

  // 4. Test Email
  testEmail: async (to: string) => {
    const subject = `Test Email — Little Lantern`;
    const content = `
      <h2 class="title">Test Configuration</h2>
      <p>If you are seeing this email, your Little Lantern email automation is configured correctly and successfully sending through your SMTP provider.</p>
      <div class="box">
        <div class="box-row"><div class="box-label">Status</div><div class="box-value">Success</div></div>
        <div class="box-row"><div class="box-label">Time</div><div class="box-value">${new Date().toLocaleString()}</div></div>
      </div>
    `;
    return sendEmail(to, subject, premiumWrapper(content), "TEST_EMAIL");
  },

  // 5. Reminder Email
  reminderEmail: async (to: string, customerName: string, childName: string, specialistName: string, date: string, time: string, is24h: boolean, relatedId: string) => {
    const type = is24h ? "REMINDER_24H" : "REMINDER_2H";
    if (!(await isEmailEnabled(`email_${is24h ? '24h' : '2h'}_reminder`))) return;

    const subject = `Your Little Lantern appointment reminder`;
    const content = `
      <h2 class="title">Upcoming Appointment</h2>
      <p>Dear ${customerName},</p>
      <p>This is a reminder that you have an appointment ${is24h ? 'tomorrow' : 'in 2 hours'} for ${childName}.</p>
      <div class="box">
        <div class="box-row"><div class="box-label">Specialist</div><div class="box-value">${specialistName}</div></div>
        <div class="box-row"><div class="box-label">Date</div><div class="box-value">${date}</div></div>
        <div class="box-row"><div class="box-label">Time</div><div class="box-value">${time}</div></div>
      </div>
      <p>Please arrive 10 minutes early. If you need to reschedule, please contact us immediately.</p>
    `;
    return sendEmail(to, subject, premiumWrapper(content), type, relatedId);
  },

  // 6. Appointment Cancelled
  appointmentCancelled: async (to: string, customerName: string, specialistName: string, date: string, time: string, relatedId: string) => {
    if (!(await isEmailEnabled("email_cancellation"))) return;

    const subject = `Your appointment has been cancelled`;
    const content = `
      <h2 class="title" style="color: #9A3412;">Appointment Cancelled</h2>
      <p>Dear ${customerName},</p>
      <p>Your appointment has been successfully cancelled as requested.</p>
      <div class="box">
        <div class="box-row"><div class="box-label">Specialist</div><div class="box-value">${specialistName}</div></div>
        <div class="box-row"><div class="box-label">Date</div><div class="box-value">${date}</div></div>
        <div class="box-row"><div class="box-label">Time</div><div class="box-value">${time}</div></div>
      </div>
      <p>If a refund is applicable, it will be processed according to our standard policies. Please contact us to rebook.</p>
    `;
    return sendEmail(to, subject, premiumWrapper(content), "CANCELLATION", relatedId);
  },

  // 7. Appointment Rescheduled
  appointmentRescheduled: async (to: string, customerName: string, specialistName: string, oldDate: string, oldTime: string, newDate: string, newTime: string, relatedId: string) => {
    if (!(await isEmailEnabled("email_reschedule"))) return;

    const subject = `Your appointment has been rescheduled`;
    const content = `
      <h2 class="title">Appointment Rescheduled</h2>
      <p>Dear ${customerName},</p>
      <p>Your appointment has been successfully rescheduled.</p>
      <div class="box">
        <div class="box-row"><div class="box-label">Specialist</div><div class="box-value">${specialistName}</div></div>
        <div class="box-row"><div class="box-label">New Date</div><div class="box-value font-medium">${newDate}</div></div>
        <div class="box-row"><div class="box-label">New Time</div><div class="box-value font-medium">${newTime}</div></div>
      </div>
      <p style="color: #A8A29E; font-size: 14px;">Previous Slot: ${oldDate} at ${oldTime}</p>
    `;
    return sendEmail(to, subject, premiumWrapper(content), "RESCHEDULE", relatedId);
  },

  // 8. Faculty Welcome
  facultyWelcome: async (to: string, name: string, tempPassword: string) => {
    const subject = `Welcome to Little Lantern Faculty`;
    const content = `
      <h2 class="title">Welcome to Little Lantern!</h2>
      <p>Dear ${name},</p>
      <p>Your faculty account has been created successfully. You can now log in to the Little Lantern portal to view your assigned appointments.</p>
      <div class="box">
        <div class="box-row"><div class="box-label">Login Email</div><div class="box-value">${to}</div></div>
        <div class="box-row"><div class="box-label">Temporary Password</div><div class="box-value">${tempPassword}</div></div>
      </div>
      <p>Please log in and update your password immediately.</p>
      <div style="text-align: center; margin-top: 32px;">
        <a href="${VERCEL_URL}/admin/login" style="background-color: #00A693; color: white; padding: 12px 24px; text-decoration: none; border-radius: 99px; font-weight: 600; display: inline-block;">Log In to Faculty Dashboard</a>
      </div>
    `;
    return sendEmail(to, subject, premiumWrapper(content), "FACULTY_WELCOME");
  },

  // 9. Assignment Notification
  assignmentNotification: async (to: string, name: string, apptDetails: any) => {
    const subject = `New Appointment Assigned — Little Lantern`;
    const content = `
      <h2 class="title">New Appointment Assigned</h2>
      <p>Dear ${name},</p>
      <p>A new appointment has been assigned to you.</p>
      <div class="box">
        <div class="box-row"><div class="box-label">Date</div><div class="box-value">${apptDetails.date}</div></div>
        <div class="box-row"><div class="box-label">Time</div><div class="box-value">${apptDetails.time}</div></div>
        <div class="box-row"><div class="box-label">Child/Patient</div><div class="box-value">${apptDetails.patient}</div></div>
        <div class="box-row"><div class="box-label">Service</div><div class="box-value">${apptDetails.service}</div></div>
      </div>
      <p>Please log in to your Little Lantern faculty dashboard to view complete details.</p>
    `;
    return sendEmail(to, subject, premiumWrapper(content), "ASSIGNMENT_NOTIFICATION", apptDetails.id);
  }
};
