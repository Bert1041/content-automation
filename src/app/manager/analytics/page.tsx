import Sidebar from "@/components/common/Sidebar";
import Header from "@/components/common/Header";
import SystemAnalyticsContent from "@/components/manager/SystemAnalyticsContent";

export default function SystemAnalyticsPage() {
  return (
    <div className="flex min-h-screen bg-brand-light dark:bg-brand-dark">
      <Sidebar role="manager" />
      
      <main className="flex-1 pl-[20rem] transition-all duration-300">
        <Header />
        
        <div className="mx-auto max-w-7xl p-10">
          <div className="mb-10 space-y-1">
            <h2 className="text-3xl font-black tracking-tighter text-brand-dark dark:text-brand-light font-heading uppercase">
              System Analytics
            </h2>
            <p className="text-sm font-medium text-brand-grey font-body">
              Monitor global platform performance, team efficiency, and publishing velocity.
            </p>
          </div>
          
          <SystemAnalyticsContent />
        </div>
      </main>
    </div>
  );
}
