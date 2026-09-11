"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Plus, Trash2, Calendar, FileText, CreditCard, Save, X } from "lucide-react";
import Link from "next/link";
import { addCustomerNote, deleteCustomerNote, updateCustomerNote } from "@/app/actions/admin-customers";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

import { toast } from "sonner";

export function CustomerDetailClient({ customer }: { customer: any }) {
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [editingNote, setEditingNote] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveNote = async () => {
    if (!noteText.trim()) return;
    setIsSubmitting(true);
    try {
      if (editingNote) {
        await updateCustomerNote(editingNote.id, customer.id, noteText);
        toast.success("Note updated successfully");
      } else {
        await addCustomerNote(customer.id, noteText);
        toast.success("Note added successfully");
      }
      setIsNoteOpen(false);
      setNoteText("");
      setEditingNote(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to save note");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditNote = (note: any) => {
    setEditingNote(note);
    setNoteText(note.note);
    setIsNoteOpen(true);
  };

  const handleDeleteNote = async (noteId: string) => {
    if (confirm("Are you sure you want to delete this note?")) {
      try {
        await deleteCustomerNote(noteId, customer.id);
        toast.success("Note deleted");
      } catch (error: any) {
        toast.error("Failed to delete note");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/customers">
          <Button variant="outline" size="icon" className="h-10 w-10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{customer.name}</h1>
          <p className="text-slate-500">Customer Details & History</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Customer & Child Info */}
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-4">
              <CardTitle className="text-lg flex justify-between items-center">
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div><p className="text-sm text-slate-500">Name</p><p className="font-medium">{customer.name}</p></div>
              <div><p className="text-sm text-slate-500">Phone</p><p className="font-medium">{customer.phone}</p></div>
              <div><p className="text-sm text-slate-500">Email</p><p className="font-medium">{customer.email}</p></div>
              <div><p className="text-sm text-slate-500">Registered</p><p className="font-medium">{format(new Date(customer.createdAt), "dd MMM yyyy")}</p></div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-4">
              <CardTitle className="text-lg">Children</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {customer.children.length === 0 ? (
                <div className="p-6 text-center text-slate-500">No children registered.</div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {customer.children.map((child: any) => (
                    <div key={child.id} className="p-4">
                      <p className="font-semibold text-slate-900">{child.name}</p>
                      <div className="flex gap-4 mt-1 text-sm text-slate-600">
                        <span>Age: {child.age} yrs</span>
                        <span>Gender: {child.gender}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Internal Notes */}
          <Card className="border-slate-200 shadow-sm bg-yellow-50/30">
            <CardHeader className="bg-yellow-100/50 border-b border-yellow-200/50 p-4 flex flex-row items-center justify-between py-3">
              <CardTitle className="text-lg text-yellow-800">Internal Notes</CardTitle>
              <Button size="sm" variant="ghost" onClick={() => { setEditingNote(null); setNoteText(""); setIsNoteOpen(true); }} className="h-8 text-yellow-700 hover:text-yellow-900 hover:bg-yellow-200/50">
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {customer.notes.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-sm">No internal notes yet.</div>
              ) : (
                <div className="divide-y divide-yellow-200/50 max-h-[400px] overflow-y-auto">
                  {customer.notes.map((note: any) => (
                    <div key={note.id} className="p-4 space-y-2 group">
                      <div className="flex justify-between items-start">
                        <div className="text-xs text-slate-500">
                          {format(new Date(note.createdAt), "dd MMM yyyy - h:mm a")}
                          <span className="mx-1">•</span>
                          By {note.authorName || "Admin"}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEditNote(note)} className="p-1 text-slate-400 hover:text-blue-600"><Edit className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDeleteNote(note.id)} className="p-1 text-slate-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                      <p className="text-sm text-slate-800 whitespace-pre-wrap">{note.note}</p>
                      {note.updatedAt > note.createdAt && (
                        <p className="text-[10px] text-slate-400 italic">Edited {format(new Date(note.updatedAt), "dd MMM yyyy")}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Appointments & Payments */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" /> Appointments History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-white text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3 font-medium">Date & Time</th>
                    <th className="px-4 py-3 font-medium">Specialist</th>
                    <th className="px-4 py-3 font-medium">Child</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Fee / Balance</th>
                    <th className="px-4 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customer.appointments.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">No appointments found.</td></tr>
                  ) : (
                    customer.appointments.map((apt: any) => (
                      <tr key={apt.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900">{format(new Date(apt.date), "dd MMM yyyy")}</div>
                          <div className="text-slate-500 text-xs">{apt.startTime} - {apt.endTime}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium">{apt.specialist.name}</div>
                          <div className="text-slate-500 text-xs">{apt.specialist.category}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-700">{apt.child.name}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider ${apt.status === "CONFIRMED" ? "bg-emerald-100 text-emerald-700" : apt.status === "COMPLETED" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>
                            {apt.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="font-medium text-slate-900">₹{apt.totalAmount}</div>
                          <div className={`text-xs ${apt.totalAmount - (apt.advancePaid + apt.balancePaid) > 0 ? "text-red-500 font-medium" : "text-emerald-500"}`}>
                            Bal: ₹{apt.totalAmount - (apt.advancePaid + apt.balancePaid)}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link href={`/admin/appointments/${apt.id}`}>
                            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-primary">Details</Button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-4 flex flex-row items-center justify-between py-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Invoices
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-white text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3 font-medium">Invoice No</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customer.invoices.length === 0 ? (
                    <tr><td colSpan={3} className="px-4 py-8 text-center text-slate-500">No invoices generated.</td></tr>
                  ) : (
                    customer.invoices.map((inv: any) => (
                      <tr key={inv.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-medium text-slate-900">{inv.invoiceNumber}</td>
                        <td className="px-4 py-3 text-slate-600">{format(new Date(inv.date), "dd MMM yyyy")}</td>
                        <td className="px-4 py-3 text-right">
                          <Link href={`/invoice/${inv.token}`} target="_blank">
                            <Button variant="outline" size="sm" className="text-primary border-primary/20 hover:bg-primary/5">View</Button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isNoteOpen} onOpenChange={setIsNoteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingNote ? "Edit Note" : "Add Internal Note"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <textarea
              placeholder="Type your private note here..."
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              rows={4}
              className="w-full resize-none rounded-md border border-slate-200 p-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <p className="text-xs text-slate-500">This note is private and only visible to administrators.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNoteOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button onClick={handleSaveNote} disabled={isSubmitting || !noteText.trim()}>
              {isSubmitting ? "Saving..." : "Save Note"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
