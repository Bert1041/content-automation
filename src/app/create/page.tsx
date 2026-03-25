import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import CreateContentForm from "@/components/CreateContentForm";

export default function CreateContentPage() {
  return (
    <div className="flex min-h-screen bg-brand-light dark:bg-brand-dark">
      <Sidebar />
      
      <main className="flex-1 pl-64 transition-all duration-300">
        <Header />
        
        <div className="mx-auto max-w-5xl space-y-10 p-10">
          {/* Page Header */}
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tighter text-brand-dark dark:text-brand-light font-heading uppercase">
              Create New Content
            </h2>
            <p className="text-sm font-medium text-brand-grey font-body">
              Configure your source material and AI settings to generate platform-optimized drafts.
            </p>
          </div>

          <CreateContentForm />
        </div>
      </main>
    </div>
  );
}
