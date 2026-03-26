import Sidebar from "@/components/common/Sidebar";
import Header from "@/components/common/Header";
import ManagerReviewDetail from "@/components/manager/ManagerReviewDetail";

export default function ReviewPage() {
  return (
    <div className="flex min-h-screen bg-brand-light dark:bg-brand-dark">
      <Sidebar role="manager" />
      
      <main className="flex-1 pl-[20rem] transition-all duration-300">
        <Header />
        
        <div className="mx-auto max-w-7xl p-10">
          <ManagerReviewDetail />
        </div>
      </main>
    </div>
  );
}
