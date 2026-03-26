"use client";

import { 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Files,
  Zap,
  Linkedin,
  Twitter,
  Mail,
  ChevronUp,
  Award,
  LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SystemAnalyticsContent() {
  return (
    <div className="space-y-12 pb-20">
      {/* 1. Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
         <MetricCard title="Total Created" value="842" trend="+12%" positive={true} icon={Files} />
         <MetricCard title="Pending Review" value="14" trend="-4%" positive={true} icon={Clock} />
         <MetricCard title="Approval Rate" value="94.2%" trend="+2%" positive={true} icon={CheckCircle2} />
         <MetricCard title="Avg. Published" value="18" trend="+1.5%" positive={true} icon={Zap} />
         <MetricCard title="Rejections" value="8" trend="+1%" positive={false} icon={XCircle} />
      </div>

      {/* 2. Primary Charts Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
         <div className="rounded-[2.5rem] border border-brand-light-grey bg-white p-10 shadow-xl shadow-brand-dark/5 dark:border-brand-dark/20 dark:bg-white/5">
            <div className="mb-10 flex items-center justify-between">
               <h3 className="text-xl font-semibold uppercase tracking-tight font-heading text-brand-dark dark:text-brand-light">Content Velocity</h3>
               <select className="bg-transparent text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 outline-none">
                  <Last7Days />
               </select>
            </div>
            {/* Content Velocity SVG Chart */}
            <div className="relative h-64 w-full">
               <svg viewBox="0 0 400 100" className="h-full w-full overflow-visible drop-shadow-2xl">
                  <defs>
                     <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#d97757" />
                        <stop offset="50%" stopColor="#fca35d" />
                        <stop offset="100%" stopColor="#141413" />
                     </linearGradient>
                     <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                     </filter>
                  </defs>
                  {/* Grid Lines */}
                  {[0, 25, 50, 75, 100].map(val => (
                    <line key={val} x1="0" y1={val} x2="400" y2={val} stroke="currentColor" strokeOpacity="0.05" />
                  ))}
                  <path 
                     d="M0,80 Q30,85 60,60 T120,40 T180,70 T240,30 T300,50 T360,20 T400,40" 
                     fill="none" 
                     stroke="url(#gradient)" 
                     strokeWidth="4" 
                     strokeLinecap="round"
                     filter="url(#glow)"
                  />
                  {/* Data Points */}
                  {[60, 120, 240, 360].map((x, i) => (
                    <circle key={i} cx={x} cy={i % 2 === 0 ? 60 : 30} r="4" fill="white" stroke="#d97757" strokeWidth="2" />
                  ))}
               </svg>
               <div className="absolute bottom-0 left-0 flex w-full justify-between pt-6 border-t border-brand-light-grey dark:border-brand-dark/20 text-slate-600 dark:text-slate-500">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                    <span key={d} className="text-[9px] font-bold uppercase tracking-wider">{d}</span>
                  ))}
               </div>
            </div>
         </div>

         <div className="rounded-[2.5rem] border border-brand-light-grey bg-white p-10 shadow-xl shadow-brand-dark/5 dark:border-brand-dark/20 dark:bg-white/5">
            <h3 className="mb-10 text-xl font-semibold uppercase tracking-tight font-heading text-brand-dark dark:text-brand-light">Stage Throughput</h3>
            <div className="space-y-6">
               <ThroughputRow label="Creation -> Draft" percentage={98} color="bg-brand-dark" />
               <ThroughputRow label="Draft -> Review" percentage={76} color="bg-brand-orange" />
               <ThroughputRow label="Review -> Approval" percentage={92} color="bg-green-500" />
               <ThroughputRow label="Approval -> Published" percentage={100} color="bg-blue-500" />
            </div>
         </div>
      </div>

      {/* 3. Competitive & Categorical Insights */}
      <div className="grid gap-8 lg:grid-cols-3">
         {/* Creator Leaderboard */}
         <div className="lg:col-span-2 rounded-[2.5rem] border border-brand-light-grey bg-white p-10 shadow-xl shadow-brand-dark/5 dark:border-brand-dark/20 dark:bg-white/5">
            <div className="mb-10 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <Award size={24} className="text-brand-accent" />
                  <h3 className="text-xl font-semibold uppercase tracking-tight font-heading text-brand-dark dark:text-brand-light">Top Content Creators</h3>
               </div>
               <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Based on Approved Content</span>
            </div>
            <div className="space-y-4">
               <CreatorRow rank={1} name="Julian Van" posts={142} points="9.8" avatar="J" />
               <CreatorRow rank={2} name="Elena Rossi" posts={128} points="9.4" avatar="E" />
               <CreatorRow rank={3} name="Marcus K." posts={94} points="8.9" avatar="M" />
            </div>
         </div>

         {/* Platform Share */}
         <div className="rounded-[2.5rem] border border-brand-light-grey bg-white p-10 shadow-xl shadow-brand-dark/5 dark:border-brand-dark/20 dark:bg-white/5">
            <h3 className="mb-10 text-xl font-semibold uppercase tracking-tight font-heading text-brand-dark dark:text-brand-light">Platform Share</h3>
            <div className="space-y-8 pt-4">
               <PlatformShareRow platform="LinkedIn" percentage={42} icon={Linkedin} color="text-[#0077b5]" />
               <PlatformShareRow platform="X (Twitter)" percentage={35} icon={Twitter} color="text-[#1DA1F2]" />
               <PlatformShareRow platform="Newsletter" percentage={23} icon={Mail} color="text-brand-orange" />
            </div>
         </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  trend: string;
  positive: boolean;
  icon: LucideIcon;
}

