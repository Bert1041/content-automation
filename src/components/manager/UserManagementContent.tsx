"use client";

import { useState, useEffect } from "react";
import { 
  Search, UserMinus, 
  Shield, ShieldCheck, UserPlus, X as XIcon, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UserData {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  disabled?: boolean;
  metadata?: {
    creationTime?: string;
  };
}

export default function UserManagementContent() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  // Invite form state
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Content Manager");
  const [isInviting, setIsInviting] = useState(false);

  // Search and Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
       const res = await fetch("/api/users");
       const data = await res.json();
       if (data.users) {
          setUsers(data.users);
       }
    } catch (e) {
       console.error("Failed to fetch users:", e);
    } finally {
       setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInvite = async () => {
    if (!inviteName || !inviteEmail) return alert("Please fill out all fields.");
    setIsInviting(true);
    try {
      const res = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: inviteName,
          email: inviteEmail,
          role: inviteRole,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      alert(`User ${inviteEmail} invited successfully!\n\nTemporary Password: ${data.password}\n\nPlease save or share this securely with the user!`);
      setShowInviteModal(false);
      setInviteName("");
      setInviteEmail("");
      setInviteRole("Content Manager");
      fetchUsers(); // refresh the list
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unknown error occurred";
      alert("Error inviting user: " + message);
    } finally {
      setIsInviting(false);
    }
  };

  const handleDeleteUser = async (uid: string, email: string) => {
    if (!confirm(`Are you sure you want to delete user ${email}? This action cannot be undone.`)) return;
    
    setIsDeleting(uid);
    try {
      const res = await fetch(`/api/users?uid=${uid}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Handle success - optimistically remove
      setUsers(users.filter(u => u.uid !== uid));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unknown error occurred";
      alert("Error deleting user: " + message);
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredUsers = users.filter(user => {
    const searchLow = searchQuery.toLowerCase();
    const nameStr = user.displayName?.toLowerCase() || "";
    const emailStr = user.email?.toLowerCase() || "";
    return nameStr.includes(searchLow) || emailStr.includes(searchLow);
  });

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
         <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
            <input 
               type="text" 
               placeholder="Search users by name or email..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full rounded-2xl border border-brand-light-grey bg-white py-4 pl-14 pr-6 text-sm font-medium text-brand-dark shadow-xl shadow-brand-dark/5 focus:outline-none dark:border-brand-dark/20 dark:bg-white/5 dark:text-brand-light placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
         </div>
         
         <button 
            onClick={() => setShowInviteModal(true)}
            className="flex items-center justify-center gap-3 rounded-2xl bg-brand-dark px-8 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl transition-all active:scale-95 dark:bg-brand-orange"
         >
            <UserPlus size={18} />
            Add New User
         </button>
      </div>

      <div className="rounded-[2.5rem] border border-brand-light-grey bg-white shadow-xl shadow-brand-dark/5 dark:border-brand-dark/20 dark:bg-white/5 overflow-hidden">
         <table className="w-full text-left font-body">
            <thead>
               <tr className="border-b border-brand-light-grey dark:border-brand-dark/20 bg-black/[0.01] dark:bg-white/[0.01]">
                  <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">User</th>
                  <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Role</th>
                  <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Status</th>
                  <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Last Activity</th>
                  <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-brand-light-grey dark:divide-brand-dark/20">
               {loading ? (
                 <tr>
                   <td colSpan={5} className="p-10 text-center text-brand-grey">
                     <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                   </td>
                 </tr>
               ) : filteredUsers.length === 0 ? (
                 <tr>
                   <td colSpan={5} className="p-10 text-center text-brand-grey text-sm font-bold">No users found matching your search.</td>
                 </tr>
               ) : filteredUsers.map((user) => (
                 <tr key={user.uid} className="group transition-colors hover:bg-brand-light/20 dark:hover:bg-white/5">
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-4">
                          <div className="h-10 w-10 shrink-0 rounded-full bg-brand-light-grey flex items-center justify-center text-xs font-black text-brand-grey dark:bg-white/10 dark:text-brand-light">
                             {(user.displayName || user.email)[0].toUpperCase()}
                          </div>
                           <div className="flex flex-col">
                             <span className="text-sm font-medium text-brand-dark dark:text-brand-light">{user.displayName || "Unknown"}</span>
                             <span className="text-[11px] text-slate-600 dark:text-slate-400">{user.email}</span>
                           </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                          {user.role === "Manager" ? (
                            <ShieldCheck size={14} className="text-brand-orange" />
                          ) : (
                            <Shield size={14} className="text-brand-grey" />
                          )}
                          <span className="text-xs font-bold text-brand-dark dark:text-brand-light font-heading">{user.role}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className={cn(
                          "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest",
                          !user.disabled ? "text-green-500" : "text-brand-orange"
                       )}>
                          <div className={cn("h-1.5 w-1.5 rounded-full", !user.disabled ? "bg-green-500" : "bg-brand-orange")} />
                          {!user.disabled ? "Active" : "Disabled"}
                       </div>
                    </td>
                     <td className="px-8 py-6 text-xs text-slate-600 dark:text-slate-500 font-bold uppercase tracking-widest">
                       {user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}
                     </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleDeleteUser(user.uid, user.email)}
                            disabled={isDeleting === user.uid}
                            className="h-8 w-8 rounded-lg bg-brand-light flex items-center justify-center text-brand-grey hover:bg-red-500 hover:text-white transition-all dark:bg-white/10 disabled:opacity-50"
                          >
                             {isDeleting === user.uid ? (
                               <Loader2 size={14} className="animate-spin" />
                             ) : (
                               <UserMinus size={14} />
                             )}
                          </button>
                       </div>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>

      {showInviteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-dark/80 backdrop-blur-sm p-6">
           <div className="w-full max-w-xl rounded-[3rem] bg-white p-12 shadow-2xl dark:bg-brand-dark dark:border dark:border-brand-dark/20 relative">
              <button 
                 onClick={() => setShowInviteModal(false)}
                 className="absolute right-10 top-10 text-brand-grey hover:text-brand-dark transition-colors"
              >
                 <XIcon size={24} />
              </button>
                            <div className="mb-10 space-y-2">
                    <h3 className="text-3xl font-black uppercase tracking-tighter font-heading text-brand-dark dark:text-brand-light">Invite Team Member</h3>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 font-body">Assign a role and send an invitation link instantly.</p>
                 </div>
 
                 <div className="space-y-6">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-500 font-heading">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="John Doe" 
                      value={inviteName}
                      onChange={(e) => setInviteName(e.target.value)}
                      className="w-full rounded-2xl bg-brand-light px-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-orange dark:bg-white/5 border border-transparent" 
                    />
                 </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-500 font-heading">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="john@company.com" 
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="w-full rounded-2xl bg-brand-light px-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-orange dark:bg-white/5 border border-transparent" 
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-grey font-heading">User Role</label>
                    <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => setInviteRole("Content Manager")}
                          className={cn("rounded-2xl border-2 p-4 text-center transition-all", inviteRole === "Content Manager" ? "border-brand-orange bg-brand-orange/5" : "border-brand-light-grey hover:border-brand-dark dark:border-brand-dark/20")}
                        >
                           <p className={cn("text-xs font-black uppercase tracking-widest font-heading", inviteRole === "Content Manager" ? "text-brand-dark dark:text-brand-light" : "text-slate-500")}>Content Manager</p>
                           <p className="text-[9px] font-bold text-slate-500 mt-1">Create & Edit content</p>
                        </button>
                        <button 
                          onClick={() => setInviteRole("Manager")}
                          className={cn("rounded-2xl border-2 p-4 text-center transition-all", inviteRole === "Manager" ? "border-brand-orange bg-brand-orange/5" : "border-brand-light-grey hover:border-brand-dark dark:border-brand-dark/20")}
                        >
                           <p className={cn("text-xs font-black uppercase tracking-widest font-heading", inviteRole === "Manager" ? "text-brand-dark dark:text-brand-light" : "text-slate-500")}>Manager</p>
                           <p className="text-[9px] font-bold text-slate-500 mt-1">Full oversight & Rules</p>
                        </button>
                    </div>
                 </div>
              </div>

              <div className="mt-12">
                 <button 
                   onClick={handleInvite}
                   disabled={isInviting}
                   className="w-full rounded-[2rem] bg-brand-dark py-5 text-sm flex justify-center items-center font-black uppercase tracking-widest text-white shadow-2xl transition-all active:scale-95 disabled:opacity-50 dark:bg-brand-orange"
                 >
                    {isInviting ? <Loader2 className="animate-spin text-white" size={18} /> : "Send Invitation"}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

interface XIconProps {
  size?: number;
  className?: string;
  [key: string]: string | number | boolean | undefined;
}

export function X({ size, className, ...props }: XIconProps) {
   return (
     <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
   );
}
