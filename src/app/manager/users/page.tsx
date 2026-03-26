import Sidebar from "@/components/common/Sidebar";
import Header from "@/components/common/Header";
import UserManagementContent from "@/components/manager/UserManagementContent";

export default function UserManagementPage() {
  return (
    <div className="flex min-h-screen bg-brand-light dark:bg-brand-dark">
      <Sidebar role="manager" />
      
      <main className="flex-1 lg:pl-[20rem] transition-all duration-300">
        <Header />
        
        <div className="mx-auto max-w-7xl p-6 lg:p-10">
          <div className="mb-10 space-y-1">
            <h2 className="text-3xl font-semibold tracking-tight text-brand-dark dark:text-brand-light font-heading">
              User Management
            </h2>
            <p className="text-sm font-normal text-slate-600 dark:text-brand-light-grey/60 font-body opacity-90">
              Control platform access, manage user roles, and monitor team activity.
            </p>
          </div>
          
          <UserManagementContent />
        </div>
      </main>
    </div>
  );
}
