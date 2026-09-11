"use client";

import { useState } from "react";
import { format, isWithinInterval, startOfDay, endOfDay, subDays, startOfWeek, startOfMonth, startOfYear } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Calendar as CalendarIcon, Filter, BarChart3, Receipt, FileSpreadsheet } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function ReportsClient({ initialAppointments, initialTransactions, specialists }: any) {
  const [dateRange, setDateRange] = useState("THIS_MONTH");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [facultyFilter, setFacultyFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [methodFilter, setMethodFilter] = useState("ALL");

  const getFilteredDateRange = () => {
    const today = new Date();
    switch (dateRange) {
      case "TODAY": return { start: startOfDay(today), end: endOfDay(today) };
      case "YESTERDAY": return { start: startOfDay(subDays(today, 1)), end: endOfDay(subDays(today, 1)) };
      case "THIS_WEEK": return { start: startOfWeek(today), end: endOfDay(today) };
      case "THIS_MONTH": return { start: startOfMonth(today), end: endOfDay(today) };
      case "THIS_YEAR": return { start: startOfYear(today), end: endOfDay(today) };
      case "CUSTOM": return { 
        start: customStart ? startOfDay(new Date(customStart)) : new Date(0), 
        end: customEnd ? endOfDay(new Date(customEnd)) : endOfDay(today) 
      };
      default: return { start: startOfMonth(today), end: endOfDay(today) };
    }
  };

  const { start, end } = getFilteredDateRange();

  // ----- DATA PROCESSING -----

  const filteredApts = initialAppointments.filter((a: any) => {
    const d = new Date(a.date);
    if (!isWithinInterval(d, { start, end })) return false;
    if (facultyFilter !== "ALL" && a.specialistId !== facultyFilter) return false;
    if (statusFilter !== "ALL" && a.status !== statusFilter) return false;
    return true;
  });

  const filteredTxs = initialTransactions.filter((t: any) => {
    const d = new Date(t.date);
    // Revenue is strictly based on the transaction date!
    if (!isWithinInterval(d, { start, end })) return false;
    if (facultyFilter !== "ALL" && t.appointment.specialistId !== facultyFilter) return false;
    if (methodFilter !== "ALL" && t.method !== methodFilter) return false;
    return true;
  });

  // Revenue Calculations based on Transactions
  const totalRevenue = filteredTxs.reduce((sum: number, t: any) => sum + t.amount, 0);
  const advanceRevenue = filteredTxs.filter((t: any) => t.type === "ADVANCE").reduce((sum: number, t: any) => sum + t.amount, 0);
  const balanceRevenue = filteredTxs.filter((t: any) => t.type === "BALANCE" || t.type === "OTHER").reduce((sum: number, t: any) => sum + t.amount, 0);
  
  const cashTotal = filteredTxs.filter((t: any) => t.method === "CASH").reduce((sum: number, t: any) => sum + t.amount, 0);
  const upiTotal = filteredTxs.filter((t: any) => t.method === "UPI").reduce((sum: number, t: any) => sum + t.amount, 0);
  const cardTotal = filteredTxs.filter((t: any) => t.method === "CARD").reduce((sum: number, t: any) => sum + t.amount, 0);
  const bankTotal = filteredTxs.filter((t: any) => t.method === "BANK_TRANSFER").reduce((sum: number, t: any) => sum + t.amount, 0);
  const onlineTotal = filteredTxs.filter((t: any) => t.method === "RAZORPAY").reduce((sum: number, t: any) => sum + t.amount, 0);

  // ----- EXPORT HELPERS -----
  
  const downloadCSV = (filename: string, headers: string[], rows: any[][]) => {
    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    ].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${format(new Date(), "yyyyMMdd")}.csv`;
    link.click();
  };

  const downloadPDF = async (title: string, headers: string[], rows: any[][]) => {
    const doc = new jsPDF("landscape");
    
    doc.setFontSize(18);
    doc.setTextColor(0, 166, 147);
    doc.text(`Little Lantern - ${title}`, 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${format(new Date(), "PPpp")}`, 14, 26);
    doc.text(`Date Range: ${format(start, "PP")} to ${format(end, "PP")}`, 14, 31);

    autoTable(doc, {
      startY: 40,
      head: [headers],
      body: rows,
      theme: 'grid',
      headStyles: { fillColor: [0, 166, 147] },
      styles: { fontSize: 8 }
    });

    doc.save(`${title.replace(/\s+/g, "_")}_${format(new Date(), "yyyyMMdd")}.pdf`);
  };

  // ----- SPECIFIC EXPORTS -----

  const exportAppointments = (type: 'csv'|'pdf') => {
    const headers = ["Apt ID", "Date", "Time", "Customer", "Child", "Faculty", "Category", "Status", "Payment", "Total Fee", "Received", "Balance"];
    const rows = filteredApts.map((a: any) => [
      a.id, format(new Date(a.date), "dd MMM yyyy"), a.startTime,
      a.customer.name, a.child.name, a.specialist.name, a.specialist.category,
      a.status, a.paymentStatus, a.totalAmount, (a.advancePaid + a.balancePaid), a.totalAmount - (a.advancePaid + a.balancePaid)
    ]);
    if (type === 'csv') downloadCSV("Appointment_Report", headers, rows);
    else downloadPDF("Appointment Report", headers, rows);
  };

  const exportPayments = (type: 'csv'|'pdf') => {
    const headers = ["Tx ID", "Date", "Apt ID", "Customer", "Faculty", "Type", "Method", "Amount", "Reference"];
    const rows = filteredTxs.map((t: any) => [
      t.id, format(new Date(t.date), "dd MMM yyyy HH:mm"), t.appointment.id,
      t.appointment.customer.name, t.appointment.specialist.name,
      t.type, t.method, t.amount, t.reference || ""
    ]);
    if (type === 'csv') downloadCSV("Payment_Report", headers, rows);
    else downloadPDF("Payment Report", headers, rows);
  };

  const exportRevenue = (type: 'csv'|'pdf') => {
    const headers = ["Metric", "Amount"];
    const rows = [
      ["Total Revenue", totalRevenue],
      ["Advance Collections", advanceRevenue],
      ["Balance Collections", balanceRevenue],
      ["Online (Razorpay)", onlineTotal],
      ["Cash", cashTotal],
      ["UPI", upiTotal],
      ["Card", cardTotal],
      ["Bank Transfer", bankTotal],
      ["Total Transactions Count", filteredTxs.length]
    ];
    if (type === 'csv') downloadCSV("Revenue_Report", headers, rows);
    else downloadPDF("Revenue Report", headers, rows);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reports Dashboard</h1>
          <p className="text-slate-500 mt-1">Export financial and operational data.</p>
        </div>
      </div>

      {/* GLOBAL FILTERS */}
      <Card className="bg-white border border-slate-200 shadow-sm">
        <CardContent className="p-4 md:p-6 flex flex-col md:flex-row flex-wrap gap-4 items-end">
          <div className="space-y-1.5 w-full md:w-auto">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date Range</label>
            <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm bg-slate-50 min-w-[180px]">
              <option value="TODAY">Today</option>
              <option value="YESTERDAY">Yesterday</option>
              <option value="THIS_WEEK">This Week</option>
              <option value="THIS_MONTH">This Month</option>
              <option value="THIS_YEAR">This Year</option>
              <option value="CUSTOM">Custom Range</option>
            </select>
          </div>
          
          {dateRange === "CUSTOM" && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Start Date</label>
                <Input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)} className="h-10 bg-slate-50" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">End Date</label>
                <Input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)} className="h-10 bg-slate-50" />
              </div>
            </>
          )}

          <div className="space-y-1.5 w-full md:w-auto">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Faculty</label>
            <select value={facultyFilter} onChange={e => setFacultyFilter(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm bg-slate-50 min-w-[200px]">
              <option value="ALL">All Faculty</option>
              {specialists.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-2xl bg-white border border-slate-200 h-12">
          <TabsTrigger value="revenue" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md transition-all">Revenue</TabsTrigger>
          <TabsTrigger value="appointments" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md transition-all">Appointments</TabsTrigger>
          <TabsTrigger value="payments" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md transition-all">Transactions</TabsTrigger>
        </TabsList>

        {/* REVENUE TAB */}
        <TabsContent value="revenue" className="mt-6 space-y-6">
          <div className="flex justify-end gap-2 mb-4">
            <Button variant="outline" size="sm" onClick={() => exportRevenue('csv')}><FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-600" /> Export CSV</Button>
            <Button variant="outline" size="sm" onClick={() => exportRevenue('pdf')}><FileText className="w-4 h-4 mr-2 text-rose-600" /> Export PDF</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-primary text-white border-0 shadow-md">
              <CardContent className="p-6">
                <p className="text-primary-foreground/80 font-medium text-sm">Total Revenue</p>
                <h3 className="text-3xl font-bold mt-2">₹{totalRevenue.toLocaleString()}</h3>
                <p className="text-xs mt-2 text-primary-foreground/60">Based on transaction dates</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-slate-500 font-medium text-sm">Advance Collections</p>
                <h3 className="text-2xl font-bold mt-2 text-slate-800">₹{advanceRevenue.toLocaleString()}</h3>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-slate-500 font-medium text-sm">Balance Collections</p>
                <h3 className="text-2xl font-bold mt-2 text-slate-800">₹{balanceRevenue.toLocaleString()}</h3>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-slate-500 font-medium text-sm">Total Transactions</p>
                <h3 className="text-2xl font-bold mt-2 text-slate-800">{filteredTxs.length}</h3>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Revenue by Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 font-bold uppercase mb-1">Online</p>
                  <p className="text-lg font-semibold text-slate-900">₹{onlineTotal.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 font-bold uppercase mb-1">Cash</p>
                  <p className="text-lg font-semibold text-slate-900">₹{cashTotal.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 font-bold uppercase mb-1">UPI</p>
                  <p className="text-lg font-semibold text-slate-900">₹{upiTotal.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 font-bold uppercase mb-1">Card</p>
                  <p className="text-lg font-semibold text-slate-900">₹{cardTotal.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 font-bold uppercase mb-1">Bank</p>
                  <p className="text-lg font-semibold text-slate-900">₹{bankTotal.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* APPOINTMENTS TAB */}
        <TabsContent value="appointments" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2 items-center">
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-9 px-3 rounded-lg border border-slate-200 text-sm bg-white">
                <option value="ALL">All Statuses</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => exportAppointments('csv')}><FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-600" /> Export CSV</Button>
              <Button variant="outline" size="sm" onClick={() => exportAppointments('pdf')}><FileText className="w-4 h-4 mr-2 text-rose-600" /> Export PDF</Button>
            </div>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Faculty</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredApts.map((a: any) => (
                    <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3">{format(new Date(a.date), "MMM d")} • {a.startTime}</td>
                      <td className="px-6 py-3 font-medium text-slate-900">{a.customer.name}</td>
                      <td className="px-6 py-3">{a.specialist.name}</td>
                      <td className="px-6 py-3 text-xs">{a.status}</td>
                      <td className="px-6 py-3 text-right font-medium text-slate-900">₹{a.totalAmount}</td>
                    </tr>
                  ))}
                  {filteredApts.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-500">No appointments found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* TRANSACTIONS TAB */}
        <TabsContent value="payments" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2 items-center">
              <select value={methodFilter} onChange={e => setMethodFilter(e.target.value)} className="h-9 px-3 rounded-lg border border-slate-200 text-sm bg-white">
                <option value="ALL">All Methods</option>
                <option value="RAZORPAY">Razorpay</option>
                <option value="CASH">Cash</option>
                <option value="UPI">UPI</option>
                <option value="CARD">Card</option>
                <option value="BANK_TRANSFER">Bank</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => exportPayments('csv')}><FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-600" /> Export CSV</Button>
              <Button variant="outline" size="sm" onClick={() => exportPayments('pdf')}><FileText className="w-4 h-4 mr-2 text-rose-600" /> Export PDF</Button>
            </div>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Apt ID</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Method</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredTxs.map((t: any) => (
                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3">{format(new Date(t.date), "MMM d, HH:mm")}</td>
                      <td className="px-6 py-3 text-xs text-slate-500">{t.appointmentId}</td>
                      <td className="px-6 py-3 text-xs font-semibold">{t.type}</td>
                      <td className="px-6 py-3 text-xs">{t.method}</td>
                      <td className="px-6 py-3 text-right font-bold text-slate-900">₹{t.amount}</td>
                    </tr>
                  ))}
                  {filteredTxs.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-500">No transactions found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
