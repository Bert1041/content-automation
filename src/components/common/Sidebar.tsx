"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/common/AuthContext";
import { useState } from "react";
import { 
  LayoutDashboard, 
  FileEdit, 
  Files, 
  RefreshCcw, 
  BarChart3, 
  Settings, 
  Sparkles,
  Zap,
  CheckCircle2,
  Users,
  ShieldCheck,
  Globe,
  ClipboardList,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/components/common/Logo";
import { useLayout } from "@/components/common/LayoutContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config";

interface SidebarProps {
  role?: "manager" | "content-manager";
}

const contentManagerItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: FileEdit, label: "Create Content", href: "/create" },
  { icon: Files, label: "Drafts", href: "/drafts" },
  { icon: RefreshCcw, label: "Revisions", href: "/revisions" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

const managerItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/manager" },
  { icon: ClipboardList, label: "Review Queue", href: "/manager/review" },
  { icon: CheckCircle2, label: "Published Content", href: "/manager/published" },
  { icon: ShieldCheck, label: "SEO Rules", href: "/manager/seo" },
  { icon: Globe, label: "Platform Rules", href: "/manager/platforms" },
  { icon: Users, label: "User Management", href: "/manager/users" },
  { icon: ClipboardList, label: "Email List", href: "/manager/emails" },
  { icon: BarChart3, label: "Analytics", href: "/manager/analytics" },
  { icon: Settings, label: "Settings", href: "/manager/settings" },
];

export default function Sidebar({ role: manualRole }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { role: contextRole } = useAuth();
  const { sidebarCollapsed, toggleSidebar } = useLayout();
  
  // Use manualRole if provided (for overrides), otherwise use role from context
  const role = manualRole || (contextRole === "Manager" ? "manager" : "content-manager");
  const items = role === "manager" ? managerItems : contentManagerItems;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[60] flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-accent text-white shadow-lg shadow-brand-accent/20 transition-all hover:scale-105 active:scale-95 lg:hidden"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[55] bg-brand-dark/20 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed transition-all duration-500 ease-in-out z-50 glass-card rounded-[2.5rem] flex flex-col shadow-xl",
        sidebarCollapsed ? "left-4 top-6 bottom-6 w-20" : "left-6 top-6 bottom-6 w-72",
        isOpen ? "translate-x-0" : "-translate-x-[120%] lg:translate-x-0",
        "overflow-hidden"
      )}>
        {/* Toggle Button (Desktop) */}
        <button 
          onClick={toggleSidebar}
          className="absolute -right-3 top-24 z-[60] hidden h-8 w-8 items-center justify-center rounded-full bg-brand-accent text-white shadow-lg transition-transform hover:scale-110 lg:flex"
        >
          {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <div className="flex flex-col h-full overflow-y-auto custom-scrollbar p-6">
        {/* Brand Logo */}
        <div className={cn("transition-all duration-300", sidebarCollapsed ? "opacity-0 h-0 mb-0 overflow-hidden" : "opacity-100 mb-8")}>
          <Logo variant="compact" />
        </div>
        
        {sidebarCollapsed && (
          <div className="flex justify-center mb-8">
             <div className="h-10 w-10 rounded-xl bg-brand-accent flex items-center justify-center text-white font-bold">F</div>
          </div>
        )}
  
          {/* Navigation Items */}
          <nav className="flex-1 space-y-1.5 pr-2 overflow-y-auto scrollbar-hide min-h-0">
            {items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "group relative flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 focus-ring",
                    sidebarCollapsed ? "justify-center px-0" : "px-4",
                    isActive 
                      ? "bg-brand-accent text-white shadow-md shadow-brand-accent/10" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-brand-dark dark:hover:text-brand-light"
                  )}
                  aria-current={isActive ? "page" : undefined}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <item.icon 
                    size={sidebarCollapsed ? 20 : 18} 
                    strokeWidth={isActive ? 2 : 1.5}
                    className={cn(
                      "transition-transform duration-300 group-hover:scale-105",
                      isActive ? "text-white" : "text-slate-400 group-hover:text-brand-accent-light"
                    )} 
                  />
                  {!sidebarCollapsed && (
                    <span className="text-[13px] font-medium tracking-wide font-body whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
  
          {/* Role Indicator & Actions */}
          <div className={cn("mt-6 space-y-4 pt-6 border-t border-brand-light-grey/50 dark:border-brand-dark/30 flex-none", sidebarCollapsed && "px-0")}>
            {!sidebarCollapsed ? (
              <div className="rounded-2xl bg-black/5 dark:bg-white/5 p-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-brand-accent/5 rounded-full blur-xl transform translate-x-1/2 -translate-y-1/2" />
                <div className="flex items-center gap-2 mb-1.5 relative z-10">
                  <Sparkles size={12} className="text-brand-accent" strokeWidth={1.5} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 opacity-70">
                    Your Role
                  </span>
                </div>
                <p className="text-[13px] font-medium text-brand-dark dark:text-brand-light font-body capitalize relative z-10">
                  {role.replace("-", " ")}
                </p>
              </div>
            ) : (
              <div className="flex justify-center p-2 rounded-xl bg-black/5 dark:bg-white/5" title={`Role: ${role}`}>
                <Sparkles size={16} className="text-brand-accent" />
              </div>
            )}
  
            <button 
              onClick={handleLogout}
              className={cn(
                "group flex items-center justify-between rounded-xl bg-red-500/5 transition-all focus-ring",
                sidebarCollapsed ? "h-10 w-10 justify-center p-0 mx-auto" : "w-full px-4 py-3 dark:bg-red-500/10",
                "text-red-600 hover:bg-red-500 hover:text-white dark:text-red-400 dark:hover:bg-red-500 dark:hover:text-white"
              )}
              aria-label="Log out of your account"
              title={sidebarCollapsed ? "Log out" : undefined}
            >
              {!sidebarCollapsed && (
                <span className="text-xs font-medium tracking-wide font-body">
                  Log out
                </span>
              )}
              <LogOut size={14} strokeWidth={1.5} className={cn("transition-transform", !sidebarCollapsed && "group-hover:translate-x-1")} />
            </button>
  
            {!sidebarCollapsed && (
              <div className="flex items-center justify-center pt-2">
                <p className="text-[10px] font-bold text-slate-500 dark:text-brand-light-grey/30 uppercase tracking-[0.2em]">
                  V2.4.0 • PRODUCTION
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
