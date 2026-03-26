"use client";

import Sidebar from "@/components/common/Sidebar";
import Header from "@/components/common/Header";
import DraftsTable from "@/components/content-manager/DraftsTable";
import { useLayout } from "@/components/common/LayoutContext";
import { cn } from "@/lib/utils";

export default function DraftsPage() {
  const { sidebarCollapsed } = useLayout();
  return (
    <div className="flex min-h-screen bg-brand-light dark:bg-brand-dark overflow-hidden">
      <Sidebar />
      
      <main className={cn(
        "flex-1 transition-all duration-500 ease-in-out",
        sidebarCollapsed ? "lg:pl-24" : "lg:pl-[20rem]"
      )}>
        <Header />
        
        <div className="mx-auto max-w-7xl p-6 lg:p-10 space-y-10">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-3xl font-semibold tracking-tight text-brand-dark dark:text-brand-light font-heading">
                My Drafts
              </h2>
              <p className="text-sm font-normal text-brand-grey font-body">
                Review and manage your generated content drafts across all platforms.
              </p>
            </div>
          </div>

          <DraftsTable />
        </div>
      </main>
    </div>
  );
}
