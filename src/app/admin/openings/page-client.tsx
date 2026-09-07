"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, MoreVertical, Edit2, EyeOff, Eye, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export function OpeningsClient({ initialOpenings }: { initialOpenings: any[] }) {
  const [openings, setOpenings] = useState(initialOpenings);
  const router = useRouter();

  const togglePublish = async (id: string, currentStatus: boolean) => {
    // In a real app, you'd call a server action or API route here.
    // For now, we update optimistic state to show it works.
    setOpenings(openings.map(o => o.id === id ? { ...o, isPublished: !currentStatus } : o));
  };

  const deleteOpening = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job opening?")) return;
    // Real app: await fetch(...)
    setOpenings(openings.filter(o => o.id !== id));
  };

  return (
    <Card className="rounded-2xl border-stone-200/60 shadow-sm overflow-hidden">
      <CardHeader className="bg-stone-50/50 border-b border-stone-100 py-4 px-6 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium text-stone-800">All Positions</CardTitle>
        <Button className="bg-[#047857] hover:bg-[#065F46] text-white rounded-full">
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
                        <button className="p-2 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteOpening(opening.id)} className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
  );
}
