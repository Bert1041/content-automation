"use client";

import { Bell, Search, User, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) {
      setIsDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-brand-light-grey bg-brand-light/80 px-8 backdrop-blur-md dark:border-brand-dark/20 dark:bg-brand-dark/80">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-brand-dark dark:text-brand-light font-heading">
          Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Search Placeholder */}
        <div className="hidden h-10 w-64 items-center gap-2 rounded-full border border-brand-light-grey bg-brand-light-grey/20 px-4 text-brand-grey dark:border-brand-dark/40 dark:bg-white/5 lg:flex">
          <Search size={16} />
          <span className="text-sm font-medium">Search...</span>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleDarkMode}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-light-grey bg-white text-brand-dark transition-all hover:bg-brand-light-grey dark:border-brand-dark/40 dark:bg-white/5 dark:text-brand-light dark:hover:bg-white/10"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-brand-light-grey bg-white text-brand-dark transition-all hover:bg-brand-light-grey dark:border-brand-dark/40 dark:bg-white/5 dark:text-brand-light dark:hover:bg-white/10">
            <Bell size={18} />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-brand-orange ring-2 ring-white dark:ring-brand-dark" />
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2 border-l border-brand-light-grey dark:border-brand-dark/20 h-8">
          <div className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-brand-orange/20 bg-brand-light-grey dark:bg-white/10">
              <User size={20} className="text-brand-grey" />
            </div>
            <div className="hidden flex-col items-start leading-tight lg:flex">
              <span className="text-sm font-bold text-brand-dark dark:text-brand-light font-heading">
                Alex Rivera
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-orange">
                Manager
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
