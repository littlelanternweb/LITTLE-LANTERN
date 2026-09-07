"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit2, EyeOff, Eye, Trash2, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export function OpeningsClient({ initialOpenings }: { initialOpenings: any[] }) {
  const [openings, setOpenings] = useState(initialOpenings);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "Kochi, Kerala",
    experience: "",
    type: "Full-time",
    description: "",
    requirements: ""
  });

  const togglePublish = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    setOpenings(openings.map(o => o.id === id ? { ...o, isPublished: newStatus } : o));
    try {
      await fetch(`/api/admin/openings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: newStatus })
      });
      router.refresh();
    } catch (e) {
      setOpenings(openings.map(o => o.id === id ? { ...o, isPublished: currentStatus } : o));
    }
  };

  const deleteOpening = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job opening?")) return;
    try {
      await fetch(`/api/admin/openings/${id}`, { method: 'DELETE' });
      setOpenings(openings.filter(o => o.id !== id));
      router.refresh();
    } catch (e) {
      alert("Failed to delete opening");
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/openings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setOpenings([data, ...openings]);
      setIsModalOpen(false);
      setFormData({ title: "", department: "", location: "Kochi, Kerala", experience: "", type: "Full-time", description: "", requirements: "" });
      router.refresh();
    } catch (error) {
      alert("Failed to create job opening");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card className="rounded-2xl border-stone-200/60 shadow-sm overflow-hidden">
        <CardHeader className="bg-stone-50/50 border-b border-stone-100 py-4 px-6 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium text-stone-800">All Positions</CardTitle>
          <Button onClick={() => setIsModalOpen(true)} className="bg-[#047857] hover:bg-[#065F46] text-white rounded-full">
            <Plus className="w-4 h-4 mr-2" /> Add Position
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {openings.length === 0 ? (
            <div className="p-10 text-center text-stone-500">
              No job openings found. Click "Add Position" to create one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-stone-50 text-stone-500 font-medium">
                  <tr>
                    <th className="px-6 py-4">Position</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Applications</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 bg-white">
                  {openings.map((opening) => (
                    <tr key={opening.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-stone-900">{opening.title}</div>
                        <div className="text-stone-500 text-xs mt-0.5">{opening.type}</div>
                      </td>
                      <td className="px-6 py-4 text-stone-600">{opening.department}</td>
                      <td className="px-6 py-4 text-stone-600">{opening.location}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                          opening.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-700'
                        }`}>
                          {opening.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-stone-900">{opening._count?.applications || 0}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => togglePublish(opening.id, opening.isPublished)} className="p-2 text-stone-400 hover:text-[#047857] hover:bg-[#F0FDF4] rounded-lg transition-colors" title={opening.isPublished ? "Unpublish" : "Publish"}>
                            {opening.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button onClick={() => deleteOpening(opening.id)} className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-3xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">Add Job Position</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto">
                <form id="add-job-form" onSubmit={handleAdd} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Job Title *</label>
                      <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Department *</label>
                      <input required type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                      <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Experience Required *</label>
                      <input required type="text" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Type *</label>
                      <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Contract</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Job Description *</label>
                    <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Requirements (Optional)</label>
                    <textarea rows={3} value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  </div>
                </form>
              </div>
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" form="add-job-form" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-white">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Create Position
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
