"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROLES } from "@/lib/permissions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { ShieldCheck, ShieldAlert, KeyRound, CheckCircle2, Lock } from "lucide-react";
import { resetUserPassword } from "@/app/actions/admin-users";
import { toast } from "sonner";

export function UsersClient({ initialUsers, currentUserRole }: { initialUsers: any[], currentUserRole: string }) {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newPassword, setNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openResetModal = (user: any) => {
    setSelectedUser(user);
    setNewPassword("");
    setResetModalOpen(true);
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      await resetUserPassword(selectedUser.id, newPassword);
      toast.success("Password changed successfully.");
      
      // Update local state
      setUsers(users.map(u => u.id === selectedUser.id ? {
        ...u,
        passwordChangedAt: new Date(),
        passwordChangedBy: "SUPER_ADMIN",
        resetRequired: false
      } : u));
      
      setResetModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to reset password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-[#F5F5F4] shadow-sm">
        <Input 
          placeholder="Search users..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md bg-slate-50 border-slate-200"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xl shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-slate-900">{user.name}</h3>
                    <p className="text-slate-500 text-sm">{user.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-primary/10 text-primary">
                        {user.role}
                      </span>
                      {user.specialist && (
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-blue-100 text-blue-700">
                          {user.specialist.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 md:mt-0 flex flex-col md:items-end gap-3 w-full md:w-auto">
                  <div className="flex flex-col md:items-end text-sm">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      {user.passwordChangedAt ? (
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <ShieldAlert className="w-4 h-4 text-amber-500" />
                      )}
                      <span className="font-medium">
                        Password Status: {user.passwordChangedAt ? "Set" : "Not Set"}
                      </span>
                    </div>
                    {user.passwordChangedAt && (
                      <div className="text-slate-500 text-xs mt-1 space-y-0.5 text-left md:text-right">
                        <p>Last Changed: {format(new Date(user.passwordChangedAt), "dd MMM yyyy, h:mm a")}</p>
                        <p>Changed By: <span className="font-medium">{user.passwordChangedBy === "SUPER_ADMIN" ? "Super Admin" : user.passwordChangedBy === "USER" ? "User" : user.passwordChangedBy || "System"}</span></p>
                      </div>
                    )}
                  </div>
                  
                  {currentUserRole === ROLES.SUPER_ADMIN && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openResetModal(user)}
                      className="w-full md:w-auto mt-2 text-slate-700"
                    >
                      <KeyRound className="w-4 h-4 mr-2" /> Change Password
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500">No users found.</p>
          </div>
        )}
      </div>

      <Dialog open={resetModalOpen} onOpenChange={setResetModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Secure Password Change
            </DialogTitle>
            <DialogDescription>
              Change password for {selectedUser?.name}. This action will be logged.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleResetSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">New Password</label>
              <Input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 8 chars)"
                className="w-full"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setResetModalOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || newPassword.length < 8}>
                {isSubmitting ? "Changing..." : "Change Password"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
