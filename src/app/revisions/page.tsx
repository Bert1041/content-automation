import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import RevisionPageContent from "@/components/RevisionPageContent";

export default function RevisionPage() {
  return (
    <div className="flex min-h-screen bg-brand-light dark:bg-brand-dark">
      <Sidebar />
      
      <main className="flex-1 pl-64 transition-all duration-300">
        <Header />
        
        <div className="mx-auto max-w-6xl p-10">
          <RevisionPageContent />
        </div>
      </main>
    </div>
  );
}
