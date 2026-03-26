"use client";

import Sidebar from "@/components/common/Sidebar";
import Header from "@/components/common/Header";
import RevisionPageContent from "@/components/content-manager/RevisionPageContent";
import { useLayout } from "@/components/common/LayoutContext";
import { cn } from "@/lib/utils";

export default function RevisionPage() {
  const { sidebarCollapsed } = useLayout();
  return (
    <div className="flex min-h-screen bg-brand-light dark:bg-brand-dark overflow-hidden">
      <Sidebar />
      
      <main className={cn(
        "flex-1 transition-all duration-500 ease-in-out",
        sidebarCollapsed ? "lg:pl-24" : "lg:pl-[20rem]"
      )}>
        <Header />
        
        <div className="mx-auto max-w-7xl p-10">
          <RevisionPageContent />
        </div>
      </main>
    </div>
  );
}
