import Sidebar from "@/components/common/Sidebar";
import Header from "@/components/common/Header";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-brand-light dark:bg-brand-dark">
      <Sidebar role="content-manager" />
      
      <main className="flex-1 pl-[20rem] transition-all duration-300">
        <Header />
        
        <div className="mx-auto max-w-7xl p-10 space-y-10">
          <div className="flex items-center gap-3">
             <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-accent/10 text-brand-accent shadow-sm">
                <Settings size={22} strokeWidth={1.5} />
             </div>
             <h2 className="text-3xl font-semibold tracking-tight text-brand-dark dark:text-brand-light font-heading">
               Settings
             </h2>
          </div>
          <div className="glass-card p-10">
            <p className="text-sm font-medium text-brand-grey dark:text-slate-400 font-body">Settings configuration coming soon...</p>
          </div>
        </div>
      </main>
    </div>
  );
}
