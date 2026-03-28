"use client";

import { useState, useEffect, useMemo } from "react";
import StatCard from "@/components/common/StatCard";
import RecentContentTable from "@/components/content-manager/RecentContentTable";
import WelcomeBanner from "@/components/common/WelcomeBanner";
import { 
  Plus, 
  FileText, 
  Clock, 
  XCircle, 
  Calendar,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { useAuth } from "@/components/common/AuthContext";
import { type FirestoreDraft, fetchDraftsFromFirestore } from "@/lib/firebase/drafts";
import { groupDraftsByRequest, cn } from "@/lib/utils";
import Link from "next/link";

interface DynamicDashboardProps {
  role: "manager" | "content-manager";
  subtitle: string;
}

export default function DynamicDashboard({ role, subtitle }: DynamicDashboardProps) {
  const { user } = useAuth();
  const [drafts, setDrafts] = useState<FirestoreDraft[]>([]);
  const [publishedCount, setPublishedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [permissionError, setPermissionError] = useState(false);

  useEffect(() => {
    if (!user?.email) {
      if (user === null) setIsLoading(false);
      return; 
    }
    
    async function getDashboardData() {
      setIsLoading(true);
      setPermissionError(false);
      try {
        const { collection, query, where, getCountFromServer } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase/config");
        
        const isManager = role === "manager";
        
        // Parallel fetch for drafts and published counts
        const fetchDrafts = fetchDraftsFromFirestore(user!.email!, role);
        
        const publishedRef = collection(db, "published_content");
        const publishedQuery = isManager 
          ? query(publishedRef) 
          : query(publishedRef, where("authorEmail", "==", user!.email));
        
        const [draftData, publishedSnap] = await Promise.all([
          fetchDrafts,
          getCountFromServer(publishedQuery)
        ]);

        setDrafts(draftData || []);
        setPublishedCount(publishedSnap.data().count || 0);
      } catch (err: any) {
        if (err.message === "PROMPTED_PERMISSION_DENIED") {
          setPermissionError(true);
        }
        console.error("Dashboard data fetch failed:", err);
      } finally {
        setIsLoading(false);
      }
    }
    getDashboardData();
  }, [user, user?.email, role]);

  const stats = useMemo(() => {
    const grouped = groupDraftsByRequest(drafts);
    return {
      total: grouped.length,
      pending: drafts.filter(d => {
        const s = d.status?.toLowerCase();
        return s === "pending review" || s === "review" || s === "pending";
      }).length,
      rejected: drafts.filter(d => {
        const s = d.status?.toLowerCase();
        return s === "rejected" || s === "reject";
      }).length,
      scheduled: drafts.filter(d => d.status?.toLowerCase() === "scheduled").length,
      completed: Math.max(publishedCount, drafts.filter(d => {
        const s = d.status?.toLowerCase();
        return s === "published" || s === "approved" || s === "completed";
      }).length),
      recentGroups: grouped.slice(0, 5)
    };
  }, [drafts, publishedCount]);

  return (
    <div className="mx-auto max-w-7xl p-6 lg:p-10">
      <div className="mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <WelcomeBanner subtitle={subtitle} />
        
        {role === "content-manager" && (
          <Link href="/create">
            <button className="group relative flex items-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-brand-accent to-brand-accent-light px-5 py-3.5 font-medium text-white shadow-lg shadow-brand-accent/20 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-brand-accent/30">
              <Plus size={18} className="transition-transform group-hover:rotate-90" strokeWidth={2} />
              <span className="text-[13px] font-heading tracking-wide">Generate Content</span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </button>
          </Link>
        )}
      </div>
      
      {permissionError && (
        <div className="mb-10 rounded-[2.5rem] border border-amber-200 bg-amber-50 p-8 dark:border-amber-500/20 dark:bg-amber-500/5 shadow-xl shadow-amber-900/5 backdrop-blur-sm animate-in fade-in slide-in-from-top-4">
          <div className="flex items-start gap-5 text-amber-800 dark:text-amber-400">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-500/10">
              <XCircle size={24} className="text-amber-600 dark:text-amber-500" />
            </div>
            <div className="space-y-1.5 pt-1">
              <p className="text-sm font-bold uppercase tracking-widest font-heading">
                {role === "manager" ? "System Access Required: Update Firestore Rules" : "Draft Pipeline Access Restricted"}
              </p>
              <p className="text-xs font-medium leading-relaxed opacity-80 max-w-2xl">
                {role === "manager" 
                  ? "Your Manager role requires global read permissions to synchronize the shared content pipeline. Please apply the latest Security Rules in your Firebase Console to enable full oversight." 
                  : "We encountered an issue accessing your personal content drafts. This usually happens if your session has expired or your account permissions need synchronization. Please try refreshing the page or logging back in."}
              </p>
              {role === "manager" && (
                <div className="mt-4 flex gap-4">
                   <button className="px-4 py-2 rounded-xl bg-amber-600 text-white text-[11px] font-bold hover:bg-amber-700 transition-colors shadow-lg shadow-amber-900/20">
                     Copy Security Rules
                   </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-12">
        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard title="Total Docs" value={isLoading ? "..." : stats.total.toString()} icon={FileText} />
          <StatCard title="Review Queue" value={isLoading ? "..." : stats.pending.toString()} icon={Clock} variant="orange" />
          <StatCard title="Rejected" value={isLoading ? "..." : stats.rejected.toString()} icon={XCircle} />
          <StatCard title="Scheduled" value={isLoading ? "..." : stats.scheduled.toString()} icon={Calendar} />
          <StatCard title="Completed" value={isLoading ? "..." : stats.completed.toString()} icon={CheckCircle2} variant="dark" />
        </div>

        {/* Recent Content Table Section */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-white/5 rounded-[2.5rem] border border-brand-light-grey/50 dark:border-white/10">
            <Loader2 size={40} className="animate-spin text-brand-accent mb-4" />
            <p className="text-sm font-medium text-brand-grey">Synchronizing content...</p>
          </div>
        ) : (
          <RecentContentTable items={stats.recentGroups} />
        )}
      </div>
    </div>
  );
}
