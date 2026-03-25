import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Plus } from "lucide-react";

export default function CreateContentPage() {
  return (
    <div className="flex min-h-screen bg-brand-light dark:bg-brand-dark">
      <Sidebar />
      
      <main className="flex-1 pl-64">
        <Header />
        
        <div className="p-10">
          <div className="rounded-[2rem] border-2 border-dashed border-brand-light-grey bg-white/50 p-20 text-center dark:border-brand-dark/20 dark:bg-white/5">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange">
              <Plus size={40} />
            </div>
            <h2 className="mb-2 text-3xl font-black tracking-tighter text-brand-dark dark:text-brand-light font-heading">
              CREATE NEW CONTENT
            </h2>
            <p className="mx-auto max-w-md text-brand-grey font-body">
              This screen will allow you to submit raw ideas or URLs to start the AI content generation pipeline.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
