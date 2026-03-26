"use client";

import Sidebar from "@/components/common/Sidebar";
import Header from "@/components/common/Header";
import DraftEditor from "@/components/content-manager/DraftEditor";
import { useLayout } from "@/components/common/LayoutContext";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function EditDraftContent() {
  const { sidebarCollapsed } = useLayout();
  const searchParams = useSearchParams();
  const requestId = searchParams.get("requestId");

  return (
    <div className="flex min-h-screen bg-brand-light dark:bg-brand-dark overflow-hidden">
      <Sidebar />
      
      <main className={cn(
        "flex-1 transition-all duration-500 ease-in-out flex flex-col h-screen overflow-hidden bg-brand-light dark:bg-brand-dark",
        sidebarCollapsed ? "lg:pl-24" : "lg:pl-[20rem]"
      )}>
        {/* Header container - explicitly managed space to avoid overlaps */}
        <div className="flex-none pt-4 pb-2">
          <Header />
        </div>
        
        {/* Full screen editor container - with extra top margin to clear the floating header's visual space */}
        <div className="flex-1 min-h-0 bg-white dark:bg-brand-dark rounded-t-[2.5rem] shadow-2xl border-t border-brand-light-grey dark:border-brand-dark/20 ml-8 mr-8 overflow-hidden">
          <DraftEditor requestId={requestId || undefined} />
        </div>
      </main>
    </div>
  );
}

export default function EditDraftPage() {
  return (
    <Suspense fallback={<div>Loading editor...</div>}>
      <EditDraftContent />
    </Suspense>
  );
}
