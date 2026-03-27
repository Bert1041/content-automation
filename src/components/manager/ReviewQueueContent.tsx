"use client";

import { 
  Search, 
  Calendar, 
  ChevronRight,
  Linkedin,
  Twitter,
  Mail,
  AlertCircle,
  Loader2,
  RefreshCw,
  Database
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "@/components/common/AuthContext";
import { n8nApi, Draft as AirtableDraft } from "@/lib/api/n8n";

export default function ReviewQueueContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [drafts, setDrafts] = useState<AirtableDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadDrafts = useCallback(async () => {
    if (!user?.email) {
      setLoading(false);
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      const data = await n8nApi.fetchReviewQueue(user.email);
      const draftsArray = Array.isArray(data) ? data : (data as any)?.records || [];
      setDrafts(draftsArray);
    } catch (err) {
      console.error("Failed to fetch review queue:", err);
      setError(err instanceof Error ? err.message : "Connection error to n8n");
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    loadDrafts();
  }, [loadDrafts]);

  const groupedDrafts = useMemo(() => {
    const groups: Record<string, AirtableDraft[]> = {};
    drafts.forEach(draft => {
      const requestId = draft.fields?.RequestId || draft.id;
      if (!groups[requestId]) groups[requestId] = [];
      groups[requestId].push(draft);
    });
    return Object.values(groups);
  }, [drafts]);

  const filteredGroups = useMemo(() => {
    return groupedDrafts.filter(group => {
      const firstDraft = group[0];
      if (!firstDraft?.fields) return false;
      
      const topic = (firstDraft.fields.Topic || "").toLowerCase();
      const query = searchQuery.toLowerCase();
      
      const matchesSearch = topic.includes(query) || group.some(d => 
        (d.fields?.Platform || "").toLowerCase().includes(query)
      );
      
      const matchesStatus = statusFilter === "All" || group.some(d => 
        (d.fields?.Status || "").toLowerCase() === statusFilter.toLowerCase()
      );
      
      return matchesSearch && matchesStatus;
    });
  }, [groupedDrafts, searchQuery, statusFilter]);


  if (!user) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4 text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-[10px] font-bold uppercase tracking-widest">Waiting for session...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Connecting to n8n Queue...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 rounded-[2.5rem] border-2 border-dashed border-red-200 bg-red-50/30 p-12 dark:border-red-500/20 dark:bg-red-500/5">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-500 dark:bg-red-500/20">
          <AlertCircle size={32} />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-red-700 dark:text-red-400 font-heading uppercase tracking-tight">Sync Failure</h3>
          <p className="text-sm text-red-600/70 dark:text-red-400/60 max-w-xs">{error}</p>
        </div>
        <button 
          onClick={loadDrafts}
          className="flex items-center gap-2 rounded-2xl bg-red-500 px-8 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-red-500/20 transition-all hover:scale-105 active:scale-95"
        >
          <RefreshCw size={16} />
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* 1. Filters & Search */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-4">
           <div className="flex items-center gap-2 rounded-2xl bg-white p-1.5 shadow-sm dark:bg-white/5 border border-brand-light-grey dark:border-brand-dark/20">
              {["All", "Pending Review", "Rejected", "Approved", "Revision Required"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    "rounded-xl px-4 py-2 text-[10px] font-semibold uppercase tracking-wider transition-all",
                    statusFilter === status 
                      ? "bg-brand-dark text-white dark:bg-brand-orange shadow-lg" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-brand-light dark:hover:bg-white/5"
                  )}
                >
                  {status}
                </button>
              ))}

           </div>
           
           <button 
            onClick={loadDrafts}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-light-grey bg-white text-slate-500 transition-all hover:bg-brand-light dark:border-brand-dark/20 dark:bg-white/5 shadow-sm"
            title="Refresh Queue"
           >
              <RefreshCw size={16} />
           </button>
           <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
             Live Sync: {groupedDrafts.length} topics ({user?.email})
           </div>
        </div>

        <div className="relative w-full lg:max-w-md">
           <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
           <input 
              type="text" 
              placeholder="Search topic or platform..." 
              className="w-full rounded-[2rem] border border-brand-light-grey bg-white py-4 pl-14 pr-6 text-sm font-medium text-brand-dark shadow-xl shadow-brand-dark/5 focus:outline-none focus:ring-2 focus:ring-brand-orange dark:border-brand-dark/20 dark:bg-white/5 dark:text-brand-light"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
           />
        </div>
      </div>

      {/* 2. Drafts Gallery */}
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
         {filteredGroups.length > 0 ? (
           filteredGroups.map((group) => {
             const firstDraft = group[0];
             const platforms = group.map(d => d.fields?.Platform || "");
             const statuses = group.map(d => d.fields?.Status || "");
             
             // Group Status logic
             const isPending = statuses.some(s => s === "Pending Review");
             const isRevision = statuses.some(s => s === "Revision Required");
             const isRejected = statuses.every(s => s === "Rejected");
             const isApproved = statuses.every(s => s === "Approved");
             
             const displayStatus = isPending ? "Pending Review" : 
                                  isRevision ? "Revision Required" :
                                  isApproved ? "Approved" : 
                                  isRejected ? "Rejected" : statuses[0];

             return (
              <Link 
                 key={firstDraft.fields?.RequestId || firstDraft.id} 
                 href={`/manager/review/${firstDraft.id}`}
                 className="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-brand-light-grey bg-white p-8 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-dark/10 dark:border-brand-dark/20 dark:bg-white/5"
              >
                 <div className="mb-6 flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-brand-light-grey flex items-center justify-center text-xs font-semibold text-slate-500 dark:bg-white/10 dark:text-brand-light">
                       {group.length}
                    </div>
                     <div className="space-y-0.5">
                       <p className="text-xs font-bold text-brand-dark dark:text-brand-light font-heading">Group Request</p>
                       <p className="text-[10px] font-bold text-slate-500 dark:text-slate-500 font-body uppercase tracking-wider">
                         {firstDraft.fields.CreationDate || firstDraft.fields.GeneratedAt ? new Date(firstDraft.fields.CreationDate || firstDraft.fields.GeneratedAt || "").toLocaleDateString() : "Recently"}
                       </p>
                     </div>
                 </div>

                 <h4 className="mb-8 text-xl font-semibold tracking-tight text-brand-dark dark:text-brand-light font-heading uppercase leading-tight group-hover:text-brand-orange transition-colors line-clamp-2">
                   {firstDraft.fields.Topic}
                 </h4>

                 <div className="mt-auto space-y-6">
                    {/* Platforms */}
                    <div className="flex items-center justify-between">
                       <div className="flex gap-2">
                           {platforms.some(p => p.includes("LinkedIn")) && (
                             <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-light-grey dark:border-brand-dark/20 bg-white dark:bg-white/5">
                                <Linkedin size={14} className="text-[#0077b5]" />
                             </div>
                           )}
                           {platforms.some(p => p.includes("Twitter")) && (
                             <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-light-grey dark:border-brand-dark/20 bg-white dark:bg-white/5">
                                <Twitter size={14} className="text-[#1DA1F2]" />
                             </div>
                           )}
                           {platforms.some(p => p.includes("Email")) && (
                             <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-light-grey dark:border-brand-dark/20 bg-white dark:bg-white/5">
                                <Mail size={14} className="text-slate-400" />
                             </div>
                           )}
                       </div>
                        <span className={cn(
                          "text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg",
                          displayStatus === "Approved" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" :
                          displayStatus === "Rejected" ? "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400" :
                          displayStatus === "Revision Required" ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400" :
                          "bg-brand-orange/10 text-orange-700 dark:bg-brand-orange/20 dark:text-brand-orange"
                        )}>
                          {displayStatus}
                        </span>
                    </div>

                    {/* Dates */}
                     <div className="flex items-center justify-between border-t border-brand-light-grey pt-6 dark:border-brand-dark/20 text-slate-500 dark:text-slate-500">
                        <div className="flex items-center gap-2">
                           <Calendar size={14} />
                           <span className="text-[10px] font-bold uppercase tracking-wider font-heading">Schedule Review</span>
                        </div>
                      <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                 </div>
              </Link>
            );
           })
         ) : (
           <div className="col-span-full flex h-64 flex-col items-center justify-center gap-4 rounded-[2.5rem] border-2 border-dashed border-brand-light-grey dark:border-brand-dark/20 bg-brand-light/20 dark:bg-white/5">
              <Database className="h-8 w-8 text-slate-400" />
              <div className="text-center">
                <p className="text-sm font-bold uppercase tracking-widest text-slate-600 dark:text-brand-light-grey/60">Queue is empty</p>
                <p className="text-[10px] text-slate-500 mt-1">Review items will appear here once submitted.</p>
              </div>
              <button 
                onClick={loadDrafts}
                className="mt-2 text-[10px] font-bold uppercase tracking-wider text-brand-orange hover:underline"
              >
                Force Sync
              </button>
           </div>
         )}
      </div>
    </div>
  );
}
