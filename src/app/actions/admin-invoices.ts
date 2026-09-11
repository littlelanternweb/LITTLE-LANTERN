"use server";

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function generateInvoice(appointmentId: string) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role === "FACULTY") {
    return { error: "Unauthorized" };
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      customer: true,
      invoice: true
    }
  });

  if (!appointment) return { error: "Appointment not found." };

  if (appointment.invoice) {
    return { success: true, token: appointment.invoice.token };
  }

  // Generate new Invoice
  // LL-INV-2026-0001 format
  const year = new Date().getFullYear();
  
  // Find last invoice for this year
  const lastInvoice = await prisma.invoice.findFirst({
    where: { invoiceNumber: { startsWith: `LL-INV-${year}-` } },
    orderBy: { createdAt: 'desc' }
  });

  let seq = 1;
  if (lastInvoice) {
    const parts = lastInvoice.invoiceNumber.split('-');
    seq = parseInt(parts[parts.length - 1], 10) + 1;
  }
  
  const seqStr = seq.toString().padStart(4, '0');
  const invoiceNumber = `LL-INV-${year}-${seqStr}`;

  const crypto = require('crypto');
  const token = crypto.randomUUID();

  const newInvoice = await prisma.invoice.create({
    data: {
      invoiceNumber,
      appointmentId,
      customerId: appointment.customerId,
      token
    }
  });

  return { success: true, token: newInvoice.token };
}

export async function sendInvoiceEmail(appointmentId: string) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role === "FACULTY") {
    return { error: "Unauthorized" };
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      customer: true,
      invoice: true
    }
  });

  if (!appointment) return { error: "Appointment not found." };
  
  if (!appointment.invoice) {
    return { error: "Invoice has not been generated yet." };
  }

  try {
    const { emailTemplates } = await import("@/lib/email");
    
    // We pass the invoice token so the email template can generate the download URL
    await emailTemplates.invoiceDelivery(
      appointment.customer.email,
      appointment.customer.name,
      appointment.invoice.invoiceNumber,
      appointment.invoice.token,
      {
        total: appointment.totalAmount,
        paid: appointment.advancePaid + appointment.balancePaid,
        balance: appointment.totalAmount - (appointment.advancePaid + appointment.balancePaid)
      }
    );

    return { success: true };
  } catch (err: any) {
    console.error("Email error:", err);
    return { error: "Failed to send email. Please check configuration." };
  }
}
