import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import DraftEditor from "@/components/DraftEditor";

export default function EditDraftPage() {
  return (
    <div className="flex min-h-screen bg-brand-light dark:bg-brand-dark overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 pl-64 transition-all duration-300">
        <Header />
        
        {/* Full screen editor container */}
        <div className="h-[calc(100vh-5rem)]">
          <DraftEditor />
        </div>
      </main>
    </div>
  );
}
