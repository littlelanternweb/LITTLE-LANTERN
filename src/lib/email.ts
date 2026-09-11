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
  // Idempotency check: if an email of this exact type and relatedId was already successfully sent, skip it.
  if (relatedId) {
    const existing = await prisma.emailLog.findFirst({
      where: { type, relatedId, status: "SUCCESS" }
    });
    if (existing) {
      console.log(`[EMAIL IDEMPOTENCY] Skipped ${type} for ${to}. Already sent.`);
      return { success: true, duplicate: true };
    }
  }

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
    if (!(await isEmailEnabled("email_booking_confirmation"))) return { success: true, disabled: true };

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
  applicationReceived: async (to: string, applicantName: string, position: string, applicationId: string) => {
    if (!(await isEmailEnabled("email_application_confirmation"))) return { success: true, disabled: true };

    const subject = `We received your application — Little Lantern`;
    const content = `
      <h2 class="title">Thank you for your interest</h2>
      <p>Dear ${applicantName},</p>
      <p>We have successfully received your application for the <strong>${position}</strong> position.</p>
      <p>Our team will carefully review your profile. If your qualifications match our current needs, we will reach out to discuss the next steps.</p>
      <div class="box">
        <div class="box-row"><div class="box-label">Reference ID</div><div class="box-value">${applicationId}</div></div>
      </div>
      <p>Thank you for your interest in joining Little Lantern.</p>
    `;
    return sendEmail(to, subject, premiumWrapper(content), "APPLICATION_CONFIRMATION", applicationId);
  },

  // 3. Admin Notification (To Admin)
  adminNotification: async (subject: string, message: string) => {
    if (!(await isEmailEnabled("email_admin_notification"))) return { success: true, disabled: true };

    const adminEmail = process.env.ADMIN_EMAIL || "littlelanternweb@gmail.com";
    const content = `
      <h2 class="title" style="color: #9A3412;">System Alert</h2>
      <p>${message}</p>
    `;
    return sendEmail(adminEmail, subject, premiumWrapper(content), "ADMIN_NOTIFICATION");
  },

  // 4. Test Email
  testEmail: async (to: string) => {
    const subject = `Little Lantern Email Test`;
    const content = `
      <h2 class="title">Connection Successful</h2>
      <p>This is a test email from Little Lantern's system.</p>
      <p>If you are receiving this, your SMTP configuration is perfectly set up and ready for production.</p>
    `;
    return sendEmail(to, subject, premiumWrapper(content), "SYSTEM_TEST");
  },

  // 5. Invoice Delivery
  invoiceDelivery: async (
    to: string,
    customerName: string,
    invoiceNumber: string,
    token: string,
    financials: { total: number, paid: number, balance: number }
  ) => {
    const subject = `Little Lantern — Invoice ${invoiceNumber}`;
    const content = `
      <h2 class="title">Invoice Available</h2>
      <p>Dear ${customerName},</p>
      <p>Thank you for choosing Little Lantern. Your invoice is ready for download.</p>
      
      <div class="box">
        <div class="box-row"><div class="box-label">Invoice No</div><div class="box-value">${invoiceNumber}</div></div>
        <div class="box-row"><div class="box-label">Total Fee</div><div class="box-value">₹${financials.total}</div></div>
        <div class="box-row"><div class="box-label">Total Paid</div><div class="box-value">₹${financials.paid}</div></div>
        <div class="box-row"><div class="box-label">Balance Due</div><div class="box-value">₹${financials.balance}</div></div>
      </div>

      <a href="${baseUrl}/invoice/${token}" class="btn">View & Download PDF</a>
      
      <p style="margin-top: 32px; font-size: 14px; color: #64748B;">For your security, this link is private. Please do not share it.</p>
    `;
    return sendEmail(to, subject, premiumWrapper(content), "INVOICE_DELIVERY", invoiceNumber);
  },

  // 6. Reminder Email
  reminderEmail: async (to: string, customerName: string, childName: string, specialistName: string, date: string, time: string, is24h: boolean, relatedId: string) => {
    const type = is24h ? "REMINDER_24H" : "REMINDER_2H";
    if (!(await isEmailEnabled(`email_${is24h ? '24h' : '2h'}_reminder`))) return { success: true, disabled: true };

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

  // 7. Appointment Cancelled
  appointmentCancelled: async (to: string, customerName: string, specialistName: string, date: string, time: string, relatedId: string) => {
    if (!(await isEmailEnabled("email_cancellation"))) return { success: true, disabled: true };

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

  // 8. Appointment Rescheduled
  appointmentRescheduled: async (to: string, customerName: string, specialistName: string, oldDate: string, oldTime: string, newDate: string, newTime: string, relatedId: string) => {
    if (!(await isEmailEnabled("email_reschedule"))) return { success: true, disabled: true };

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

  // 9. Faculty Welcome
  facultyWelcome: async (to: string, name: string, tempPassword: string) => {
    if (!(await isEmailEnabled("email_faculty_welcome"))) return { success: true, disabled: true };
    const subject = `Set Up Your Little Lantern Faculty Account`;
    const content = `
      <h2 class="title">Welcome to Little Lantern!</h2>
      <p>Dear ${name},</p>
      <p>Your application has been approved and your faculty account has been created successfully. You can now log in to the Little Lantern portal to view your assigned appointments.</p>
      <div class="box">
        <div class="box-row"><div class="box-label">Login Email</div><div class="box-value">${to}</div></div>
        <div class="box-row"><div class="box-label">Temporary Password</div><div class="box-value">${tempPassword}</div></div>
      </div>
      <p>For your security, please log in and update your password immediately.</p>
      <div style="text-align: center; margin-top: 32px;">
        <a href="${baseUrl}/admin/login" class="btn">Log In to Faculty Dashboard</a>
      </div>
    `;
    return sendEmail(to, subject, premiumWrapper(content), "FACULTY_WELCOME");
  },

  // 10. Assignment Notification
  assignmentNotification: async (to: string, name: string, apptDetails: any) => {
    if (!(await isEmailEnabled("email_faculty_assignment"))) return { success: true, disabled: true };
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
  },

  // 11. Payment Confirmed (Partial or Full)
  paymentConfirmed: async (
    to: string,
    customerName: string,
    childName: string,
    specialistName: string,
    date: string,
    time: string,
    invoiceNumber: string,
    appointmentId: string,
    amountReceived: number,
    totalFee: number,
    totalPaid: number,
    balance: number,
    paymentStatus: string,
    isPartial: boolean,
    invoiceToken?: string,
    transactionId?: string
  ) => {
    const type = isPartial ? "PAYMENT_PARTIAL" : "PAYMENT_COMPLETED";
    // For idempotency: full payment is once per appt. Partial is once per txn.
    const relatedId = isPartial && transactionId ? transactionId : appointmentId + "_FULL_PAY";
    
    if (!(await isEmailEnabled("email_payment_confirmation"))) return { success: true, disabled: true };

    const subject = isPartial 
      ? `Payment Received — Balance Remaining`
      : `Payment Confirmed — Your Invoice is Ready`;

    const content = `
      <h2 class="title">${isPartial ? 'Payment Received' : 'Payment Confirmed'}</h2>
      <p>Hello ${customerName},</p>
      <p>${isPartial ? 'Your partial payment has been successfully received.' : 'Your full payment has been successfully received and your invoice is ready.'}</p>
      
      <div class="box">
        ${invoiceNumber ? `<div class="box-row"><div class="box-label">Invoice</div><div class="box-value">${invoiceNumber}</div></div>` : ''}
        <div class="box-row"><div class="box-label">Child</div><div class="box-value">${childName}</div></div>
        <div class="box-row"><div class="box-label">Specialist</div><div class="box-value">${specialistName}</div></div>
        <div class="box-row"><div class="box-label">Appointment</div><div class="box-value">${date} at ${time}</div></div>
      </div>

      <div class="box" style="margin-top: 16px;">
        <div class="box-row"><div class="box-label">Payment Received</div><div class="box-value" style="color: #00A693;">₹${amountReceived}</div></div>
        <div class="box-row"><div class="box-label">Total Fee</div><div class="box-value">₹${totalFee}</div></div>
        <div class="box-row"><div class="box-label">Total Paid</div><div class="box-value">₹${totalPaid}</div></div>
        <div class="box-row"><div class="box-label">Balance Due</div><div class="box-value" style="${balance > 0 ? 'color: #B45309;' : ''}">₹${balance}</div></div>
        <div class="box-row"><div class="box-label">Status</div><div class="box-value">${paymentStatus}</div></div>
      </div>

      ${invoiceToken ? `
      <div style="text-align: center; margin-top: 32px;">
        <a href="${baseUrl}/invoice/${invoiceToken}" class="btn">View Invoice</a>
      </div>
      ` : ''}
    `;

    return sendEmail(to, subject, premiumWrapper(content), type, relatedId);
  },

  // 12. Due Payment Reminder
  paymentDueReminder: async (
    to: string,
    customerName: string,
    childName: string,
    specialistName: string,
    date: string,
    time: string,
    totalFee: number,
    totalPaid: number,
    balance: number,
    appointmentId: string,
    reminderPhase: number // 1 (3 days), 2 (1 day), 3 (0 days)
  ) => {
    const type = "PAYMENT_DUE_REMINDER";
    const relatedId = `${appointmentId}_DUE_REMINDER_${reminderPhase}`;

    if (!(await isEmailEnabled("email_payment_reminder"))) return { success: true, disabled: true };

    const subject = `Payment Reminder — Little Lantern`;
    const content = `
      <h2 class="title">Payment Reminder</h2>
      <p>Hello ${customerName},</p>
      <p>This is a friendly reminder regarding the upcoming consultation for ${childName}.</p>
      
      <div class="box">
        <div class="box-row"><div class="box-label">Specialist</div><div class="box-value">${specialistName}</div></div>
        <div class="box-row"><div class="box-label">Date</div><div class="box-value">${date}</div></div>
        <div class="box-row"><div class="box-label">Time</div><div class="box-value">${time}</div></div>
      </div>

      <div class="box" style="margin-top: 16px;">
        <div class="box-row"><div class="box-label">Total Fee</div><div class="box-value">₹${totalFee}</div></div>
        <div class="box-row"><div class="box-label">Amount Paid</div><div class="box-value">₹${totalPaid}</div></div>
        <div class="box-row"><div class="box-label" style="color: #B45309;">Balance Due</div><div class="box-value" style="color: #B45309;">₹${balance}</div></div>
      </div>

      <p>Please complete the pending payment as required to ensure your appointment goes smoothly.</p>
    `;

    return sendEmail(to, subject, premiumWrapper(content), type, relatedId);
  },

  // 13. Application Approved
  applicationApproved: async (to: string, applicantName: string, category: string, applicationId: string) => {
    if (!(await isEmailEnabled("email_application_approval"))) return { success: true, disabled: true };

    const subject = `Application Approved — Little Lantern`;
    const content = `
      <h2 class="title">Application Approved</h2>
      <p>Hello ${applicantName},</p>
      <p>We are pleased to inform you that your application to join Little Lantern has been approved.</p>
      
      <div class="box">
        <div class="box-row"><div class="box-label">Category</div><div class="box-value">${category}</div></div>
        <div class="box-row"><div class="box-label">Reference ID</div><div class="box-value">${applicationId}</div></div>
      </div>
      
      <p>Our team will now proceed with the faculty onboarding process. You will receive further information regarding your faculty account and portal access shortly.</p>
    `;

    return sendEmail(to, subject, premiumWrapper(content), "JOB_APPLICATION_ACCEPTED", applicationId);
  },

  // 14. Application Declined
  applicationDeclined: async (to: string, applicantName: string, applicationId: string) => {
    if (!(await isEmailEnabled("email_application_declined"))) return { success: true, disabled: true };

    const subject = `Application Update — Little Lantern`;
    const content = `
      <h2 class="title">Application Update</h2>
      <p>Hello ${applicantName},</p>
      <p>Thank you for taking the time to apply to Little Lantern.</p>
      <p>After reviewing your application, we will not be proceeding with your application at this stage.</p>
      <p>We appreciate your interest and wish you success in your professional journey.</p>
    `;

    return sendEmail(to, subject, premiumWrapper(content), "JOB_APPLICATION_DECLINED", applicationId);
  }
};
