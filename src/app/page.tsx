"use client";

import Sidebar from "@/components/common/Sidebar";
import Header from "@/components/common/Header";
import DynamicDashboard from "@/components/dashboard/DynamicDashboard";
import { useLayout } from "@/components/common/LayoutContext";
import { useAuth } from "@/components/common/AuthContext";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { sidebarCollapsed } = useLayout();
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-brand-light dark:bg-brand-dark overflow-hidden">
      <Sidebar />
      
      <main className={cn(
        "flex-1 transition-all duration-500 ease-in-out",
        sidebarCollapsed ? "lg:pl-24" : "lg:pl-[20rem]"
      )}>
        <Header />
        
        <DynamicDashboard 
          role="content-manager" 
          subtitle={`Hello ${user?.displayName || "Content Creator"}. Your content pipeline is active. Review pending drafts and monitor your automated publishing schedule.`} 
        />
      </main>
    </div>
  );
}
