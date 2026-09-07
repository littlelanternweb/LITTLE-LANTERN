"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle2, XCircle, Send, Settings, Activity, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export function EmailSettingsClient({ initialSettings, logs }: { initialSettings: Record<string, boolean>, logs: any[] }) {
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testEmail, setTestEmail] = useState("technexttechnologies@gmail.com");

  const handleToggle = async (key: string, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    try {
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: value ? "true" : "false" }),
      });
    } catch (e) {
      console.error("Failed to save setting");
      // Revert if failed
      setSettings(settings);
    }
  };

  const handleTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail) return;
    
    setIsTesting(true);
    try {
      const res = await fetch("/api/admin/email/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: testEmail }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Test email sent successfully! Check your inbox.");
      } else {
        alert("Failed to send test email. Check server logs.");
      }
    } catch (error) {
      alert("Error sending test email.");
    } finally {
      setIsTesting(false);
    }
  };

  const Toggles = [
    { key: "email_booking_confirmation", label: "Booking Confirmations", desc: "Sent to customers upon successful payment or admin booking." },
    { key: "email_application_confirmation", label: "Job Application Receipt", desc: "Sent to candidates when they apply for a career opening." },
    { key: "email_admin_notification", label: "Admin Notifications", desc: "Sent to admin email for new bookings and applications." },
    { key: "email_cancellation", label: "Cancellation Notice", desc: "Sent to customers when an appointment is cancelled." },
    { key: "email_reschedule", label: "Reschedule Notice", desc: "Sent to customers when an appointment is rescheduled." },
    { key: "email_24h_reminder", label: "24-Hour Reminders", desc: "Sent to customers exactly 24 hours before their appointment." },
    { key: "email_2h_reminder", label: "2-Hour Reminders", desc: "Sent to customers exactly 2 hours before their appointment." },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Settings Column */}
      <div className="lg:col-span-5 space-y-8">
        
        {/* Automations */}
        <Card className="rounded-3xl border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden bg-white">
          <CardHeader className="border-b border-slate-50 bg-slate-50/50 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-slate-900">Automations</CardTitle>
                <CardDescription className="text-slate-500 mt-1">Manage system-generated emails</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 divide-y divide-slate-50">
            {Toggles.map((t) => (
              <div key={t.key} className="flex items-center justify-between gap-4 p-6 sm:p-8 hover:bg-slate-50/50 transition-colors">
                <div className="pr-8">
                  <h4 className="text-[15px] font-semibold text-slate-900">{t.label}</h4>
                  <p className="text-[13px] text-slate-500 mt-1.5 leading-relaxed">{t.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input type="checkbox" className="sr-only peer" checked={settings[t.key] !== false} onChange={(e) => handleToggle(t.key, e.target.checked)} />
                  <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner"></div>
                </label>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Test Email */}
        <Card className="rounded-3xl border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden bg-white">
          <CardHeader className="p-6 sm:p-8 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-slate-900">Test Delivery</CardTitle>
                <CardDescription className="text-slate-500 mt-1">Send a simulated email</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 sm:p-8 pt-2">
            <form onSubmit={handleTestEmail} className="space-y-4">
              <div>
                <input 
                  required 
                  type="email" 
                  value={testEmail} 
                  onChange={e => setTestEmail(e.target.value)} 
                  placeholder="name@example.com" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm" 
                />
              </div>
              <Button type="submit" disabled={isTesting} className="w-full bg-slate-900 hover:bg-slate-800 text-white h-12 rounded-xl text-sm font-medium shadow-md">
                {isTesting ? (
                  <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Sending...</span>
                ) : (
                  <span className="flex items-center gap-2"><Send className="w-4 h-4" /> Send Test Email</span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Logs Column */}
      <div className="lg:col-span-7">
        <Card className="rounded-3xl border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden bg-white h-full flex flex-col">
          <CardHeader className="border-b border-slate-50 bg-slate-50/50 p-6 sm:p-8 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-slate-900">Activity Log</CardTitle>
                <CardDescription className="text-slate-500 mt-1">Recent automated communications</CardDescription>
              </div>
            </div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 bg-slate-200/50 px-3 py-1 rounded-full">Last 50</span>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-hidden">
            {logs.length === 0 ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-500 space-y-4 p-8">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                  <Mail className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-sm font-medium">No emails have been sent yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto h-full max-h-[800px] overflow-y-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="bg-white sticky top-0 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                    <tr className="text-slate-500 font-medium text-[13px]">
                      <th className="px-8 py-4 font-medium">Status</th>
                      <th className="px-8 py-4 font-medium">Recipient</th>
                      <th className="px-8 py-4 font-medium">Type / Subject</th>
                      <th className="px-8 py-4 text-right font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-8 py-4">
                          {log.status === "SUCCESS" ? (
                            <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg text-xs font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Sent
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 px-2.5 py-1 rounded-lg text-xs font-semibold cursor-help" title={log.error || "Unknown Error"}>
                              <AlertCircle className="w-3.5 h-3.5" /> Failed
                            </div>
                          )}
                        </td>
                        <td className="px-8 py-4 font-medium text-slate-900">{log.recipient}</td>
                        <td className="px-8 py-4">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">{log.type}</div>
                          <div className="text-slate-700 truncate max-w-[250px]" title={log.subject}>{log.subject}</div>
                        </td>
                        <td className="px-8 py-4 text-right text-slate-500 text-[13px]">
                          {format(new Date(log.createdAt), "MMM d, h:mm a")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
