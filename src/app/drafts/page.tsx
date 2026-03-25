import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import DraftsTable from "@/components/DraftsTable";

export default function DraftsPage() {
  return (
    <div className="flex min-h-screen bg-brand-light dark:bg-brand-dark">
      <Sidebar />
      
      <main className="flex-1 pl-64 transition-all duration-300">
        <Header />
        
        <div className="space-y-10 p-10">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-3xl font-black tracking-tighter text-brand-dark dark:text-brand-light font-heading uppercase">
                My Drafts
              </h2>
              <p className="text-sm font-medium text-brand-grey font-body">
                Review and manage your generated content drafts across all platforms.
              </p>
            </div>
          </div>

          <DraftsTable />
        </div>
      </main>
    </div>
  );
}
