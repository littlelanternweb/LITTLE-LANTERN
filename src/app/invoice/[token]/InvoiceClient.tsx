"use client";

import { useEffect } from "react";
import { format } from "date-fns";
import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function InvoiceClient({ invoice }: { invoice: any }) {
  const apt = invoice.appointment;
  const cst = apt.customer;
  const chd = apt.child;
  const spc = apt.specialist;

  const totalPaid = apt.advancePaid + apt.balancePaid;
  const remaining = apt.totalAmount - totalPaid;
  const isPaid = remaining <= 0;

  const downloadPDF = async () => {
    try {
      const doc = new jsPDF();
      
      doc.setFont("helvetica");
      doc.setFontSize(22);
      doc.setTextColor(0, 166, 147); // Primary color
      doc.text("Little Lantern", 14, 22);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Child Consultation Centre", 14, 28);
      doc.text("Wandoor, Kerala 679328", 14, 33);
      doc.text("Phone: +91 99617 57373", 14, 38);

      doc.setFontSize(20);
      doc.setTextColor(50, 50, 50);
      doc.text("INVOICE", 150, 25);
      
      doc.setFontSize(10);
      doc.text(`Invoice No: ${invoice.invoiceNumber}`, 150, 32);
      doc.text(`Date: ${format(new Date(invoice.createdAt), "dd MMM yyyy")}`, 150, 37);
      doc.text(`Status: ${isPaid ? "PAID" : "PARTIALLY PAID"}`, 150, 42);

      // Customer Info
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("Bill To:", 14, 55);
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      doc.text(`Parent: ${cst.name}`, 14, 62);
      doc.text(`Child: ${chd.name} (${chd.age} yrs)`, 14, 67);
      doc.text(`Phone: ${cst.phone}`, 14, 72);
      doc.text(`Email: ${cst.email}`, 14, 77);

      // Appointment Info
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("Appointment Details:", 110, 55);
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      doc.text(`Apt ID: ${apt.id}`, 110, 62);
      doc.text(`Date: ${format(new Date(apt.date), "dd MMM yyyy")} ${apt.startTime}`, 110, 67);
      doc.text(`Specialist: ${spc.name}`, 110, 72);
      doc.text(`Service: ${spc.category}`, 110, 77);

      // Service Table
      autoTable(doc, {
        startY: 90,
        head: [['Description', 'Amount']],
        body: [
          ['Consultation Fee', `Rs. ${apt.totalAmount.toFixed(2)}`]
        ],
        theme: 'grid',
        headStyles: { fillColor: [0, 166, 147] }
      });

      // Transactions Table
      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 15,
        head: [['Date', 'Payment Type', 'Method', 'Ref', 'Amount']],
        body: apt.transactions.map((t: any) => [
          format(new Date(t.date), "dd MMM yyyy"),
          t.type,
          t.method,
          t.reference || "-",
          `Rs. ${t.amount.toFixed(2)}`
        ]),
        theme: 'striped',
        headStyles: { fillColor: [200, 200, 200], textColor: [0,0,0] }
      });

      // Totals
      const finalY = (doc as any).lastAutoTable.finalY + 15;
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text(`Total Fee: Rs. ${apt.totalAmount.toFixed(2)}`, 140, finalY);
      doc.text(`Total Paid: Rs. ${totalPaid.toFixed(2)}`, 140, finalY + 7);
      
      doc.setFontSize(12);
      doc.setTextColor(remaining > 0 ? 200 : 0, remaining > 0 ? 0 : 150, 0);
      doc.text(`Balance Due: Rs. ${remaining.toFixed(2)}`, 140, finalY + 16);

      doc.save(`${invoice.invoiceNumber}.pdf`);
    } catch (e) {
      console.error(e);
      alert("Failed to generate PDF. Please use the Print option.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex justify-between items-center no-print">
          <h1 className="text-2xl font-semibold text-slate-800">Invoice</h1>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="w-4 h-4 mr-2" /> Print
            </Button>
            <Button className="bg-[#00A693] hover:bg-[#008f7d]" onClick={downloadPDF}>
              <Download className="w-4 h-4 mr-2" /> Download PDF
            </Button>
          </div>
        </div>

        {/* INVOICE PAPER */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 sm:p-12 print:shadow-none print:border-none print:p-0">
          
          <div className="flex flex-col sm:flex-row justify-between border-b pb-8">
            <div>
              <h2 className="text-3xl font-bold text-[#00A693] tracking-tight">Little Lantern</h2>
              <p className="text-sm text-slate-500 mt-1">Child Consultation Centre</p>
              <div className="text-sm text-slate-500 mt-4 leading-relaxed">
                Wandoor, Kerala 679328<br />
                Phone: +91 99617 57373<br />
                Email: hello@littlelantern.in
              </div>
            </div>
            <div className="mt-6 sm:mt-0 sm:text-right">
              <h1 className="text-4xl font-light text-slate-300 tracking-wider">INVOICE</h1>
              <div className="mt-4 space-y-1">
                <p className="text-sm font-medium text-slate-800"><span className="text-slate-500 font-normal mr-2">Invoice No:</span> {invoice.invoiceNumber}</p>
                <p className="text-sm font-medium text-slate-800"><span className="text-slate-500 font-normal mr-2">Date:</span> {format(new Date(invoice.createdAt), "dd MMM yyyy")}</p>
                <p className="text-sm font-medium text-slate-800"><span className="text-slate-500 font-normal mr-2">Status:</span> 
                  <span className={`px-2 py-0.5 rounded text-xs ml-2 ${isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {isPaid ? "PAID" : "PARTIALLY PAID"}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 py-8 border-b">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Billed To</p>
              <p className="font-semibold text-slate-800 text-lg">{cst.name}</p>
              <p className="text-sm text-slate-600 mt-1">Patient: {chd.name} ({chd.age} yrs)</p>
              <p className="text-sm text-slate-600 mt-1">{cst.phone}</p>
              <p className="text-sm text-slate-600 mt-1">{cst.email}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Appointment Details</p>
              <p className="text-sm text-slate-800 font-medium">Apt ID: <span className="font-normal text-slate-600">{apt.id}</span></p>
              <p className="text-sm text-slate-800 font-medium mt-1">Date: <span className="font-normal text-slate-600">{format(new Date(apt.date), "dd MMM yyyy")} at {apt.startTime}</span></p>
              <p className="text-sm text-slate-800 font-medium mt-1">Specialist: <span className="font-normal text-slate-600">{spc.name} ({spc.category})</span></p>
            </div>
          </div>

          <div className="py-8">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="py-3 font-semibold text-slate-800 text-sm">Description</th>
                  <th className="py-3 font-semibold text-slate-800 text-sm text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="border-b">
                <tr>
                  <td className="py-4 text-sm text-slate-700">Consultation Fee</td>
                  <td className="py-4 text-sm text-slate-900 font-medium text-right">₹{apt.totalAmount.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {apt.transactions.length > 0 && (
            <div className="py-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Payment History</p>
              <table className="w-full text-left border-collapse bg-slate-50 rounded-lg overflow-hidden">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-4 py-2 font-semibold text-slate-600 text-xs">Date</th>
                    <th className="px-4 py-2 font-semibold text-slate-600 text-xs">Type</th>
                    <th className="px-4 py-2 font-semibold text-slate-600 text-xs">Method</th>
                    <th className="px-4 py-2 font-semibold text-slate-600 text-xs text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {apt.transactions.map((t: any) => (
                    <tr key={t.id}>
                      <td className="px-4 py-2 text-xs text-slate-700">{format(new Date(t.date), "dd MMM yyyy")}</td>
                      <td className="px-4 py-2 text-xs text-slate-700">{t.type}</td>
                      <td className="px-4 py-2 text-xs text-slate-700">{t.method} {t.reference ? `(${t.reference})` : ''}</td>
                      <td className="px-4 py-2 text-xs text-slate-900 font-medium text-right">₹{t.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="py-8 flex justify-end">
            <div className="w-full sm:w-1/2 lg:w-1/3 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Total Consultation Fee</span>
                <span className="text-slate-900 font-medium">₹{apt.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Total Paid</span>
                <span className="text-emerald-600 font-medium">- ₹{totalPaid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-3 mt-3">
                <span className="text-slate-800">Balance Due</span>
                <span className={remaining > 0 ? "text-rose-600" : "text-slate-900"}>
                  ₹{remaining.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
