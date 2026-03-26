"use client";

import Sidebar from "@/components/common/Sidebar";
import Header from "@/components/common/Header";
import StatCard from "@/components/common/StatCard";
import RecentContentTable from "@/components/content-manager/RecentContentTable";
import WelcomeBanner from "@/components/common/WelcomeBanner";
import { 
  Plus, 
  FileText, 
  Clock, 
  XCircle, 
  Calendar,
  CheckCircle2
} from "lucide-react";
import { useLayout } from "@/components/common/LayoutContext";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { sidebarCollapsed } = useLayout();
  return (
    <div className="flex min-h-screen bg-brand-light dark:bg-brand-dark overflow-hidden">
      <Sidebar />
      
      <main className={cn(
        "flex-1 transition-all duration-500 ease-in-out",
        sidebarCollapsed ? "lg:pl-24" : "lg:pl-[20rem]"
      )}>
        <Header />
        
        <div className="mx-auto max-w-7xl p-6 lg:p-10">
          <div className="mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <WelcomeBanner subtitle="Your content pipeline is active. Review pending drafts and monitor your automated publishing schedule." />
            
            <button className="group relative flex items-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-brand-accent to-brand-accent-light px-5 py-3.5 font-medium text-white shadow-lg shadow-brand-accent/20 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-brand-accent/30">
              <Plus size={18} className="transition-transform group-hover:rotate-90" strokeWidth={2} />
              <span className="text-[13px] font-heading tracking-wide">Generate Content</span>
              {/* Soft Shine */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </button>
          </div>
          
          <div className="space-y-12">
            {/* Stats Cards Grid - Glassy Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
              <StatCard title="Total Drafts" value="24" icon={FileText} />
              <StatCard title="Review Queue" value="8" icon={Clock} variant="orange" />
              <StatCard title="Rejected" value="2" icon={XCircle} />
              <StatCard title="Scheduled" value="12" icon={Calendar} />
              <StatCard title="Completed" value="148" icon={CheckCircle2} variant="dark" />
            </div>

            {/* Recent Content Table Section */}
            <RecentContentTable />
          </div>
        </div>
      </main>
    </div>
  );
}
