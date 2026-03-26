"use client";

import { 
  Search, 
  Calendar, 
  ChevronRight,
  Linkedin,
  Twitter,
  Mail,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Draft } from "@/types/content";
import Link from "next/link";
import { useState } from "react";

const mockDrafts: Draft[] = [
  { 
    id: "DR-123", 
    title: "Why Founders need AI to scale marketing in 2026", 
    creator: "Julian V.", 
    platforms: ["linkedin", "twitter"], 
    status: "Pending Review", 
    submitted: "2 hours ago",
    estPublishDate: "Mar 26, 2026",
    urgent: true
  } as unknown as Draft,
  { 
    id: "DR-124", 
    title: "N8N Workflows for advanced content creators", 
    creator: "Elena R.", 
    platforms: ["email"], 
    status: "Pending Review", 
    submitted: "5 hours ago",
    estPublishDate: "Mar 27, 2026"
  } as unknown as Draft,
  { 
    id: "DR-125", 
    title: "10 tips for SEO optimization with LLMs", 
    creator: "Marcus K.", 
    platforms: ["twitter"], 
    status: "Rejected", 
    submitted: "1 day ago",
    estPublishDate: "N/A"
  } as unknown as Draft,
  { 
    id: "DR-126", 
    title: "The Future of SaaS Design", 
    creator: "Alice W.", 
    platforms: ["linkedin", "email"], 
    status: "Approved", 
    submitted: "2 days ago",
    estPublishDate: "Mar 25, 2026"
  } as unknown as Draft,
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
                    "rounded-xl px-4 py-2 text-[10px] font-semibold uppercase tracking-wider transition-all",
                    statusFilter === status 
                      ? "bg-brand-dark text-white dark:bg-brand-orange shadow-lg shadow-brand-dark/10" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-brand-light dark:hover:bg-white/5"
                  )}
                >
                  {status}
                </button>
              ))}
           </div>

           {/* Platform Filter */}
           <select className="rounded-2xl border border-brand-light-grey bg-white px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-brand-dark focus:outline-none dark:border-brand-dark/20 dark:bg-white/5 dark:text-brand-light">
              <option>All Platforms</option>
              <option>LinkedIn</option>
              <option>X (Twitter)</option>
              <option>Email</option>
           </select>
        </div>

        <div className="relative w-full lg:max-w-md">
           <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
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
                <div className="absolute right-8 top-8 flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
                  <AlertCircle size={10} />
                  Urgent
                </div>
              )}

              <div className="mb-6 flex items-center gap-3">
                 <div className="h-10 w-10 shrink-0 rounded-full bg-brand-light-grey flex items-center justify-center text-xs font-semibold text-slate-500 dark:bg-white/10 dark:text-brand-light">
                    {draft.creator?.[0] || "?"}
                 </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-brand-dark dark:text-brand-light font-heading">{draft.creator || "Unknown"}</p>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-500 font-body uppercase tracking-wider">{draft.submitted}</p>
                  </div>
              </div>

              <h4 className="mb-8 text-xl font-semibold tracking-tight text-brand-dark dark:text-brand-light font-heading uppercase leading-tight group-hover:text-brand-orange transition-colors">
                {draft.title}
              </h4>

              <div className="mt-auto space-y-6">
                 {/* Platforms */}
                 <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                       {draft.platforms.map(p => (
                         <div key={p} className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-light-grey dark:border-brand-dark/20">
                            {p === "linkedin" && <Linkedin size={14} className="text-[#0077b5]" />}
                            {p === "twitter" && <Twitter size={14} className="text-[#1DA1F2]" />}
                            {p === "email" && <Mail size={14} className="text-slate-400" />}
                         </div>
                       ))}
                    </div>
                     <span className={cn(
                       "text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg",
                       draft.status === "Approved" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" :
                       draft.status === "Rejected" ? "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400" :
                       "bg-brand-orange/10 text-orange-700 dark:bg-brand-orange/20 dark:text-brand-orange"
                     )}>
                       {draft.status}
                     </span>
                 </div>

                 {/* Dates */}
                   <div className="flex items-center justify-between border-t border-brand-light-grey pt-6 dark:border-brand-dark/20 text-slate-500 dark:text-slate-500">
                      <div className="flex items-center gap-2">
                         <Calendar size={14} />
                         <span className="text-[10px] font-bold uppercase tracking-wider font-heading">{draft.estPublishDate}</span>
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
