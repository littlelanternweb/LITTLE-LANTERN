import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ROLES, hasPermission, PERMISSIONS } from "@/lib/permissions";
import { redirect } from "next/navigation";
import { getUsers } from "@/app/actions/admin-users";
import { UsersClient } from "./UsersClient";

export const metadata = {
  title: "Users Management | Little Lantern Admin",
};

export default async function UsersPage() {
  const session = await getServerSession(authOptions);

  if (!session || !hasPermission(session.user?.role, PERMISSIONS.ADMIN_USERS_MANAGE)) {
    redirect("/admin");
  }

  const users = await getUsers();

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">User Management</h1>
        <p className="text-slate-500 mt-2">Manage admin and faculty accounts, security status, and roles.</p>
      </div>

      <UsersClient initialUsers={users} currentUserRole={session.user.role} />
    </div>
  );
}
