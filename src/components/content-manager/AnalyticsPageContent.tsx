"use client";

import { 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  FileText, 
  Linkedin,
  Twitter,
  Mail,
  ArrowUpRight,
  Activity,
  Loader2
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/common/AuthContext";
import { getAnalyticsSummary, AnalyticsSummary } from "@/lib/firebase/analytics";
import { cn } from "@/lib/utils";

export default function AnalyticsContent({ role = "content-manager" }: { role?: string }) {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [permissionError, setPermissionError] = useState(false);

  useEffect(() => {
    async function loadMetrics() {
      if (!user?.email) return;
      setIsLoading(true);
      setPermissionError(false);
      try {
        const data = await getAnalyticsSummary(user.email, role);
        setMetrics(data);
      } catch (err: any) {
        if (err.message === "PROMPTED_PERMISSION_DENIED") {
          setPermissionError(true);
        }
        console.error("Failed to load metrics:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadMetrics();
  }, [user?.email, role]);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-brand-orange" />
      </div>
    );
  }

  if (permissionError) {
    return (
      <div className="rounded-[2.5rem] border border-amber-200 bg-amber-50 p-10 dark:border-amber-500/20 dark:bg-amber-500/5 text-center space-y-4">
        <XCircle size={40} className="mx-auto text-amber-500" />
        <h3 className="text-xl font-bold text-amber-900 dark:text-amber-400 font-heading uppercase">Analytics Access Restricted</h3>
        <p className="text-sm text-amber-800/70 dark:text-amber-400/60 max-w-md mx-auto">
          To view system-wide analytics, your role requires specific Firestore read permissions. Please ensure your Security Rules are updated in the Firebase Console.
        </p>
      </div>
    );
  }

  // Use real metrics or fallbacks if not yet available
  const stats = metrics || {
    totalDrafts: 0,
    pendingReview: 0,
    approved: 0,
    rejected: 0,
    published: 0,
    platformDistribution: { linkedin: 0, twitter: 0, email: 0 }
  };

  // Calculate platform percentages
  const platformTotal = stats.platformDistribution.linkedin + stats.platformDistribution.twitter + stats.platformDistribution.email || 1;
  const getPct = (val: number) => Math.round((val / platformTotal) * 100);

  return (
    <div className="space-y-12 pb-20">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard title="Total Drafts" value={stats.totalDrafts.toString()} change="+0%" icon={FileText} />
        <MetricCard title="Pending Review" value={stats.pendingReview.toString()} change="+0%" icon={Clock} variant="orange" />
        <MetricCard title="Rejected Drafts" value={stats.rejected.toString()} change="+0%" icon={XCircle} />
        <MetricCard title="Approved Drafts" value={stats.approved.toString()} change="+0%" icon={CheckCircle2} />
        <MetricCard title="Published Content" value={stats.published.toString()} change="+0%" icon={Activity} variant="dark" />
      </div>

      {/* Charts Section */}
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Drafts Over Time (Still mocked for now as we don't have historical aggregation yet) */}
        <div className="rounded-[2.5rem] border border-brand-light-grey bg-white p-10 shadow-xl shadow-brand-dark/5 dark:border-brand-dark/20 dark:bg-white/5">
          <div className="mb-8 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-bold tracking-tight text-brand-dark dark:text-brand-light font-heading uppercase">
                Drafts Over Time
              </h3>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400 font-body uppercase tracking-wider">Growth per week</p>
            </div>
            <TrendingUp size={24} className="text-brand-orange" />
          </div>
          <div className="relative h-64 w-full">
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
          </div>
        </div>

        {/* Platform & Status Breakdown Grid */}
        <div className="grid gap-8">
          {/* Status Breakdown */}
          <div className="rounded-[2.5rem] border border-brand-light-grey bg-white p-10 shadow-xl shadow-brand-dark/5 dark:border-brand-dark/20 dark:bg-white/5">
             <h3 className="mb-6 text-xl font-semibold tracking-tight text-brand-dark dark:text-brand-light font-heading uppercase">
                Content Status
              </h3>
              <div className="space-y-4">
                <StatusRow label="Published" percentage={Math.round((stats.published / (stats.totalDrafts || 1)) * 100)} color="bg-green-500" />
                <StatusRow label="Approved" percentage={Math.round((stats.approved / (stats.totalDrafts || 1)) * 100)} color="bg-brand-orange" />
                <StatusRow label="Pending" percentage={Math.round((stats.pendingReview / (stats.totalDrafts || 1)) * 100)} color="bg-brand-grey" />
                <StatusRow label="Rejected" percentage={Math.round((stats.rejected / (stats.totalDrafts || 1)) * 100)} color="bg-red-500" />
              </div>
          </div>

          {/* Platform Distribution */}
          <div className="rounded-[2.5rem] border border-brand-light-grey bg-white p-10 shadow-xl shadow-brand-dark/5 dark:border-brand-dark/20 dark:bg-white/5">
             <h3 className="mb-6 text-xl font-semibold tracking-tight text-brand-dark dark:text-brand-light font-heading uppercase">
                Platform Distribution
              </h3>
              <div className="flex items-center justify-between px-4">
                <PlatformDot icon={Linkedin} label="LinkedIn" value={`${getPct(stats.platformDistribution.linkedin)}%`} color="bg-brand-dark dark:bg-brand-orange" />
                <PlatformDot icon={Twitter} label="X (Twitter)" value={`${getPct(stats.platformDistribution.twitter)}%`} color="bg-brand-grey" />
                <PlatformDot icon={Mail} label="Email" value={`${getPct(stats.platformDistribution.email)}%`} color="bg-brand-light-grey" />
              </div>
          </div>
        </div>
      </div>

      {/* Recent Publishing Activity */}
      <section className="rounded-[2.5rem] border border-brand-light-grey bg-white p-10 shadow-xl shadow-brand-dark/5 dark:border-brand-dark/20 dark:bg-white/5">
        <div className="mb-10 flex items-center justify-between">
          <h3 className="text-2xl font-semibold tracking-tight text-brand-dark dark:text-brand-light font-heading uppercase">
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

function MetricCard({ title, value, change, icon: Icon, variant = "default" }: { title: string; value: string; change: string; icon: React.ElementType; variant?: string }) {
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
        <span className="text-[10px] font-bold text-green-600 dark:text-green-500 font-heading">{change}</span>
      </div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 font-heading mb-1">{title}</p>
      <h3 className="text-3xl font-semibold tracking-tight text-brand-dark dark:text-brand-light font-heading">{value}</h3>
    </div>
  );
}

function StatusRow({ label, percentage, color }: { label: string; percentage: number; color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider font-heading">
        <span className="text-brand-dark dark:text-brand-light">{label}</span>
        <span className="text-slate-600 dark:text-slate-400">{percentage}%</span>
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

function PlatformDot({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg", color)}>
        <Icon size={24} />
      </div>
      <div className="text-center">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 font-heading mb-1">{label}</p>
        <p className="text-sm font-semibold text-brand-dark dark:text-brand-light font-heading">{value}</p>
      </div>
    </div>
  );
}

function ActivityItem({ date, platform, title }: { date: string; platform: string; title: string }) {
  const Icon = platform === "linkedin" ? Linkedin : platform === "twitter" ? Twitter : Mail;
  return (
    <div className="group flex items-center justify-between rounded-2xl border border-brand-light-grey p-5 transition-all hover:bg-brand-light-grey dark:border-brand-dark/20 dark:hover:bg-white/5">
      <div className="flex items-center gap-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light-grey/50 text-brand-grey dark:bg-white/10 dark:text-brand-light">
          <Icon size={20} />
        </div>
        <div className="space-y-1">
          <p className="max-w-md text-sm font-bold text-brand-dark dark:text-brand-light font-heading line-clamp-1">{title}</p>
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-500 font-heading">{date}</p>
        </div>
      </div>
      <button className="flex h-10 w-10 items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white dark:hover:bg-brand-dark border border-brand-light-grey dark:border-brand-dark/40 shadow-sm">
        <ArrowUpRight size={18} className="text-brand-orange" />
      </button>
    </div>
  );
}
