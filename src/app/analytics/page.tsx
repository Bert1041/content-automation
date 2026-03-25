import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AnalyticsContent from "@/components/AnalyticsPageContent";

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen bg-brand-light dark:bg-brand-dark">
      <Sidebar />
      
      <main className="flex-1 pl-64 transition-all duration-300">
        <Header />
        
        <div className="mx-auto max-w-7xl p-10">
          <div className="mb-10 space-y-1">
            <h2 className="text-3xl font-black tracking-tighter text-brand-dark dark:text-brand-light font-heading uppercase">
              Analytics Dashboard
            </h2>
            <p className="text-sm font-medium text-brand-grey font-body">
              Track your content production metrics and pipeline efficiency in real-time.
            </p>
          </div>
          
          <AnalyticsContent />
        </div>
      </main>
    </div>
  );
}
