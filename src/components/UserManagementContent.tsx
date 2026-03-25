"use client";

import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  UserMinus, 
  Trash2, 
  CheckCircle2, 
  Clock,
  Shield,
  ShieldCheck,
  Mail,
  UserPlus
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useState } from "react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const mockUsers = [
  { 
    id: 1, 
    name: "Julian Van", 
    email: "julian@fetemi.ai", 
    role: "Content Manager", 
    status: "Active", 
    joined: "Mar 10, 2026" 
  },
  { 
    id: 2, 
    name: "Elena Rossi", 
    email: "elena@fetemi.ai", 
    role: "Content Manager", 
    status: "Active", 
    joined: "Mar 12, 2026" 
  },
  { 
    id: 3, 
    name: "Alex Rivera", 
    email: "alex@fetemi.ai", 
    role: "Manager", 
    status: "Active", 
    joined: "Jan 05, 2026" 
  },
  { 
    id: 4, 
    name: "Marcus K.", 
    email: "mark@fetemi.ai", 
    role: "Content Manager", 
    status: "Invited", 
    joined: "Mar 24, 2026" 
  },
];

export default function UserManagementContent() {
  const [showInviteModal, setShowInviteModal] = useState(false);

  return (
    <div className="space-y-10">
      {/* 1. Header Actions */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
         <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-grey" size={18} />
            <input 
               type="text" 
               placeholder="Search users by name or email..." 
               className="w-full rounded-2xl border border-brand-light-grey bg-white py-4 pl-14 pr-6 text-sm font-medium text-brand-dark shadow-xl shadow-brand-dark/5 focus:outline-none dark:border-brand-dark/20 dark:bg-white/5 dark:text-brand-light"
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

      {/* 2. User Table */}
      <div className="rounded-[2.5rem] border border-brand-light-grey bg-white shadow-xl shadow-brand-dark/5 dark:border-brand-dark/20 dark:bg-white/5 overflow-hidden">
         <table className="w-full text-left font-body">
            <thead>
               <tr className="border-b border-brand-light-grey bg-brand-light/50 dark:border-brand-dark/20 dark:bg-white/5">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-brand-grey font-heading">User</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-brand-grey font-heading">Role</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-brand-grey font-heading">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-brand-grey font-heading">Joined</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-brand-grey font-heading text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-brand-light-grey dark:divide-brand-dark/20">
               {mockUsers.map((user) => (
                 <tr key={user.id} className="group transition-colors hover:bg-brand-light/20 dark:hover:bg-white/5">
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-4">
                          <div className="h-10 w-10 shrink-0 rounded-full bg-brand-light-grey flex items-center justify-center text-xs font-black text-brand-grey dark:bg-white/10 dark:text-brand-light">
                             {user.name[0]}
                          </div>
                          <div>
                             <p className="text-sm font-bold text-brand-dark dark:text-brand-light font-heading">{user.name}</p>
                             <p className="text-[10px] font-bold text-brand-grey uppercase tracking-widest">{user.email}</p>
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
                          user.status === "Active" ? "text-green-500" : "text-brand-orange"
                       )}>
                          <div className={cn("h-1.5 w-1.5 rounded-full", user.status === "Active" ? "bg-green-500" : "bg-brand-orange")} />
                          {user.status}
                       </div>
                    </td>
                    <td className="px-8 py-6 text-xs text-brand-grey font-bold uppercase tracking-widest">{user.joined}</td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="h-8 w-8 rounded-lg bg-brand-light flex items-center justify-center text-brand-grey hover:bg-brand-dark hover:text-white transition-all dark:bg-white/10">
                             <Edit2 size={14} />
                          </button>
                          <button className="h-8 w-8 rounded-lg bg-brand-light flex items-center justify-center text-brand-grey hover:bg-red-500 hover:text-white transition-all dark:bg-white/10">
                             <UserMinus size={14} />
                          </button>
                       </div>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>

      {/* Invite Modal Mockup */}
      {showInviteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-dark/80 backdrop-blur-sm p-6">
           <div className="w-full max-w-xl rounded-[3rem] bg-white p-12 shadow-2xl dark:bg-brand-dark dark:border dark:border-brand-dark/20 relative">
              <button 
                 onClick={() => setShowInviteModal(false)}
                 className="absolute right-10 top-10 text-brand-grey hover:text-brand-dark transition-colors"
              >
                 <X size={24} />
              </button>
              
              <div className="mb-10 space-y-2">
                 <h3 className="text-3xl font-black uppercase tracking-tighter font-heading text-brand-dark dark:text-brand-light">Invite Team Member</h3>
                 <p className="text-sm font-medium text-brand-grey font-body">Assign a role and send an invitation link instantly.</p>
              </div>

              <div className="space-y-6">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-grey font-heading">Full Name</label>
                    <input type="text" placeholder="John Doe" className="w-full rounded-2xl bg-brand-light px-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-orange dark:bg-white/5 border border-transparent" />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-grey font-heading">Email Address</label>
                    <input type="email" placeholder="john@company.com" className="w-full rounded-2xl bg-brand-light px-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-orange dark:bg-white/5 border border-transparent" />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-grey font-heading">User Role</label>
                    <div className="grid grid-cols-2 gap-4">
                       <button className="rounded-2xl border-2 border-brand-orange bg-brand-orange/5 p-4 text-center transition-all">
                          <p className="text-xs font-black uppercase tracking-widest text-brand-dark dark:text-brand-light font-heading">Content Manager</p>
                          <p className="text-[9px] font-bold text-brand-grey mt-1">Create & Edit content</p>
                       </button>
                       <button className="rounded-2xl border-2 border-brand-light-grey p-4 text-center hover:border-brand-dark transition-all dark:border-brand-dark/20">
                          <p className="text-xs font-black uppercase tracking-widest text-brand-grey font-heading">Manager</p>
                          <p className="text-[9px] font-bold text-brand-grey mt-1">Full oversight & Rules</p>
                       </button>
                    </div>
                 </div>
              </div>

              <div className="mt-12">
                 <button className="w-full rounded-[2rem] bg-brand-dark py-5 text-sm font-black uppercase tracking-widest text-white shadow-2xl transition-all active:scale-95 dark:bg-brand-orange">
                    Send Invitation
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

function X({ size, className, ...props }: any) {
   return (
     <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
        {...props}
     >
        <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
     </svg>
   );
}
