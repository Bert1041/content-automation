"use client";

import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  FileText, 
  Calendar,
  Linkedin,
  Twitter,
  Mail,
  ArrowUpRight,
  User,
  Activity
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AnalyticsContent() {
  return (
    <div className="space-y-12 pb-20">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard title="Drafts Created" value="124" change="+12%" icon={FileText} />
        <MetricCard title="Pending Review" value="8" change="-2%" icon={Clock} variant="orange" />
        <MetricCard title="Rejected Drafts" value="2" change="-5%" icon={XCircle} />
        <MetricCard title="Approved Drafts" value="38" change="+18%" icon={CheckCircle2} />
        <MetricCard title="Published Content" value="148" change="+24%" icon={Activity} variant="dark" />
      </div>

      {/* Charts Section */}
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Drafts Over Time (Mocked SVG Chart) */}
        <div className="rounded-[2.5rem] border border-brand-light-grey bg-white p-10 shadow-xl shadow-brand-dark/5 dark:border-brand-dark/20 dark:bg-white/5">
          <div className="mb-8 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-black tracking-tighter text-brand-dark dark:text-brand-light font-heading uppercase">
                Drafts Over Time
              </h3>
              <p className="text-xs font-bold text-brand-grey font-body uppercase tracking-widest">Growth per week</p>
            </div>
            <TrendingUp size={24} className="text-brand-orange" />
          </div>
          <div className="relative h-64 w-full">
            {/* Simple SVG Chart Placeholder */}
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path 
                d="M 0 80 Q 20 70 40 75 T 60 50 T 80 40 T 100 20" 
                fill="none" 
                stroke="#d97757" 
                strokeWidth="2" 
                className="dark:stroke-brand-orange"
              />
              <path 
                d="M 0 80 Q 20 70 40 75 T 60 50 T 80 40 T 100 20 L 100 100 L 0 100 Z" 
                fill="url(#gradient)" 
                className="opacity-10"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#d97757" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute bottom-0 flex w-full justify-between pt-4 text-[10px] font-bold text-brand-grey font-heading uppercase tracking-widest">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>

        {/* Platform & Status Breakdown Grid */}
        <div className="grid gap-8">
          {/* Status Breakdown */}
          <div className="rounded-[2.5rem] border border-brand-light-grey bg-white p-10 shadow-xl shadow-brand-dark/5 dark:border-brand-dark/20 dark:bg-white/5">
             <h3 className="mb-6 text-xl font-black tracking-tighter text-brand-dark dark:text-brand-light font-heading uppercase">
                Content Status
              </h3>
              <div className="space-y-4">
                <StatusRow label="Published" percentage={65} color="bg-green-500" />
                <StatusRow label="Approved" percentage={15} color="bg-brand-orange" />
                <StatusRow label="Pending" percentage={10} color="bg-brand-grey" />
                <StatusRow label="Rejected" percentage={10} color="bg-red-500" />
              </div>
          </div>

          {/* Platform Distribution */}
          <div className="rounded-[2.5rem] border border-brand-light-grey bg-white p-10 shadow-xl shadow-brand-dark/5 dark:border-brand-dark/20 dark:bg-white/5">
             <h3 className="mb-6 text-xl font-black tracking-tighter text-brand-dark dark:text-brand-light font-heading uppercase">
                Platform Distribution
              </h3>
              <div className="flex items-center justify-between">
                <PlatformDot icon={Linkedin} label="LinkedIn" value="45%" color="bg-brand-dark dark:bg-brand-orange" />
                <PlatformDot icon={Twitter} label="X (Twitter)" value="30%" color="bg-brand-grey" />
                <PlatformDot icon={Mail} label="Email" value="25%" color="bg-brand-light-grey" />
              </div>
          </div>
        </div>
      </div>

      {/* Recent Publishing Activity */}
      <section className="rounded-[2.5rem] border border-brand-light-grey bg-white p-10 shadow-xl shadow-brand-dark/5 dark:border-brand-dark/20 dark:bg-white/5">
        <div className="mb-10 flex items-center justify-between">
          <h3 className="text-2xl font-black tracking-tighter text-brand-dark dark:text-brand-light font-heading uppercase">
            Recent Publishing Activity
          </h3>
          <button className="text-xs font-bold uppercase tracking-widest text-brand-orange hover:underline underline-offset-4">
            Full History
          </button>
        </div>

        <div className="space-y-4">
          <ActivityItem date="Today, 10:24 AM" platform="linkedin" title="Why Founders need AI to scale marketing in 2026" />
          <ActivityItem date="Yesterday, 4:15 PM" platform="email" title="N8N Workflows for advanced content creators" />
          <ActivityItem date="Oct 20, 2026" platform="twitter" title="10 tips for SEO optimization with LLMs" />
        </div>
      </section>
    </div>
  );
}

function MetricCard({ title, value, change, icon: Icon, variant = "default" }: any) {
  return (
    <div className="rounded-3xl border border-brand-light-grey bg-white p-6 dark:border-brand-dark/20 dark:bg-white/5 shadow-lg shadow-brand-dark/2" >
      <div className="mb-4 flex items-center justify-between">
        <div className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl",
          variant === "orange" ? "bg-brand-orange/10 text-brand-orange" : 
          variant === "dark" ? "bg-brand-dark text-white dark:bg-brand-orange" : 
          "bg-brand-light-grey/50 text-brand-grey dark:bg-white/10"
        )}>
          <Icon size={20} />
        </div>
        <span className="text-[10px] font-black text-green-500 font-heading">{change}</span>
      </div>
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-brand-grey font-heading opacity-70 mb-1">{title}</p>
      <h3 className="text-3xl font-black tracking-tighter text-brand-dark dark:text-brand-light font-heading">{value}</h3>
    </div>
  );
}

function StatusRow({ label, percentage, color }: any) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest font-heading">
        <span className="text-brand-dark dark:text-brand-light">{label}</span>
        <span className="text-brand-grey">{percentage}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-brand-light-grey dark:bg-brand-dark mx-auto overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all duration-1000", color)} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function PlatformDot({ icon: Icon, label, value, color }: any) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg", color)}>
        <Icon size={24} />
      </div>
      <div className="text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-brand-grey font-heading mb-1">{label}</p>
        <p className="text-sm font-black text-brand-dark dark:text-brand-light font-heading">{value}</p>
      </div>
    </div>
  );
}

function ActivityItem({ date, platform, title }: any) {
  const Icon = platform === "linkedin" ? Linkedin : platform === "twitter" ? Twitter : Mail;
  return (
    <div className="group flex items-center justify-between rounded-2xl border border-brand-light-grey p-5 transition-all hover:bg-brand-light-grey dark:border-brand-dark/20 dark:hover:bg-white/5">
      <div className="flex items-center gap-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light-grey/50 text-brand-grey dark:bg-white/10 dark:text-brand-light">
          <Icon size={20} />
        </div>
        <div className="space-y-1">
          <p className="max-w-md text-sm font-bold text-brand-dark dark:text-brand-light font-heading line-clamp-1">{title}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-grey font-heading">{date}</p>
        </div>
      </div>
      <button className="flex h-10 w-10 items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white dark:hover:bg-brand-dark border border-brand-light-grey dark:border-brand-dark/40 shadow-sm">
        <ArrowUpRight size={18} className="text-brand-orange" />
      </button>
    </div>
  );
}
