"use client";

import Sidebar from "@/components/common/Sidebar";
import Header from "@/components/common/Header";
import DynamicDashboard from "@/components/dashboard/DynamicDashboard";
import { useLayout } from "@/components/common/LayoutContext";
import { cn } from "@/lib/utils";

export default function ManagerDashboard() {
  const { sidebarCollapsed } = useLayout();

  return (
    <div className="flex min-h-screen bg-brand-light dark:bg-brand-dark overflow-hidden">
      <Sidebar role="manager" />
      
      <main className={cn(
        "flex-1 transition-all duration-500 ease-in-out",
        sidebarCollapsed ? "lg:pl-24" : "lg:pl-[20rem]"
      )}>
        <Header />
        
        <DynamicDashboard 
          role="manager" 
          subtitle="Oversee the entire content pipeline, manage team performance, and optimize publishing strategy." 
        />
      </main>
    </div>
  );
}
