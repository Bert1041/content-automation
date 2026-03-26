"use client";

import { 
  ClipboardList, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Activity, 
  ExternalLink,
  ChevronRight,
  AlertCircle,
  TrendingUp as TrendingUpIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import StatCard from "@/components/common/StatCard";

const mockPipelineData = [
  { label: "Draft", count: 24, percentage: 80, color: "bg-slate-400" },
  { label: "Pending", count: 8, percentage: 40, color: "bg-brand-orange" },
  { label: "Rejected", count: 2, percentage: 10, color: "bg-rose-500" },
  { label: "Approved", count: 38, percentage: 90, color: "bg-emerald-500" },
  { label: "Scheduled", count: 12, percentage: 30, color: "bg-amber-500" },
  { label: "Published", count: 148, percentage: 100, color: "bg-brand-dark" },
];

const mockRecentSubmissions = [
  { 
    id: 1, 
    title: "Why Founders need AI to scale marketing in 2026", 
    creator: "Julian V.", 
    platforms: ["Linkedin", "Twitter"], 
    status: "Pending", 
    date: "2 hours ago" 
  },
  { 
    id: 2, 
    title: "N8N Workflows for advanced content creators", 
    creator: "Elena R.", 
    platforms: ["Email"], 
    status: "Approved", 
    date: "5 hours ago" 
  },
  { 
    id: 3, 
    title: "10 tips for SEO optimization with LLMs", 
    creator: "Marcus K.", 
    platforms: ["Twitter"], 
    status: "Rejected", 
    date: "1 day ago" 
  },
];

const mockUrgentDrafts = [
  { id: 4, title: "SaaS Design Trends", creator: "Alice W.", waitingTime: "28 hours" },
  { id: 5, title: "Cloud Security Best Practices", creator: "Bob D.", waitingTime: "34 hours" },
];

export default function ManagerDashboardContent() {
  return (
    <div className="space-y-12 pb-20">
      {/* 1. Stat Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6">
        <StatCard title="Total Drafts" value="222" icon={ClipboardList} />
        <StatCard title="Pending" value="8" variant="orange" icon={Clock} />
        <StatCard title="Rejected" value="2" icon={XCircle} />
        <StatCard title="Approved" value="38" variant="dark" icon={CheckCircle2} />
        <StatCard title="Scheduled" value="12" icon={Activity} />
        <StatCard title="Published" value="148" variant="orange" icon={TrendingUpIcon} />
      </div>

      {/* 2. Pipeline Visualization */}
      <section className="glass-card p-10">
        <div className="mb-10 space-y-2">
          <h3 className="text-xl font-semibold tracking-tight text-brand-dark dark:text-brand-light font-heading">
            Platform Pipeline
          </h3>
            <p className="text-sm font-normal text-slate-500 dark:text-slate-400 font-body">
              Real-time visualization of your content generation cycle.
            </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {mockPipelineData.map((stage) => (
            <div key={stage.label} className="space-y-4">
              <div className="flex items-end justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 font-heading">{stage.label}</span>
                <span className="text-xl font-bold text-brand-dark dark:text-brand-light font-heading">{stage.count}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-brand-light-grey dark:bg-white/5 overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-1000", stage.color)}
                  style={{ width: `${stage.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* 3. Recent Submissions Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-semibold tracking-tight text-brand-dark dark:text-brand-light font-heading">
              Recent Submissions
            </h3>
            <button className="text-xs font-semibold uppercase tracking-widest text-brand-accent hover:text-brand-accent-light transition-colors underline-offset-4 focus-ring px-2 py-1 rounded-lg">
              View Queue
            </button>
          </div>

          <div className="glass-card overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-brand-light-grey dark:border-brand-dark/20 bg-black/[0.01] dark:bg-white/[0.01]">
                  <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 font-heading">Title</th>
                  <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 font-heading">Creator</th>
                  <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 font-heading">Status</th>
                  <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 font-heading text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-light-grey dark:divide-brand-dark/20">
                {mockRecentSubmissions.map((item) => (
                  <tr key={item.id} className="group transition-colors hover:bg-brand-light dark:hover:bg-white/5">
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-brand-dark dark:text-brand-light font-heading line-clamp-1">{item.title}</p>
                      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 font-body uppercase tracking-wider">{item.date}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-brand-dark dark:text-brand-light">{item.title}</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">{item.creator}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full",
                        item.status === "Approved" ? "bg-emerald-500/10 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 ring-1 ring-emerald-500/20 shadow-sm" :
                        item.status === "Rejected" ? "bg-rose-500/10 text-rose-800 dark:bg-rose-500/20 dark:text-rose-400 ring-1 ring-rose-500/20 shadow-sm" :
                        "bg-brand-orange/10 text-brand-orange dark:text-brand-orange-light ring-1 ring-brand-orange/20 shadow-sm"
                      )}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex justify-end gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all">
                         <button className="h-8 w-8 rounded-lg bg-brand-dark text-white flex items-center justify-center dark:bg-brand-accent focus-ring shadow-sm hover:scale-110 active:scale-95 transition-all" aria-label="Open Link"><ExternalLink size={14} /></button>
                         <button className="h-8 w-8 rounded-lg border border-brand-light-grey flex items-center justify-center text-brand-grey hover:bg-brand-light dark:border-brand-dark/40 dark:hover:bg-brand-dark/40 focus-ring shadow-sm hover:scale-110 active:scale-95 transition-all" aria-label="View Details"><ChevronRight size={14} /></button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Content Needing Attention */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold tracking-tight text-brand-dark dark:text-brand-light font-heading">
            Urgent Review
          </h3>

          <div className="space-y-4">
            {mockUrgentDrafts.map((item) => (
              <div key={item.id} className="relative overflow-hidden rounded-[2rem] border border-brand-orange/20 bg-brand-orange/5 p-6 dark:border-brand-orange/10 dark:bg-brand-orange/5">
                <div className="absolute right-0 top-0 p-4 opacity-10">
                  <Clock size={60} strokeWidth={1} />
                </div>
                <div className="relative z-10 space-y-3">
                   <div className="flex items-center gap-2">
                     <AlertCircle size={14} className="text-brand-orange" />
                     <span className="text-[10px] font-semibold uppercase tracking-widest text-brand-orange font-heading">Delayed Content</span>
                   </div>
                   <p className="text-sm font-semibold text-brand-dark dark:text-brand-light font-body">Waiting {item.waitingTime}</p>
                   <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 font-body capitalize">By {item.creator}</p>
                   <button className="text-[10px] font-semibold uppercase tracking-widest text-white bg-brand-orange px-3 py-1.5 rounded-lg shadow-md hover:scale-105 active:scale-95 transition-all focus-ring">Review Now</button>
                   </div>
                </div>
              ))}
          </div>

          {/* Quick Stats Summary */}
          <div className="rounded-[2.5rem] bg-gradient-to-br from-brand-accent to-brand-accent-light p-8 pb-10 text-white shadow-2xl shadow-brand-accent/30 dark:from-brand-orange dark:to-brand-orange-light dark:shadow-brand-orange/30 transition-all hover:scale-[1.02] duration-500 overflow-hidden relative">
            <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-white opacity-5 blur-3xl" />
            <TrendingUpIcon size={32} className="mb-6 opacity-50" />
            <h4 className="mb-2 text-2xl font-semibold tracking-tight font-heading leading-tight">
              Pipeline Velocity
            </h4>
            <p className="mb-8 text-xs font-normal text-white/70 font-body leading-relaxed group-hover:text-white/90 transition-colors">
              Your team is publishing <span className="text-white font-bold">12.4% more</span> content than last month.
            </p>
            <div className="h-1 w-full rounded-full bg-white/20">
              <div className="h-full w-3/4 rounded-full bg-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
