import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import UserManagementContent from "@/components/UserManagementContent";

export default function UserManagementPage() {
  return (
    <div className="flex min-h-screen bg-brand-light dark:bg-brand-dark">
      <Sidebar role="manager" />
      
      <main className="flex-1 pl-64 transition-all duration-300">
        <Header />
        
        <div className="mx-auto max-w-7xl p-10">
          <div className="mb-10 space-y-1">
            <h2 className="text-3xl font-black tracking-tighter text-brand-dark dark:text-brand-light font-heading uppercase">
              User Management
            </h2>
            <p className="text-sm font-medium text-brand-grey font-body">
              Control platform access, manage user roles, and monitor team activity.
            </p>
          </div>
          
          <UserManagementContent />
        </div>
      </main>
    </div>
  );
}
