"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  PlusSquare, 
  FileText, 
  History, 
  BarChart3, 
  Settings,
  Zap
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Create Content", href: "/create", icon: PlusSquare },
  { name: "Drafts", href: "/drafts", icon: FileText },
  { name: "Revisions", href: "/revisions", icon: History },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-brand-light-grey bg-brand-light transition-transform dark:border-brand-dark/20 dark:bg-brand-dark">
      <div className="flex h-full flex-col px-3 py-4">
        {/* Logo Section */}
        <div className="mb-10 flex items-center gap-2 px-2 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange text-white shadow-lg shadow-brand-orange/20">
            <Zap size={24} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-bold tracking-tighter text-brand-dark dark:text-brand-light font-heading">
            FETEMI
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 font-heading">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200",
                  isActive 
                    ? "bg-brand-dark text-brand-light shadow-md dark:bg-brand-light dark:text-brand-dark" 
                    : "text-brand-grey hover:bg-brand-light-grey/50 hover:text-brand-dark dark:text-brand-grey dark:hover:bg-white/5 dark:hover:text-brand-light"
                )}
              >
                <item.icon 
                  className={cn(
                    "mr-3 h-5 w-5 transition-colors",
                    isActive ? "text-brand-orange" : "text-brand-grey group-hover:text-brand-dark dark:group-hover:text-brand-light"
                  )} 
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer / User Info Placeholder */}
        <div className="mt-auto border-t border-brand-light-grey pt-4 dark:border-brand-dark/20">
          <div className="rounded-2xl bg-brand-light-grey/30 p-4 dark:bg-white/5">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-grey opacity-60 font-heading">
              Current Role
            </p>
            <p className="text-sm font-bold text-brand-dark dark:text-brand-light">
              Content Manager
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
