import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ManagerReviewDetail from "@/components/ManagerReviewDetail";

export default function ReviewPage() {
  return (
    <div className="flex min-h-screen bg-brand-light dark:bg-brand-dark">
      <Sidebar role="manager" />
      
      <main className="flex-1 pl-64 transition-all duration-300">
        <Header />
        
        <div className="mx-auto max-w-7xl p-10">
          <ManagerReviewDetail />
        </div>
      </main>
    </div>
  );
}
