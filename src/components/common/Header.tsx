"use client";

import { Bell, Search, User, Moon, Sun } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/common/AuthContext";
import { useTheme } from "@/components/common/ThemeContext";

export default function Header() {
  const { user, role } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const pathname = usePathname();

  const getPageTitle = (path: string) => {
    if (path === '/' || path === '/manager') return 'Dashboard';
    const segments = path.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    if (!lastSegment) return 'Dashboard';
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace(/-/g, ' ');
  };

  const title = getPageTitle(pathname || '');

  return (
    <header className="sticky top-6 z-30 mx-8 flex h-20 items-center justify-between glass-card rounded-[2rem] px-8 transition-all duration-300">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-medium tracking-tight text-brand-dark dark:text-brand-light font-heading">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-6 h-full py-4">
        {/* Search Input - Soft Glass */}
        <div className="hidden lg:flex items-center h-full px-5 w-80 bg-black/5 dark:bg-white/5 rounded-2xl transition-all focus-within:ring-2 focus-within:ring-brand-accent/50 focus-within:bg-white dark:focus-within:bg-brand-dark shadow-sm">
          <Search size={16} className="text-brand-grey mr-3" />
          <input
            type="text"
            placeholder="Search documents..."
            className="w-full bg-transparent px-4 py-2 text-sm text-brand-dark outline-none placeholder:text-slate-400 dark:text-brand-light"
          />
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black/5 text-brand-dark transition-all hover:bg-black/10 hover:scale-105 active:scale-95 dark:bg-white/5 dark:text-brand-light dark:hover:bg-white/10 focus-ring"
          >
            {isDarkMode ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />}
          </button>
          
          <button 
            aria-label="View notifications"
            className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-black/5 text-brand-dark transition-all hover:bg-black/10 hover:scale-105 active:scale-95 dark:bg-white/5 dark:text-brand-light dark:hover:bg-white/10 focus-ring"
          >
            <Bell size={18} strokeWidth={1.5} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-accent ring-2 ring-white dark:ring-brand-dark" />
          </button>
        </div>

        <div className="h-6 w-px bg-brand-light-grey dark:bg-brand-dark/50" />

        {/* User Profile */}
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="hidden flex-col items-end leading-tight lg:flex">
            <span className="text-[13px] font-medium text-brand-dark dark:text-brand-light font-heading">
              {user?.displayName || user?.email?.split('@')[0] || "Guest"}
            </span>
            <span className="text-[11px] font-normal text-slate-500 dark:text-brand-light-grey font-body">
              {role || "User"}
            </span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-accent to-brand-accent-light text-white shadow-lg shadow-brand-accent/10 transition-transform group-hover:scale-105 overflow-hidden">
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || "User"} className="h-full w-full object-cover" />
            ) : (
              <User size={18} strokeWidth={1.5} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
