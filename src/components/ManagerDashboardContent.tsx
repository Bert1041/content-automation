"use client";

import { 
  ClipboardList, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Activity, 
  User,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  History,
  AlertCircle
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const mockPipelineData = [
  { label: "Draft", count: 24, percentage: 80, color: "bg-brand-grey" },
  { label: "Pending", count: 8, percentage: 40, color: "bg-brand-orange" },
  { label: "Rejected", count: 2, percentage: 10, color: "bg-red-500" },
  { label: "Approved", count: 38, percentage: 90, color: "bg-green-500" },
  { label: "Scheduled", count: 12, percentage: 30, color: "bg-blue-500" },
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
        <ManagerStatCard title="Total Drafts" value="222" icon={ClipboardList} />
        <ManagerStatCard title="Pending" value="8" variant="orange" icon={Clock} />
        <ManagerStatCard title="Rejected" value="2" variant="red" icon={XCircle} />
        <ManagerStatCard title="Approved" value="38" variant="green" icon={CheckCircle2} />
        <ManagerStatCard title="Scheduled" value="12" variant="blue" icon={Activity} />
        <ManagerStatCard title="Published" value="148" variant="dark" icon={trendingIcon} />
      </div>

      {/* 2. Pipeline Visualization */}
      <section className="rounded-[2.5rem] border border-brand-light-grey bg-white p-10 shadow-xl shadow-brand-dark/5 dark:border-brand-dark/20 dark:bg-white/5">
        <div className="mb-10 space-y-2">
          <h3 className="text-2xl font-black tracking-tighter text-brand-dark dark:text-brand-light font-heading uppercase">
            Platform Pipeline
          </h3>
          <p className="text-xs font-bold text-brand-grey font-body uppercase tracking-widest">Global conversion & throughput</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {mockPipelineData.map((stage) => (
            <div key={stage.label} className="space-y-4">
              <div className="flex items-end justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-grey font-heading">{stage.label}</span>
                <span className="text-xl font-black text-brand-dark dark:text-brand-light font-heading">{stage.count}</span>
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
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black tracking-tighter text-brand-dark dark:text-brand-light font-heading uppercase">
              Recent Submissions
            </h3>
            <button className="text-xs font-bold uppercase tracking-widest text-brand-orange hover:underline underline-offset-4">
              View Queue
            </button>
          </div>

          <div className="rounded-[2.5rem] border border-brand-light-grey bg-white shadow-xl shadow-brand-dark/5 dark:border-brand-dark/20 dark:bg-white/5 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-brand-light-grey dark:border-brand-dark/20 bg-brand-light dark:bg-white/5">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-brand-grey font-heading">Title</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-brand-grey font-heading">Creator</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-brand-grey font-heading">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-brand-grey font-heading text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-light-grey dark:divide-brand-dark/20">
                {mockRecentSubmissions.map((item) => (
                  <tr key={item.id} className="group transition-colors hover:bg-brand-light dark:hover:bg-white/5">
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-brand-dark dark:text-brand-light font-heading line-clamp-1">{item.title}</p>
                      <p className="text-[10px] font-bold text-brand-grey font-body uppercase tracking-wider">{item.date}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-brand-light-grey flex items-center justify-center text-[10px] font-bold text-brand-grey">
                          {item.creator[0]}
                        </div>
                        <span className="text-xs font-bold text-brand-dark dark:text-brand-light font-heading">{item.creator}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full",
                        item.status === "Approved" ? "bg-green-100 text-green-600" :
                        item.status === "Rejected" ? "bg-red-100 text-red-600" :
                        "bg-brand-orange/10 text-brand-orange"
                      )}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="h-8 w-8 rounded-lg bg-brand-dark text-white flex items-center justify-center dark:bg-brand-orange"><ExternalLink size={14} /></button>
                         <button className="h-8 w-8 rounded-lg border border-brand-light-grey flex items-center justify-center text-brand-grey hover:bg-white dark:border-brand-dark/40"><ChevronRight size={14} /></button>
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
          <h3 className="text-2xl font-black tracking-tighter text-brand-dark dark:text-brand-light font-heading uppercase">
            Urgent Review
          </h3>
          
          <div className="space-y-4">
            {mockUrgentDrafts.map((item) => (
              <div key={item.id} className="relative overflow-hidden rounded-[2rem] border border-orange-200 bg-orange-50 p-6 dark:border-orange-500/20 dark:bg-orange-500/5">
                <div className="absolute right-0 top-0 p-4 opacity-10">
                  <Clock size={60} strokeWidth={1} />
                </div>
                <div className="relative z-10 space-y-3">
                   <div className="flex items-center gap-2">
                     <AlertCircle size={14} className="text-orange-500" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 font-heading">Waiting {item.waitingTime}</span>
                   </div>
                   <p className="text-sm font-bold text-brand-dark dark:text-brand-light font-heading">{item.title}</p>
                   <div className="flex items-center justify-between">
                     <span className="text-[10px] font-bold text-brand-grey font-body capitalize">By {item.creator}</span>
                     <button className="text-[10px] font-black uppercase tracking-widest text-brand-orange bg-white px-3 py-1.5 rounded-lg shadow-sm">Review Now</button>
                   </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats Summary */}
          <div className="rounded-[2.5rem] bg-brand-dark p-10 text-white shadow-2xl shadow-brand-dark/40 dark:bg-brand-orange">
            <TrendingUp size={32} className="mb-6 opacity-50" />
            <h4 className="mb-2 text-3xl font-black tracking-tighter font-heading uppercase leading-tight">
              Pipeline Velocity
            </h4>
            <p className="mb-8 text-xs font-medium text-white/70 font-body">
              Your team is publishing 12.4% more content than last month.
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

function ManagerStatCard({ title, value, icon: Icon, variant = "default" }: any) {
  return (
    <div className="rounded-3xl border border-brand-light-grey bg-white p-6 dark:border-brand-dark/20 dark:bg-white/5 shadow-lg shadow-brand-dark/2" >
      <div className={cn(
        "mb-4 flex h-10 w-10 items-center justify-center rounded-xl",
        variant === "orange" ? "bg-orange-100 text-orange-500" : 
        variant === "red" ? "bg-red-100 text-red-500" :
        variant === "green" ? "bg-green-100 text-green-500" :
        variant === "blue" ? "bg-blue-100 text-blue-500" :
        variant === "dark" ? "bg-brand-dark text-white dark:bg-brand-orange" : 
        "bg-brand-light-grey/50 text-brand-grey dark:bg-white/10"
      )}>
        <Icon size={18} />
      </div>
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-brand-grey font-heading opacity-70 mb-1">{title}</p>
      <h3 className="text-2xl font-black tracking-tighter text-brand-dark dark:text-brand-light font-heading">{value}</h3>
    </div>
  );
}

function trendingIcon(props: any) {
  return <TrendingUp {...props} />;
}
