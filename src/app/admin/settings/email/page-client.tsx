"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch"; // Need to ensure switch exists or use custom toggle
import { Mail, CheckCircle2, XCircle, Send } from "lucide-react";
import { format } from "date-fns";

export function EmailSettingsClient({ initialSettings, logs }: { initialSettings: Record<string, boolean>, logs: any[] }) {
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testEmail, setTestEmail] = useState("");

  const handleToggle = async (key: string, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    // Save to backend immediately
    try {
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: value ? "true" : "false" }),
      });
    } catch (e) {
      console.error("Failed to save setting");
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
        alert("Test email sent successfully! Check your inbox (or terminal if simulating).");
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
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Settings Column */}
      <div className="xl:col-span-1 space-y-6">
        <Card className="rounded-2xl border-stone-200/60 shadow-sm overflow-hidden">
          <CardHeader className="bg-stone-50/50 border-b border-stone-100 py-4 px-6">
            <CardTitle className="text-lg font-medium text-stone-800">Automations</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {Toggles.map((t) => (
              <div key={t.key} className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-sm font-medium text-stone-900">{t.label}</h4>
                  <p className="text-xs text-stone-500 mt-1">{t.desc}</p>
                </div>
                {/* Custom Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input type="checkbox" className="sr-only peer" checked={settings[t.key]} onChange={(e) => handleToggle(t.key, e.target.checked)} />
                  <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#047857]"></div>
                </label>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-stone-200/60 shadow-sm overflow-hidden">
          <CardHeader className="bg-stone-50/50 border-b border-stone-100 py-4 px-6">
            <CardTitle className="text-lg font-medium text-stone-800">Send Test Email</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleTestEmail} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-stone-700">Recipient Email</label>
                <input required type="email" value={testEmail} onChange={e => setTestEmail(e.target.value)} placeholder="name@example.com" className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:ring-2 focus:ring-[#00A693] focus:border-[#00A693]" />
              </div>
              <Button type="submit" disabled={isTesting} className="w-full bg-[#047857] hover:bg-[#065F46] text-white rounded-lg">
                <Send className="w-4 h-4 mr-2" />
                {isTesting ? "Sending..." : "Send Test"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Logs Column */}
      <div className="xl:col-span-2">
        <Card className="rounded-2xl border-stone-200/60 shadow-sm overflow-hidden">
          <CardHeader className="bg-stone-50/50 border-b border-stone-100 py-4 px-6 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium text-stone-800">Activity Log</CardTitle>
            <span className="text-xs text-stone-500 font-medium">Last 50 Emails</span>
          </CardHeader>
          <CardContent className="p-0">
            {logs.length === 0 ? (
              <div className="p-10 text-center text-stone-500">
                <Mail className="w-10 h-10 mx-auto text-stone-300 mb-4" />
                <p>No emails have been sent yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-stone-50 text-stone-500 font-medium border-b border-stone-100">
                    <tr>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Recipient</th>
                      <th className="px-6 py-4">Type / Subject</th>
                      <th className="px-6 py-4 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 bg-white">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="px-6 py-4">
                          {log.status === "SUCCESS" ? (
                            <div className="flex items-center text-emerald-600 gap-1.5 font-medium">
                              <CheckCircle2 className="w-4 h-4" /> Sent
                            </div>
                          ) : (
                            <div className="flex items-center text-rose-600 gap-1.5 font-medium" title={log.error || "Unknown Error"}>
                              <XCircle className="w-4 h-4" /> Failed
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 font-medium text-stone-900">{log.recipient}</td>
                        <td className="px-6 py-4">
                          <div className="text-xs font-semibold text-stone-500 mb-0.5">{log.type}</div>
                          <div className="text-stone-800 truncate max-w-[200px]" title={log.subject}>{log.subject}</div>
                        </td>
                        <td className="px-6 py-4 text-right text-stone-500 text-xs">
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
