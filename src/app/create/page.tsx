"use client";

import Sidebar from "@/components/common/Sidebar";
import Header from "@/components/common/Header";
import CreateContentForm from "@/components/content-manager/CreateContentForm";
import { useLayout } from "@/components/common/LayoutContext";
import { cn } from "@/lib/utils";

export default function CreateContentPage() {
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
          <div className="space-y-1">
            <h2 className="text-3xl font-semibold tracking-tight text-brand-dark dark:text-brand-light font-heading">
              Create New Content
            </h2>
            <p className="text-sm font-normal text-brand-grey font-body">
              Configure your source material and AI settings to generate platform-optimized drafts.
            </p>
          </div>

          <CreateContentForm />
        </div>
      </main>
    </div>
  );
}
