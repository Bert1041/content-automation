import Sidebar from "@/components/common/Sidebar";
import Header from "@/components/common/Header";
import { Settings } from "lucide-react";

export default function ManagerSettingsPage() {
  return (
    <div className="flex min-h-screen bg-brand-light dark:bg-brand-dark">
      <Sidebar role="manager" />
      
      <main className="flex-1 lg:pl-[20rem] transition-all duration-300">
        <Header />
        
        <div className="mx-auto max-w-7xl p-6 lg:p-10 space-y-10">
          <div className="flex items-center gap-4">
             <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-dark text-white dark:bg-brand-orange shadow-lg ring-8 ring-brand-orange/5">
                <Settings size={22} strokeWidth={1.5} />
             </div>
             <div>
                <h2 className="text-3xl font-semibold tracking-tight text-brand-dark dark:text-brand-light font-heading">
                  Manager Settings
                </h2>
                <p className="text-xs text-brand-grey font-body uppercase tracking-widest opacity-70">Platform & API Configuration</p>
             </div>
          </div>
          <div className="rounded-[2rem] border border-brand-light-grey bg-white p-10 shadow-xl shadow-brand-dark/5 dark:border-brand-dark/20 dark:bg-white/5">
            <p className="text-sm font-normal text-brand-grey font-body opacity-80">Manager settings configuration coming soon...</p>
          </div>
        </div>
      </main>
    </div>
  );
}
