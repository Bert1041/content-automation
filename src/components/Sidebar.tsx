"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  ClipboardList
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
  { icon: BarChart3, label: "Analytics", href: "/manager/analytics" },
  { icon: Settings, label: "Settings", href: "/manager/settings" },
];

export default function Sidebar({ role = "content-manager" }: SidebarProps) {
  const pathname = usePathname();
  const items = role === "manager" ? managerItems : contentManagerItems;

  return (
    <aside className="fixed left-0 top-0 z-50 h-screen w-64 border-r border-brand-light-grey bg-white dark:border-brand-dark/20 dark:bg-brand-dark shadow-2xl shadow-brand-dark/5">
      <div className="flex h-full flex-col p-6">
        {/* Brand Logo */}
        <div className="mb-10 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange text-white shadow-lg shadow-brand-orange/20">
            <Zap size={24} fill="currentColor" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-brand-dark dark:text-brand-light font-heading uppercase">
            Fetemi
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-2">
          {items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-300",
                  isActive 
                    ? "bg-brand-dark text-white dark:bg-brand-orange shadow-lg shadow-brand-dark/10" 
                    : "text-brand-grey hover:bg-brand-light-grey dark:hover:bg-white/5 dark:hover:text-brand-light"
                )}
              >
                <item.icon 
                  size={20} 
                  className={cn(
                    "transition-transform group-hover:scale-110",
                    isActive ? "text-white" : "text-brand-grey"
                  )} 
                />
                <span className="text-xs font-bold uppercase tracking-widest font-heading">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Role Indicator & Help */}
        <div className="mt-auto space-y-6">
          <div className="rounded-2xl bg-brand-light p-5 dark:bg-white/5 border border-brand-light-grey dark:border-brand-dark/20">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles size={16} className="text-brand-orange" />
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark dark:text-brand-light font-heading">
                Current Role
              </span>
            </div>
            <p className="text-xs font-bold text-brand-grey font-body capitalize">
              {role.replace("-", " ")}
            </p>
          </div>
          
          <div className="flex items-center justify-between px-2 opacity-50">
            <span className="text-[10px] font-bold text-brand-grey uppercase tracking-widest font-heading">v0.1.0</span>
            <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
          </div>
        </div>
      </div>
    </aside>
  );
}
