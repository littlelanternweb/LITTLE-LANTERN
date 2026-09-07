"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { createSpecialist, updateSpecialist } from "@/app/actions/admin-specialists";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

export function SpecialistDialog({ 
  specialist, 
  services, 
  children 
}: { 
  specialist?: any; 
  services: any[]; 
  children?: React.ReactNode; 
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: specialist?.name || "",
    category: specialist?.category || "Special Educator",
    designation: specialist?.designation || "",
    qualifications: specialist?.qualifications || "",
    experience: specialist?.experience || 0,
    specialization: specialist?.specialization || "",
    languages: specialist?.languages || "",
    bio: specialist?.bio || "",
    consultationFee: specialist?.consultationFee || 0,
    consultationType: specialist?.consultationType || "In-Person",
    imageUrl: specialist?.imageUrl || "",
    services: specialist?.services?.map((s: any) => s.id) || [],
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === "experience" || name === "consultationFee" ? Number(value) : value 
    }));
  };

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter((id: string) => id !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For local prototype/Vercel compatibility without a cloud bucket, 
      // we convert the image to a Base64 Data URL and store it in the DB.
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image must be less than 2MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    let res;
    if (specialist?.id) {
      res = await updateSpecialist(specialist.id, formData);
    } else {
      res = await createSpecialist(formData);
    }
    
    setLoading(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success(specialist ? "Specialist updated" : "Specialist created");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-amber-500 text-slate-950 hover:bg-amber-400">
            <Plus className="w-4 h-4 mr-2" /> Add Specialist
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{specialist ? "Edit Specialist" : "Add New Specialist"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label>Photograph</Label>
              <div className="flex items-center gap-3">
                {formData.imageUrl && (
                  <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={formData.imageUrl} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                )}
                <Input type="file" accept="image/*" onChange={handleImageUpload} className="cursor-pointer" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Professional Category</Label>
              <select name="category" value={formData.category} onChange={handleChange} className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">
                <option value="Special Educator">Special Educator</option>
                <option value="Teacher / Faculty">Teacher / Faculty</option>
                <option value="Counsellor">Counsellor</option>
                <option value="Consultant">Consultant</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Designation</Label>
              <Input name="designation" value={formData.designation} onChange={handleChange} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Qualifications</Label>
              <Input name="qualifications" value={formData.qualifications} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label>Experience (Years)</Label>
              <Input name="experience" type="number" min="0" value={formData.experience} onChange={handleChange} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Specialization</Label>
              <Input name="specialization" value={formData.specialization} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Languages</Label>
              <Input name="languages" value={formData.languages} onChange={handleChange} placeholder="English, Spanish..." />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Consultation Type</Label>
              <select name="consultationType" value={formData.consultationType} onChange={handleChange} className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">
                <option value="In-Person">In-Person</option>
                <option value="Online">Online</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Consultation Fee (₹)</Label>
              <Input name="consultationFee" type="number" min="0" value={formData.consultationFee} onChange={handleChange} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Biography</Label>
            <textarea 
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full min-h-[100px] p-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Assign Services</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {services.map(service => (
                <label key={service.id} className="flex items-center space-x-2 text-sm border p-2 rounded-md hover:bg-slate-50 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={formData.services.includes(service.id)}
                    onChange={() => handleServiceToggle(service.id)}
                    className="rounded border-slate-300 text-amber-600 focus:ring-amber-600"
                  />
                  <span>{service.name}</span>
                </label>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full bg-slate-900 text-white hover:bg-slate-800" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            {specialist ? "Save Changes" : "Create Specialist"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
