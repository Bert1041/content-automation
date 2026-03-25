"use client";

import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  User, 
  ChevronRight,
  Linkedin,
  Twitter,
  Mail,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { useState } from "react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const mockDrafts = [
  { 
    id: "DR-123", 
    title: "Why Founders need AI to scale marketing in 2026", 
    creator: "Julian V.", 
    platforms: ["Linkedin", "Twitter"], 
    status: "Pending Review", 
    submitted: "2 hours ago",
    estPublish: "Mar 26, 2026",
    urgent: true
  },
  { 
    id: "DR-124", 
    title: "N8N Workflows for advanced content creators", 
    creator: "Elena R.", 
    platforms: ["Email"], 
    status: "Pending Review", 
    submitted: "5 hours ago",
    estPublish: "Mar 27, 2026"
  },
  { 
    id: "DR-125", 
    title: "10 tips for SEO optimization with LLMs", 
    creator: "Marcus K.", 
    platforms: ["Twitter"], 
    status: "Rejected", 
    submitted: "1 day ago",
    estPublish: "N/A"
  },
  { 
    id: "DR-126", 
    title: "The Future of SaaS Design", 
    creator: "Alice W.", 
    platforms: ["Linkedin", "Email"], 
    status: "Approved", 
    submitted: "2 days ago",
    estPublish: "Mar 25, 2026"
  },
];

export default function ReviewQueueContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  return (
    <div className="space-y-10">
      {/* 1. Filters & Search */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-4">
           {/* Status Filter */}
           <div className="flex items-center gap-2 rounded-2xl bg-white p-1.5 shadow-sm dark:bg-white/5 border border-brand-light-grey dark:border-brand-dark/20">
              {["All", "Pending Review", "Rejected", "Approved"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    "rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all",
                    statusFilter === status 
                      ? "bg-brand-dark text-white dark:bg-brand-orange shadow-lg shadow-brand-dark/10" 
                      : "text-brand-grey hover:bg-brand-light dark:hover:bg-white/5"
                  )}
                >
                  {status}
                </button>
              ))}
           </div>

           {/* Platform Filter */}
           <select className="rounded-2xl border border-brand-light-grey bg-white px-5 py-3 text-[10px] font-black uppercase tracking-widest text-brand-dark focus:outline-none dark:border-brand-dark/20 dark:bg-white/5 dark:text-brand-light">
              <option>All Platforms</option>
              <option>LinkedIn</option>
              <option>X (Twitter)</option>
              <option>Email</option>
           </select>
        </div>

        <div className="relative w-full lg:max-w-md">
           <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-grey" size={18} />
           <input 
              type="text" 
              placeholder="Search by title or creator..." 
              className="w-full rounded-[2rem] border border-brand-light-grey bg-white py-4 pl-14 pr-6 text-sm font-medium text-brand-dark shadow-xl shadow-brand-dark/5 focus:outline-none focus:ring-2 focus:ring-brand-orange dark:border-brand-dark/20 dark:bg-white/5 dark:text-brand-light"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
           />
        </div>
      </div>

      {/* 2. Drafts Gallery */}
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
         {mockDrafts.map((draft) => (
           <Link 
              key={draft.id} 
              href={`/manager/review/${draft.id}`}
              className="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-brand-light-grey bg-white p-8 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-dark/10 dark:border-brand-dark/20 dark:bg-white/5"
           >
              {/* Urgent Badge */}
              {draft.urgent && (
                <div className="absolute right-8 top-8 flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
                  <AlertCircle size={10} />
                  Urgent
                </div>
              )}

              <div className="mb-6 flex items-center gap-3">
                 <div className="h-10 w-10 shrink-0 rounded-full bg-brand-light-grey flex items-center justify-center text-xs font-black text-brand-grey dark:bg-white/10 dark:text-brand-light">
                    {draft.creator[0]}
                 </div>
                 <div className="space-y-0.5">
                    <p className="text-xs font-bold text-brand-dark dark:text-brand-light font-heading">{draft.creator}</p>
                    <p className="text-[10px] font-bold text-brand-grey font-body uppercase tracking-widest">{draft.submitted}</p>
                 </div>
              </div>

              <h4 className="mb-8 text-xl font-black tracking-tighter text-brand-dark dark:text-brand-light font-heading uppercase leading-tight group-hover:text-brand-orange transition-colors">
                {draft.title}
              </h4>

              <div className="mt-auto space-y-6">
                 {/* Platforms */}
                 <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                       {draft.platforms.map(p => (
                         <div key={p} className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-light-grey dark:border-brand-dark/20">
                            {p === "Linkedin" && <Linkedin size={14} className="text-[#0077b5]" />}
                            {p === "Twitter" && <Twitter size={14} className="text-[#1DA1F2]" />}
                            {p === "Email" && <Mail size={14} className="text-brand-grey" />}
                         </div>
                       ))}
                    </div>
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg",
                      draft.status === "Approved" ? "bg-green-100 text-green-600" :
                      draft.status === "Rejected" ? "bg-red-100 text-red-600" :
                      "bg-brand-orange/10 text-brand-orange"
                    )}>
                      {draft.status}
                    </span>
                 </div>

                 {/* Dates */}
                 <div className="flex items-center justify-between border-t border-brand-light-grey pt-6 dark:border-brand-dark/20 text-brand-grey">
                    <div className="flex items-center gap-2">
                       <Calendar size={14} />
                       <span className="text-[10px] font-bold uppercase tracking-widest font-heading">{draft.estPublish}</span>
                    </div>
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                 </div>
              </div>
           </Link>
         ))}
      </div>
    </div>
  );
}
