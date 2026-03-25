import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import StatCard from "@/components/StatCard";
import RecentContentTable from "@/components/RecentContentTable";
import { 
  Plus, 
  FileText, 
  Clock, 
  XCircle, 
  Calendar, 
  CheckCircle2 
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-brand-light dark:bg-brand-dark">
      <Sidebar />
      
      <main className="flex-1 pl-64 transition-all duration-300">
        <Header />
        
        <div className="space-y-10 p-10">
          {/* Dashboard Header with Action Button */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-3xl font-black tracking-tighter text-brand-dark dark:text-brand-light font-heading">
                CONTENT PIPELINE
              </h2>
              <p className="text-sm font-medium text-brand-grey font-body">
                Manage and track your content automation workflow.
              </p>
            </div>
            
            <button className="group relative flex items-center gap-2 overflow-hidden rounded-2xl bg-brand-orange px-6 py-4 font-bold text-white transition-all hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(217,119,87,0.4)]">
              <Plus size={20} strokeWidth={3} />
              <span className="font-heading tracking-tight">Create New Content</span>
              {/* Shine effort */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
            </button>
          </div>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard 
              title="Drafts Created" 
              value="24" 
              icon={FileText} 
            />
            <StatCard 
              title="Pending Review" 
              value="8" 
              icon={Clock} 
              variant="orange"
            />
            <StatCard 
              title="Rejected Drafts" 
              value="2" 
              icon={XCircle} 
            />
            <StatCard 
              title="Scheduled" 
              value="12" 
              icon={Calendar} 
            />
            <StatCard 
              title="Published" 
              value="148" 
              icon={CheckCircle2} 
              variant="dark"
            />
          </div>

          {/* Recent Content Table Section */}
          <div className="space-y-6">
            <RecentContentTable />
          </div>
        </div>
      </main>
    </div>
  );
}
