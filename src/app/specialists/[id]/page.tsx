import { getSpecialistById } from "@/app/actions/specialists";
import { notFound } from "next/navigation";
import { BookingWidget } from "@/components/booking/BookingWidget";
import { Award, Clock, Languages, MapPin, GraduationCap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const revalidate = 60;

export default async function SpecialistProfilePage(props: { params: { id: string } }) {
  const params = await props.params;
  const specialist = await getSpecialistById(params.id);

  if (!specialist) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#FCFBF9] pt-32 pb-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="mb-10 text-[13px] font-medium text-[#A8A29E] flex items-center gap-3">
          <Link href="/" className="hover:text-[#1C1917] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/specialists" className="hover:text-[#1C1917] transition-colors">Specialists</Link>
          <span>/</span>
          <span className="text-[#1C1917]">{specialist.name}</span>
        </div>

        {/* Row 1: Specialist profile info + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
          
          {/* Main Info Column */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Header Profile */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#F5F5F4] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col sm:flex-row gap-10 items-start">
              <div className="relative h-32 w-32 sm:h-48 sm:w-48 rounded-2xl bg-[#FCFBF9] flex-shrink-0 flex items-center justify-center overflow-hidden border border-[#E7E5E4] shadow-inner">
                {specialist.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={specialist.imageUrl} alt={specialist.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-6xl font-display font-medium text-[#D6D3D1]">{specialist.name.charAt(0)}</span>
                )}
              </div>
              <div className="flex-1 pt-2">
                <h1 className="text-4xl sm:text-5xl font-display font-medium text-[#1C1917] tracking-tight">{specialist.name}</h1>
                <p className="text-xl text-[#9A3412] font-medium mt-3">{specialist.designation}</p>
                
                <div className="flex flex-wrap gap-2 mt-6">
                  {specialist.services.map(srv => (
                    <span key={srv.id} className="inline-flex items-center rounded-lg bg-[#FCFBF9] border border-[#E7E5E4] px-3.5 py-1.5 text-xs font-medium text-[#57534E]">
                      {srv.name}
                    </span>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-6 text-[15px] text-[#78716C]">
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-[#D6D3D1]" />
                    <span>{specialist.experience} Years Experience</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Languages className="w-5 h-5 text-[#D6D3D1]" />
                    <span>{specialist.languages}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* About & Bio */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#F5F5F4] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h2 className="text-2xl font-display font-medium text-[#1C1917] mb-6">About {specialist.name.split(' ')[0]}</h2>
              <div className="prose prose-stone max-w-none">
                <p className="text-[#57534E] text-lg leading-relaxed font-light">{specialist.bio}</p>
              </div>

              <div className="mt-12 pt-10 border-t border-[#F5F5F4]">
                <h3 className="text-xl font-display font-medium text-[#1C1917] mb-5 flex items-center gap-3">
                  <GraduationCap className="w-6 h-6 text-[#9A3412]" />
                  Qualifications
                </h3>
                <p className="text-[#57534E] text-[17px] font-light leading-relaxed">{specialist.qualifications}</p>
              </div>
            </div>

          </div>

          {/* Right sidebar: help card */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 bg-[#FCFBF9] border border-[#F5F5F4] rounded-2xl p-8 text-[15px] text-[#78716C] shadow-sm">
              <h4 className="font-display text-xl font-medium text-[#1C1917] mb-3">Need help booking?</h4>
              <p className="font-light leading-relaxed">If you face any issues while booking, please contact our support desk.</p>
              <div className="mt-6 pt-6 border-t border-[#E7E5E4] space-y-2">
                <p className="font-medium text-[#292524] flex items-center gap-2">
                  <span className="text-[#9A3412]">+91 99617 57373</span>
                </p>
                <p className="font-medium text-[#292524]">littlelanternweb@gmail.com</p>
              </div>
            </div>
          </div>

        </div>

        {/* Row 2: Full-width Booking Widget */}
        <div className="bg-white rounded-3xl border border-[#F5F5F4] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="px-8 pt-8 pb-2 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Book a Consultation</h2>
              <p className="text-slate-500 text-sm mt-1">with {specialist.name}</p>
            </div>
            <span className="text-primary bg-primary/10 px-4 py-2 rounded-xl text-base font-semibold">₹{specialist.consultationFee}</span>
          </div>
          <div className="p-8">
            <BookingWidget specialistId={specialist.id} fee={specialist.consultationFee} />
          </div>
        </div>

      </div>
    </div>
  );
}
