"use client";

import Sidebar from "@/components/common/Sidebar";
import Header from "@/components/common/Header";
import ManagerReviewDetail from "@/components/manager/ManagerReviewDetail";
import { useLayout } from "@/components/common/LayoutContext";
import { cn } from "@/lib/utils";

export default function ReviewPage() {
  const { sidebarCollapsed } = useLayout();

  return (
    <div className="flex min-h-screen bg-brand-light dark:bg-brand-dark">
      <Sidebar role="manager" />
      
      <main className={cn(
        "flex-1 transition-all duration-300",
        sidebarCollapsed ? "lg:pl-24" : "lg:pl-[20rem]"
      )}>
        <Header />
        
        <div className="mx-auto max-w-7xl p-6 lg:p-10">
          <ManagerReviewDetail />
        </div>
      </main>
    </div>
  );
}
