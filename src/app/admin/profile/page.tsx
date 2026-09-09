import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm";

export const dynamic = "force-dynamic";

export default function AdminProfilePage() {
  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-display font-medium text-slate-900 tracking-tight">Admin Profile</h1>
        <p className="text-slate-500 mt-2">Manage your account settings.</p>
      </div>

      <ChangePasswordForm />
    </div>
  );
}
