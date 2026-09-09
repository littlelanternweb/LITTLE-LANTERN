"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, ChevronDown } from "lucide-react";
import { format } from "date-fns";

export function JobsClient({ initialApplications }: { initialApplications: any[] }) {
  const [applications, setApplications] = useState(initialApplications);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const FACULTY_CATEGORIES = [
    "Clinical Psychologist", "Child Psychologist", "Counsellor", 
    "Child & Adolescent Counsellor", "Special or Remedial Educator", 
    "Educational Psychologist", "Career Counsellor", "Occupational Therapist", 
    "Speech & Language Therapist", "Behaviour Therapist", "ABA Therapist", 
    "Learning Support Specialist", "Parent & Family Counsellor", 
    "Audiologist", "Teacher / Faculty", "Consultant"
  ];

  const updateStatus = async (id: string, newStatus: string) => {
    // In a real app, you'd call an API route to update the status in the DB
    setApplications(applications.map(app => app.id === id ? { ...app, status: newStatus } : app));
  };

  const statusColors: Record<string, string> = {
    NEW: "bg-blue-100 text-blue-700",
    REVIEWING: "bg-amber-100 text-amber-700",
    SHORTLISTED: "bg-purple-100 text-purple-700",
    INTERVIEW: "bg-indigo-100 text-indigo-700",
    SELECTED: "bg-emerald-100 text-emerald-700",
    REJECTED: "bg-rose-100 text-rose-700",
  };

  const filteredApps = applications.filter(app => {
    if (statusFilter !== "ALL" && app.status !== statusFilter) return false;
    if (categoryFilter !== "ALL" && app.category !== categoryFilter) return false;
    return true;
  });

  return (
    <Card className="rounded-2xl border-stone-200/60 shadow-sm overflow-hidden">
      <CardHeader className="bg-stone-50/50 border-b border-stone-100 py-4 px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <CardTitle className="text-lg font-medium text-stone-800">Recent Applications</CardTitle>
        <div className="flex items-center gap-2">
          <select 
            value={categoryFilter} 
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white"
          >
            <option value="ALL">All Categories</option>
            {FACULTY_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New</option>
            <option value="REVIEWING">Reviewing</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="INTERVIEW">Interview</option>
            <option value="SELECTED">Selected</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {filteredApps.length === 0 ? (
          <div className="p-10 text-center text-stone-500">
            No applications received yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-stone-50 text-stone-500 font-medium">
                <tr>
                  <th className="px-6 py-4">Applicant</th>
                  <th className="px-6 py-4">Position</th>
                  <th className="px-6 py-4">Experience</th>
                  <th className="px-6 py-4">Applied On</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Resume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 bg-white">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-stone-900">{app.name}</div>
                      <div className="text-stone-500 text-xs mt-0.5">{app.email}</div>
                      <div className="text-stone-500 text-xs">{app.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-stone-900 font-medium">{app.jobOpening?.title || app.position}</div>
                      <div className="text-emerald-600 font-semibold text-[10px] uppercase mt-1">{app.category}</div>
                      <div className="text-stone-500 text-xs mt-0.5">{app.qualifications}</div>
                    </td>
                    <td className="px-6 py-4 text-stone-600">
                      {app.experience}
                    </td>
                    <td className="px-6 py-4 text-stone-600">
                      {format(new Date(app.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={app.status}
                        onChange={(e) => updateStatus(app.id, e.target.value)}
                        className={`text-xs font-semibold uppercase tracking-wider rounded-full px-3 py-1.5 border-0 focus:ring-2 focus:ring-[#00A693] outline-none cursor-pointer appearance-none ${statusColors[app.status] || "bg-stone-100 text-stone-700"}`}
                      >
                        <option value="NEW">New</option>
                        <option value="REVIEWING">Reviewing</option>
                        <option value="SHORTLISTED">Shortlisted</option>
                        <option value="INTERVIEW">Interview</option>
                        <option value="SELECTED">Selected</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {app.resumeUrl ? (
                        <a 
                          href={app.resumeUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#047857] hover:text-[#065F46] hover:bg-[#F0FDF4] px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <FileText className="w-4 h-4" /> View
                        </a>
                      ) : (
                        <span className="text-stone-400 text-xs">No Resume</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
