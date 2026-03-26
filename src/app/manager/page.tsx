import Sidebar from "@/components/common/Sidebar";
import Header from "@/components/common/Header";
import ManagerDashboardContent from "@/components/manager/ManagerDashboardContent";
import WelcomeBanner from "@/components/common/WelcomeBanner";

export default function ManagerDashboard() {
  return (
    <div className="flex min-h-screen bg-brand-light dark:bg-brand-dark">
      <Sidebar role="manager" />
      
      <main className="flex-1 lg:pl-[20rem] transition-all duration-300">
        <Header />
        
        <div className="mx-auto max-w-7xl p-6 lg:p-10">
          <div className="mb-10">
            <WelcomeBanner subtitle="Oversee the entire content pipeline, manage team performance, and optimize publishing strategy." />
          </div>
          
          <ManagerDashboardContent />
        </div>
      </main>
    </div>
  );
}
