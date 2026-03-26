import Sidebar from "@/components/common/Sidebar";
import Header from "@/components/common/Header";
import PlatformRulesContent from "@/components/manager/PlatformRulesContent";
import { Sparkles } from "lucide-react";

export default function PlatformRulesPage() {
  return (
    <div className="flex min-h-screen bg-brand-light dark:bg-brand-dark">
      <Sidebar role="manager" />
      
      <main className="flex-1 pl-[20rem] transition-all duration-300">
        <Header />
        
        <div className="mx-auto max-w-7xl p-6 lg:p-10">
          <div className="mb-10 flex flex-col items-start gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-orange/20 bg-brand-orange/5 px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-brand-orange">
               <Sparkles size={10} />
               Platform Tuning
            </div>
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-brand-dark dark:text-brand-light font-heading uppercase">
              Platform <span className="text-brand-orange text-bold">Rules</span>
            </h2>
            <p className="max-w-xl text-sm font-normal text-slate-500 dark:text-slate-400 font-body">
              Configure granular AI constraints and formatting rules for each publishing destination.
            </p>
          </div>
          
          <PlatformRulesContent />
        </div>
      </main>
    </div>
  );
}
