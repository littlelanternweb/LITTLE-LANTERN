import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FacultySidebar } from "@/components/faculty/FacultySidebar";

export default async function FacultyLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  if (session.user?.role !== "FACULTY") {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-inter selection:bg-primary/20 selection:text-primary">
      <FacultySidebar session={session} />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 pt-20 md:pt-6 lg:pt-10">
          {children}
        </div>
      </main>
    </div>
  );
}