function MetricCard({ title, value, trend, positive, icon: Icon }: MetricCardProps) {
  return (
    <div className="rounded-3xl border border-brand-light-grey bg-white p-6 dark:border-brand-dark/20 dark:bg-white/5">
       <div className="mb-4 flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light dark:bg-white/10 text-brand-grey">
             <Icon size={18} />
          </div>
          <div className={cn(
             "flex items-center gap-1 text-[10px] font-semibold",
             positive ? "text-green-500" : "text-red-500"
          )}>
             {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
             {trend}
          </div>
       </div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 font-heading mb-1">{title}</p>
       <h3 className="text-2xl font-semibold tracking-tight text-brand-dark dark:text-brand-light font-heading">{value}</h3>
    </div>
  );
}

function ThroughputRow({ label, percentage, color }: { label: string, percentage: number, color: string }) {
  return (
    <div className="space-y-3">
       <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          <span>{label}</span>
          <span>{percentage}%</span>
       </div>
       <div className="h-2 w-full rounded-full bg-brand-light dark:bg-white/5 overflow-hidden">
          <div className={cn("h-full rounded-full transition-all duration-1000", color)} style={{ width: `${percentage}%` }} />
       </div>
    </div>
  );
}

interface CreatorRowProps {
  rank: number;
  name: string;
  posts: number;
  points: string;
  avatar: string;
}

function CreatorRow({ rank, name, posts, points, avatar }: CreatorRowProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-transparent p-4 hover:border-brand-light-grey dark:hover:border-brand-dark/20 transition-all">
       <div className="flex items-center gap-4">
          <span className="text-xs font-black text-brand-grey w-4">{rank}</span>
          <div className="h-10 w-10 rounded-full bg-brand-light-grey flex items-center justify-center text-xs font-semibold text-slate-500 dark:bg-white/10 dark:text-brand-light">
             {avatar}
          </div>
          <div>
             <p className="text-sm font-bold text-brand-dark dark:text-brand-light font-heading">{name}</p>
             <p className="text-[10px] font-bold text-slate-600 dark:text-brand-light-grey/40 uppercase tracking-wider font-body">{posts} Approved Posts</p>
          </div>
       </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
             <p className="text-sm font-bold text-brand-dark dark:text-brand-light font-heading">{points}</p>
             <p className="text-[9px] font-bold text-slate-500 dark:text-brand-light-grey/30 uppercase tracking-wider">Efficiency Index</p>
          </div>
          <ChevronUp size={16} className="text-green-500" />
       </div>
    </div>
  );
}

interface PlatformShareRowProps {
  platform: string;
  percentage: number;
  icon: LucideIcon;
  color: string;
}

function PlatformShareRow({ platform, percentage, icon: Icon, color }: PlatformShareRowProps) {
  return (
    <div className="flex items-center gap-4">
       <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light dark:bg-white/10", color)}>
          <Icon size={20} />
       </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider">
             <span className="text-brand-dark dark:text-brand-light">{platform}</span>
             <span className="text-slate-600 dark:text-slate-400">{percentage}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-brand-light dark:bg-white/5">
             <div className="h-full rounded-full bg-brand-dark dark:bg-brand-orange" style={{ width: `${percentage}%` }} />
          </div>
       </div>
    </div>
  );
}

function Last7Days() {
   return (
      <option>Last 7 Days</option>
   );
}
