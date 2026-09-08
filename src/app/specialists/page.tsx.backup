import { getSpecialists } from "@/app/actions/specialists";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Languages, Award, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";

export const revalidate = 60; // ISR

export default async function SpecialistsPage(props: { searchParams: { q?: string; service?: string } }) {
  const searchParams = await props.searchParams;
  const specialists = await getSpecialists(searchParams);
  const services = await prisma.service.findMany({ orderBy: { name: 'asc' } });

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h1 className=" text-4xl font-medium text-slate-900 sm:text-5xl tracking-tight">Our Specialists</h1>
          <p className="mt-6 text-lg text-slate-600 font-light leading-relaxed">
            Find the right expert for your child's unique needs. Our multidisciplinary team is here to guide you with warmth and deep professional insight.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="mb-16">
          <form className="relative max-w-4xl mx-auto group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <svg className="w-6 h-6 text-[#A8A29E] group-focus-within:text-[#9A3412] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <Input 
              type="search" 
              name="q" 
              placeholder="Find a specialist by name, role, or expertise..." 
              defaultValue={searchParams.q}
              className="w-full pl-16 pr-8 py-8 bg-white border-2 border-[#F5F5F4] hover:border-[#E7E5E4] focus-visible:border-[#9A3412] focus-visible:ring-4 focus-visible:ring-[#FFEDD5]/50 rounded-2xl text-lg md:text-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 font-light placeholder:text-[#A8A29E]"
            />
            {searchParams.service && <input type="hidden" name="service" value={searchParams.service} />}
          </form>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link 
              href="/specialists"
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${!searchParams.service ? 'bg-[#1C1917] text-white shadow-lg scale-105' : 'bg-white text-slate-700 border border-[#F5F5F4] hover:border-[#D6D3D1] hover:bg-slate-50'}`}
            >
              All Experts
            </Link>
            {services.map(s => (
              <Link
                key={s.id}
                href={`/specialists?service=${s.slug}${searchParams.q ? `&q=${searchParams.q}` : ''}`}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${searchParams.service === s.slug ? 'bg-[#FFEDD5] text-[#9A3412] shadow-md border border-[#FDBA74]/30 scale-105' : 'bg-white text-slate-700 border border-[#F5F5F4] hover:border-[#D6D3D1] hover:bg-slate-50'}`}
              >
                {s.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Listing */}
        {specialists.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-2xl border border-[#F5F5F4] shadow-sm">
            <h3 className="text-xl  font-medium text-slate-900">No specialists found</h3>
            <p className="text-slate-600 mt-3 font-light">Try adjusting your filters or search query.</p>
            <Link href="/specialists" className="mt-6 inline-flex items-center text-[#9A3412] font-medium hover:text-[#7C2D12]">
              Clear filters <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {specialists.map((s) => (
              <Link href={`/specialists/${s.id}`} key={s.id} className="group block h-full">
                <div className="h-full bg-white rounded-xl border border-[#F5F5F4] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1 flex flex-col">
                  {/* Image container */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                    {s.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s.imageUrl} alt={s.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200">
                        <span className="text-5xl  text-stone-300">{s.name.charAt(0)}</span>
                      </div>
                    )}
                    {/* Tags overlay */}
                    <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
                      {s.services.slice(0, 2).map(srv => (
                        <span key={srv.id} className="inline-flex items-center rounded-md bg-white/90 backdrop-blur px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm">
                          {srv.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className=" text-2xl font-medium text-slate-900 group-hover:text-[#9A3412] transition-colors">{s.name}</h3>
                    <p className="text-[#9A3412] text-sm font-medium mt-1">{s.designation}</p>
                    
                    <div className="mt-6 space-y-3 text-[13px] text-slate-600 flex-grow">
                      <div className="flex items-start gap-3">
                        <Award className="w-4 h-4 text-[#D6D3D1] shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{s.qualifications}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-[#D6D3D1] shrink-0" />
                        <span>{s.experience} Years Experience</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Languages className="w-4 h-4 text-[#D6D3D1] shrink-0" />
                        <span>{s.languages}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Footer CTA */}
                  <div className="p-6 pt-0 mt-auto flex items-center justify-between">
                    <div className="text-sm">
                      <span className="font-semibold text-slate-900">₹{s.consultationFee}</span>
                      <span className="text-[#A8A29E]"> / session</span>
                    </div>
                    <Button variant="ghost" className="text-[#9A3412] hover:text-[#7C2D12] hover:bg-[#FFEDD5]/50 px-0 h-auto font-medium rounded-none group-hover:translate-x-1 transition-all">
                      View Profile <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
