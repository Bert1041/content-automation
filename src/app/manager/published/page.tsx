import Sidebar from "@/components/common/Sidebar";
import Header from "@/components/common/Header";

export default function PublishedContentPage() {
  return (
    <div className="flex min-h-screen bg-brand-light dark:bg-brand-dark">
      <Sidebar role="manager" />
      
      <main className="flex-1 lg:pl-[20rem] transition-all duration-300">
        <Header />
        
        <div className="mx-auto max-w-7xl p-6 lg:p-10">
          <div className="mb-10 space-y-1">
            <h2 className="text-3xl font-semibold tracking-tight text-brand-dark dark:text-brand-light font-heading">
              Published Content
            </h2>
            <p className="text-sm font-normal text-slate-600 dark:text-brand-light-grey/60 font-body opacity-90">
              Archive and performance tracking for all content published through Fetemi.
            </p>
          </div>
          
          <div className="flex h-96 items-center justify-center rounded-[2rem] border-2 border-dashed border-brand-light-grey dark:border-brand-dark/20 bg-white/50 dark:bg-white/5">
             <div className="text-center space-y-2">
                <p className="text-xl font-semibold tracking-tight text-brand-grey font-heading">Content Archive Coming Soon</p>
                <p className="text-xs font-normal text-brand-grey font-body opacity-60">Real-time performance metrics for published posts are being integrated.</p>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
