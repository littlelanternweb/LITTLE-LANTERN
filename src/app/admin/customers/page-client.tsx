"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Eye, Mail, Phone, Plus, Calendar } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export function CustomersClient({ initialCustomers, specialists }: { initialCustomers: any[], specialists: any[] }) {
  const router = useRouter();
  const [customers, setCustomers] = useState(initialCustomers);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [search, setSearch] = useState("");

  // Add Customer Form State
  const [cForm, setCForm] = useState({ parentName: "", email: "", phone: "", childName: "", age: "", gender: "Male", relationship: "Parent" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Book Appointment Form State
  const [aForm, setAForm] = useState({ specialistId: "", childId: "", date: "", time: "", reason: "" });

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase()) || 
    c.phone.includes(search)
  );

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cForm),
      });
      if (!res.ok) throw new Error("Failed to create customer");
      const newCustomer = await res.json();
      setCustomers([newCustomer, ...customers]);
      setIsAddCustomerOpen(false);
      setCForm({ parentName: "", email: "", phone: "", childName: "", age: "", gender: "Male", relationship: "Parent" });
    } catch (error) {
      alert("Error adding customer. Make sure email doesn't already exist.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...aForm, customerId: selectedCustomer.id }),
      });
      if (!res.ok) throw new Error("Failed to book appointment");
      // Increment booking count optimistically
      setCustomers(customers.map(c => c.id === selectedCustomer.id ? { ...c, _count: { appointments: c._count.appointments + 1 } } : c));
      setIsBookOpen(false);
      setAForm({ specialistId: "", childId: "", date: "", time: "", reason: "" });
      alert("Appointment booked successfully!");
    } catch (error) {
      alert("Error booking appointment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openBookModal = (customer: any) => {
    setSelectedCustomer(customer);
    setAForm({ ...aForm, childId: customer.children[0]?.id || "" });
    setIsBookOpen(true);
  };

  return (
    <>
      <Card className="border-slate-100 shadow-sm">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-xl flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:max-w-md bg-white border border-slate-200 rounded-md px-3 py-2 focus-within:ring-2 ring-[#00A693]">
            <Search className="w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search by name, email, phone..." value={search} onChange={e => setSearch(e.target.value)} className="w-full text-sm outline-none" />
          </div>
          <Button onClick={() => setIsAddCustomerOpen(true)} className="bg-[#047857] hover:bg-[#065F46] text-white">
            <Plus className="w-4 h-4 mr-2" /> Add Customer
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-medium">Parent Name</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Children</th>
                <th className="px-6 py-4 font-medium text-center">Total Bookings</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No customers found.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(customer => (
                  <tr key={customer.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-900">{customer.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600 mb-1">
                        <Mail className="w-3 h-3" /> {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <Phone className="w-3 h-3" /> {customer.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {customer.children.map((child: any) => (
                          <span key={child.id} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-md inline-block w-max border border-slate-200">
                            {child.name} ({child.age}y, {child.gender})
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-medium text-xs">
                        {customer._count?.appointments || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button onClick={() => openBookModal(customer)} variant="outline" size="sm" className="mr-2 border-[#00A693] text-[#047857] hover:bg-[#F0FDF4]">
                        <Calendar className="w-4 h-4 mr-1.5" /> Book
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ADD CUSTOMER MODAL */}
      {isAddCustomerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900">Add New Customer</h2>
              <button onClick={() => setIsAddCustomerOpen(false)} className="text-slate-400 hover:text-slate-600">×</button>
            </div>
            <form onSubmit={handleAddCustomer} className="p-6 overflow-y-auto space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-700">Parent Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700">Full Name</label>
                    <input required type="text" value={cForm.parentName} onChange={e => setCForm({...cForm, parentName: e.target.value})} className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-[#00A693]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700">Phone</label>
                    <input required type="text" value={cForm.phone} onChange={e => setCForm({...cForm, phone: e.target.value})} className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-[#00A693]" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1 text-slate-700">Email</label>
                    <input required type="email" value={cForm.email} onChange={e => setCForm({...cForm, email: e.target.value})} className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-[#00A693]" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="font-semibold text-slate-700">Child Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1 text-slate-700">Child's Name</label>
                    <input required type="text" value={cForm.childName} onChange={e => setCForm({...cForm, childName: e.target.value})} className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-[#00A693]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700">Age</label>
                    <input required type="number" value={cForm.age} onChange={e => setCForm({...cForm, age: e.target.value})} className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-[#00A693]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700">Gender</label>
                    <select value={cForm.gender} onChange={e => setCForm({...cForm, gender: e.target.value})} className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-[#00A693]">
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={() => setIsAddCustomerOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting} className="bg-[#047857] hover:bg-[#065F46] text-white">Save Customer</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BOOK APPOINTMENT MODAL */}
      {isBookOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900">Book Appointment</h2>
              <button onClick={() => setIsBookOpen(false)} className="text-slate-400 hover:text-slate-600">×</button>
            </div>
            <form onSubmit={handleBookAppointment} className="p-6 space-y-4">
              <p className="text-sm text-slate-500 mb-2">Booking for parent: <strong>{selectedCustomer.name}</strong></p>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Select Child</label>
                <select required value={aForm.childId} onChange={e => setAForm({...aForm, childId: e.target.value})} className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-[#00A693]">
                  {selectedCustomer.children.map((child: any) => (
                    <option key={child.id} value={child.id}>{child.name} ({child.age}y)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Select Specialist</label>
                <select required value={aForm.specialistId} onChange={e => setAForm({...aForm, specialistId: e.target.value})} className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-[#00A693]">
                  <option value="">-- Choose Specialist --</option>
                  {specialists.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.name} (₹{s.consultationFee})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">Date</label>
                  <input required type="date" value={aForm.date} onChange={e => setAForm({...aForm, date: e.target.value})} className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-[#00A693]" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">Time</label>
                  <input required type="time" value={aForm.time} onChange={e => setAForm({...aForm, time: e.target.value})} className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-[#00A693]" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Reason for Visit</label>
                <input required type="text" placeholder="e.g. Initial Assessment" value={aForm.reason} onChange={e => setAForm({...aForm, reason: e.target.value})} className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-[#00A693]" />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                <Button type="button" variant="outline" onClick={() => setIsBookOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting} className="bg-[#047857] hover:bg-[#065F46] text-white">Confirm Booking</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
