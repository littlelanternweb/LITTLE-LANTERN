import { getSpecialists } from "@/app/actions/specialists";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Languages, Award, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FadeIn, FadeInItem } from "@/components/ui/fade-in";

export const revalidate = 60; // ISR

export default async function SpecialistsPage(props: { searchParams: { q?: string; service?: string } }) {
  const searchParams = await props.searchParams;
  const specialists = await getSpecialists(searchParams);
  const services = await prisma.service.findMany({ orderBy: { name: 'asc' } });

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <FadeIn className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl tracking-tight">Our Specialists</h1>
          <p className="mt-4 text-base text-slate-600 font-light leading-relaxed">
            Find the right expert for your child's unique needs. Our multidisciplinary team is here to guide you with warmth and professional insight.
          </p>
        </FadeIn>

        {/* Filters & Search */}
        <FadeIn delay={0.1} className="mb-12">
          <form className="relative max-w-3xl mx-auto group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
            </div>
            <Input 
              type="search" 
              name="q" 
              placeholder="Find a specialist by name, role, or expertise..." 
              defaultValue={searchParams.q}
              className="w-full pl-14 pr-6 py-6 bg-white border-2 border-slate-100 hover:border-slate-200 focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 rounded-xl text-base shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-all duration-300 placeholder:text-slate-400"
            />
            {searchParams.service && <input type="hidden" name="service" value={searchParams.service} />}
          </form>

          <div className="mt-8 flex flex-wrap justify-center gap-2.5 max-w-4xl mx-auto">
            <Link 
              href="/specialists"
              className={`px-5 py-2 rounded-full text-[13px] font-medium transition-all duration-300 ${!searchParams.service ? 'bg-slate-800 text-white shadow-md scale-105' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
            >
              All Experts
            </Link>
            {services.map(s => (
              <Link
                key={s.id}
                href={`/specialists?service=${s.slug}${searchParams.q ? `&q=${searchParams.q}` : ''}`}
                className={`px-5 py-2 rounded-full text-[13px] font-medium transition-all duration-300 ${searchParams.service === s.slug ? 'bg-primary/10 text-primary shadow-sm border border-primary/20 scale-105' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
              >
                {s.name}
              </Link>
            ))}
          </div>
        </FadeIn>

        {/* Listing */}
        {specialists.length === 0 ? (
          <FadeIn delay={0.2} className="text-center py-24 bg-white rounded-xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-medium text-slate-900">No specialists found</h3>
            <p className="text-sm text-slate-500 mt-2">Try adjusting your filters or search query.</p>
            <Link href="/specialists" className="mt-4 inline-flex items-center text-primary text-sm font-medium hover:text-primary/80">
              Clear filters <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </FadeIn>
        ) : (
          <FadeIn stagger delay={0.2} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {specialists.map((s) => (
              <FadeInItem key={s.id}>
                <Link href={`/specialists/${s.id}`} className="group block h-full">
                  <div className="h-full bg-white rounded-xl border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_-10px_rgba(0,166,147,0.15)] hover:-translate-y-1 hover:border-primary/20 flex flex-col">
                    {/* Image container - using a more compact aspect ratio */}
                    <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] w-full overflow-hidden bg-slate-50">
                      {s.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={s.imageUrl} alt={s.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                          <span className="text-4xl text-slate-300">{s.name.charAt(0)}</span>
                        </div>
                      )}
                      {/* Tags overlay */}
                      <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5">
                        {s.services.slice(0, 1).map(srv => (
                          <span key={srv.id} className="inline-flex items-center rounded bg-white/95 backdrop-blur px-2 py-0.5 text-[11px] font-medium text-slate-700 shadow-sm truncate max-w-full">
                            {srv.name}
                          </span>
                        ))}
                        {s.services.length > 1 && (
                          <span className="inline-flex items-center rounded bg-white/95 backdrop-blur px-2 py-0.5 text-[11px] font-medium text-slate-500 shadow-sm">
                            +{s.services.length - 1}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors truncate">{s.name}</h3>
                      <p className="text-primary text-[13px] font-medium mt-0.5 truncate">{s.designation}</p>
                      
                      <div className="mt-4 space-y-2.5 text-[12px] text-slate-600 flex-grow">
                        <div className="flex items-start gap-2">
                          <Award className="w-3.5 h-3.5 text-slate-300 shrink-0 mt-0.5" />
                          <span className="leading-relaxed line-clamp-2">{s.qualifications}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                          <span>{s.experience} Years Exp.</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Languages className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                          <span className="truncate">{s.languages}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Footer CTA */}
                    <div className="p-5 pt-0 mt-auto flex items-center justify-between border-t border-slate-50 mt-4 pt-4">
                      <div className="text-[13px]">
                        <span className="font-semibold text-slate-900">₹{s.consultationFee}</span>
                        <span className="text-slate-400 font-medium"> / hr</span>
                      </div>
                      <span className="text-primary text-[13px] font-semibold flex items-center group-hover:translate-x-1 transition-transform">
                        Book <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </FadeInItem>
            ))}
          </FadeIn>
        )}
      </div>
    </div>
  );
}
