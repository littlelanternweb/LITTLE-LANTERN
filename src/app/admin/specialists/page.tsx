import { prisma } from "@/lib/db";
import { SpecialistDialog } from "@/components/admin/SpecialistDialog";
import { AvailabilityDialog } from "@/components/admin/AvailabilityDialog";
import { LockSlotDialog } from "@/components/admin/LockSlotDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2, Power, PowerOff } from "lucide-react";
import { toggleSpecialistStatus } from "@/app/actions/admin-specialists";
import { revalidatePath } from "next/cache";
import { DeleteSpecialistButton } from "@/components/admin/DeleteSpecialistButton";
import { SpecialistOrderSelect } from "@/components/admin/SpecialistOrderSelect";

export default async function AdminSpecialists() {
  const specialists = await prisma.specialist.findMany({
    include: { services: true, availability: true, lockedSlots: true },
    orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }]
  });
  
  const services = await prisma.service.findMany({ orderBy: { name: 'asc' } });

  // A tiny inline form to toggle status
  async function toggleStatus(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const current = formData.get("isActive") === "true";
    await toggleSpecialistStatus(id, current);
    revalidatePath("/admin/specialists");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Specialist Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage team members, availability, and profiles.</p>
        </div>
        <SpecialistDialog services={services} />
      </div>

      <div className="grid gap-6 grid-cols-1">
        {specialists.map(specialist => (
          <Card key={specialist.id} className={`border-slate-100 shadow-sm ${!specialist.isActive ? 'opacity-60 bg-slate-50' : ''}`}>
            <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
              
              <div className="h-16 w-16 rounded-xl bg-slate-200 flex-shrink-0 overflow-hidden">
                {specialist.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={specialist.imageUrl} alt={specialist.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-xl font-bold text-slate-400">
                    {specialist.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">{specialist.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${specialist.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                    {specialist.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-sm font-medium text-amber-600 mt-0.5">{specialist.designation} • {specialist.category}</p>
                <div className="mt-2 text-sm text-slate-500">
                  <p><strong>Fee:</strong> ₹{specialist.consultationFee} ({specialist.consultationType})</p>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {specialist.services.map(s => (
                      <span key={s.id} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200">
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <SpecialistOrderSelect id={specialist.id} currentOrder={specialist.displayOrder} totalCount={specialists.length} />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
                <SpecialistDialog specialist={specialist} services={services}>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto text-slate-600">
                    <Edit className="w-4 h-4 mr-2" /> Edit Profile
                  </Button>
                </SpecialistDialog>
                
                <AvailabilityDialog specialist={specialist} />
                <LockSlotDialog specialist={specialist} />

                <form action={toggleStatus}>
                  <input type="hidden" name="id" value={specialist.id} />
                  <input type="hidden" name="isActive" value={specialist.isActive ? "true" : "false"} />
                  <Button type="submit" variant={specialist.isActive ? "destructive" : "default"} size="sm" className="w-full sm:w-auto">
                    {specialist.isActive ? (
                      <><PowerOff className="w-4 h-4 mr-2" /> Deactivate</>
                    ) : (
                      <><Power className="w-4 h-4 mr-2" /> Activate</>
                    )}
                  </Button>
                </form>

                <DeleteSpecialistButton id={specialist.id} />
              </div>

            </CardContent>
          </Card>
        ))}
        {specialists.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No specialists found. Add your first specialist to get started.
          </div>
        )}
      </div>
    </div>
  );
}
