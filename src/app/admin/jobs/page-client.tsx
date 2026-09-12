"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileText, ChevronDown, Loader2, Eye, UserPlus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { updateJobApplicationStatus, convertApplicationToFaculty, deleteJobApplication } from "@/app/actions/admin-applications";
import { toast } from "sonner";

export function JobsClient({ initialApplications }: { initialApplications: any[] }) {
  const [applications, setApplications] = useState(initialApplications);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [isPending, startTransition] = useTransition();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  const handleConvert = async (app: any) => {
    if (!confirm(`Convert ${app.name} to Faculty/Specialist?`)) return;
    setIsConverting(true);
    try {
      const res = await convertApplicationToFaculty(app.id);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Successfully converted to Faculty!");
        setApplications(apps => apps.map(a => a.id === app.id ? { ...a, convertedAt: new Date() } : a));
        setSelectedApp(null);
      }
    } catch (e) {
      toast.error("Failed to convert.");
    } finally {
      setIsConverting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this application?")) return;
    try {
      const res = await deleteJobApplication(id);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Application deleted.");
        setApplications(apps => apps.filter(a => a.id !== id));
      }
    } catch {
      toast.error("Failed to delete application.");
    }
  };

  const FACULTY_CATEGORIES = [
    "Clinical Psychologist", "Child Psychologist", "Counsellor", 
    "Child & Adolescent Counsellor", "Special or Remedial Educator", 
    "Educational Psychologist", "Career Counsellor", "Occupational Therapist", 
    "Speech & Language Therapist", "Behaviour Therapist", "ABA Therapist", 
    "Learning Support Specialist", "Parent & Family Counsellor", 
    "Audiologist", "Teacher / Faculty", "Consultant"
  ];

  const updateStatus = async (id: string, newStatus: string) => {
    // Optimistic UI update could be done, but we'll await DB persistence
    setUpdatingId(id);
    startTransition(async () => {
      const result = await updateJobApplicationStatus(id, newStatus);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Application status updated successfully.");
        // Update local state to reflect DB change without full page reload
        setApplications(apps => apps.map(app => app.id === id ? { ...app, status: newStatus } : app));
      }
      setUpdatingId(null);
    });
  };

  const statusColors: Record<string, string> = {
    NEW: "bg-blue-100 text-blue-700",
    UNDER_REVIEW: "bg-amber-100 text-amber-700",
    REVIEWING: "bg-amber-100 text-amber-700", // Legacy support
    SHORTLISTED: "bg-purple-100 text-purple-700",
    INTERVIEW: "bg-indigo-100 text-indigo-700",
    ACCEPTED: "bg-emerald-100 text-emerald-700",
    SELECTED: "bg-emerald-100 text-emerald-700", // Legacy support
    DECLINED: "bg-rose-100 text-rose-700",
    REJECTED: "bg-rose-100 text-rose-700", // Legacy support
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
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="INTERVIEW">Interview</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="DECLINED">Declined</option>
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
                      <td className="px-6 py-4 flex items-center gap-2">
                        <select 
                          value={app.status}
                          onChange={(e) => updateStatus(app.id, e.target.value)}
                          disabled={updatingId === app.id}
                          className={`text-xs font-semibold uppercase tracking-wider rounded-full px-3 py-1.5 border-0 focus:ring-2 focus:ring-[#00A693] outline-none cursor-pointer appearance-none ${statusColors[app.status] || "bg-stone-100 text-stone-700"} ${updatingId === app.id ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          <option value="NEW">New</option>
                          <option value="UNDER_REVIEW">Under Review</option>
                          <option value="SHORTLISTED">Shortlisted</option>
                          <option value="INTERVIEW">Interview</option>
                          <option value="ACCEPTED">Accepted</option>
                          <option value="DECLINED">Declined</option>
                        </select>
                        {updatingId === app.id && <Loader2 className="w-4 h-4 text-[#00A693] animate-spin" />}
                      </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end gap-2">
                        {app.resumeUrl ? (
                          <a 
                            href={app.resumeUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#047857] hover:text-[#065F46] hover:bg-[#F0FDF4] px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <FileText className="w-4 h-4" /> Resume
                          </a>
                        ) : (
                          <span className="text-stone-400 text-xs">No Resume</span>
                        )}
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => setSelectedApp(app)} className="h-7 text-xs flex-1">
                            <Eye className="w-3 h-3 mr-1" /> View
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(app.id)} className="h-7 w-7 text-red-400 hover:text-red-600">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>

      <Dialog open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-6 mt-4">
              <div className="flex items-start gap-6">
                {selectedApp.photoUrl ? (
                  <img src={selectedApp.photoUrl} alt="Applicant" className="w-24 h-24 rounded-full object-cover border" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-slate-100 border flex items-center justify-center text-slate-400">No Photo</div>
                )}
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">{selectedApp.name}</h3>
                  <p className="text-slate-500">{selectedApp.email} • {selectedApp.phone}</p>
                  <div className="mt-2 text-sm">
                    <span className="font-medium text-slate-700">Category:</span> <span className="text-emerald-600 font-semibold uppercase">{selectedApp.category}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-xl border">
                <div><span className="text-slate-500 font-medium block">Position Applied</span> {selectedApp.position}</div>
                <div><span className="text-slate-500 font-medium block">Experience</span> {selectedApp.experience}</div>
                <div><span className="text-slate-500 font-medium block">Qualifications</span> {selectedApp.qualifications}</div>
                <div><span className="text-slate-500 font-medium block">Current Org</span> {selectedApp.currentOrg || "-"}</div>
              </div>

              {selectedApp.message && (
                <div className="text-sm bg-slate-50 p-4 rounded-xl border">
                  <span className="text-slate-500 font-medium block mb-1">Message</span>
                  <p className="text-slate-700 whitespace-pre-wrap">{selectedApp.message}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-700">Status:</span>
                  <span className={`text-xs font-bold uppercase px-2 py-1 rounded-md ${statusColors[selectedApp.status] || "bg-slate-100 text-slate-700"}`}>
                    {selectedApp.status}
                  </span>
                </div>
                
                {selectedApp.convertedAt ? (
                  <span className="text-sm text-emerald-600 font-medium bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                    Already converted to Faculty
                  </span>
                ) : (
                  <Button 
                    disabled={selectedApp.status !== "ACCEPTED" || isConverting} 
                    onClick={() => handleConvert(selectedApp)}
                    className="bg-primary text-white hover:bg-primary/90"
                  >
                    {isConverting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UserPlus className="w-4 h-4 mr-2" />}
                    Convert to Faculty
                  </Button>
                )}
              </div>
              
              {selectedApp.status !== "ACCEPTED" && !selectedApp.convertedAt && (
                <p className="text-xs text-rose-500 text-right mt-1">Application must be ACCEPTED to convert.</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
