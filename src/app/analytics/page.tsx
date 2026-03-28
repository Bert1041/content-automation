"use client";

import Sidebar from "@/components/common/Sidebar";
import Header from "@/components/common/Header";
import AnalyticsContent from "@/components/content-manager/AnalyticsPageContent";
import { useLayout } from "@/components/common/LayoutContext";
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
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
          <div className="mb-10 space-y-1">
            <h2 className="text-3xl font-semibold tracking-tight text-brand-dark dark:text-brand-light font-heading">
              Content Analytics
            </h2>
            <p className="text-sm font-medium text-brand-grey font-body">
              Track your individual content production metrics and pipeline efficiency in real-time.
            </p>
          </div>
          
          <AnalyticsContent role="content-manager" />
        </div>
      </main>
    </div>
  );
}
