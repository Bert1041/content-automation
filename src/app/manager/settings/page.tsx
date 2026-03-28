"use client";

import Sidebar from "@/components/common/Sidebar";
import Header from "@/components/common/Header";
import { Settings, Type, Globe, Database } from "lucide-react";
import { useTheme } from "@/components/common/ThemeContext";
import { cn } from "@/lib/utils";

const fontSizeOptions = [
  { id: 'small', label: 'Small', description: 'Maximum content density', iconSize: 14 },
  { id: 'medium', label: 'Default', description: 'Balanced readability', iconSize: 16 },
  { id: 'large', label: 'Large', description: 'Increased comfort', iconSize: 18 },
  { id: 'extra-large', label: 'Extra Large', description: 'Maximum visibility', iconSize: 20 },
];

export default function ManagerSettingsPage() {
  const { fontSize, setFontSize } = useTheme();

  return (
    <div className="flex min-h-screen bg-brand-light dark:bg-brand-dark">
      <Sidebar role="manager" />
      
      <main className="flex-1 lg:pl-[20rem] transition-all duration-300">
        <Header />
        
        <div className="mx-auto max-w-7xl p-6 lg:p-10 space-y-12">
          <div className="flex items-center gap-4">
             <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-dark text-white dark:bg-brand-orange shadow-lg ring-8 ring-brand-orange/5">
                <Settings size={22} strokeWidth={1.5} />
             </div>
             <div>
                <h2 className="text-3xl font-semibold tracking-tight text-brand-dark dark:text-brand-light font-heading">
                  Manager Settings
                </h2>
                <p className="text-xs text-brand-grey font-body uppercase tracking-widest opacity-70">Platform & API Configuration</p>
             </div>
          </div>

          <div className="grid gap-10 xl:grid-cols-2">
            {/* 1. Appearance Section */}
            <section className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-brand-dark dark:text-brand-light font-heading">Appearance</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Customize how the platform looks on your screen.</p>
              </div>

              <div className="glass-card p-8 space-y-8 rounded-[2.5rem] border border-brand-light-grey bg-white shadow-xl shadow-brand-dark/5 dark:border-brand-dark/20 dark:bg-white/5">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-brand-dark dark:text-brand-light">
                    <Type size={20} className="text-brand-orange" />
                    <span className="font-heading text-sm font-black uppercase tracking-widest leading-none">Global Font Size</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {fontSizeOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setFontSize(option.id as any)}
                        className={cn(
                          "flex flex-col items-center justify-center gap-3 rounded-[2rem] p-6 transition-all duration-300 border-2",
                          fontSize === option.id 
                            ? "bg-brand-orange/5 border-brand-orange text-brand-dark dark:text-brand-light shadow-lg scale-[1.02]" 
                            : "bg-white/50 dark:bg-white/5 border-transparent text-slate-500 dark:text-slate-500 hover:bg-white dark:hover:bg-white/10 hover:border-brand-orange/30"
                        )}
                      >
                        <div className={cn(
                          "flex items-center justify-center rounded-xl",
                          fontSize === option.id ? "bg-brand-orange text-white" : "bg-slate-100 dark:bg-white/5"
                        )} style={{ width: 40, height: 40 }}>
                          <Type size={option.iconSize} />
                        </div>
                        <div className="text-center">
                          <span className={cn(
                            "block font-heading text-[10px] font-black uppercase tracking-widest leading-none mb-1",
                            fontSize === option.id ? "text-brand-orange" : ""
                          )}>{option.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Platform Config (Placeholder for Managers) */}
            <section className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-brand-dark dark:text-brand-light font-heading">Connectivity</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Manage external connections and data sync.</p>
              </div>

              <div className="flex flex-col gap-4">
                 <div className="group flex items-center justify-between p-6 rounded-[2rem] border border-brand-light-grey bg-white/50 shadow-sm dark:border-brand-dark/20 dark:bg-white/5 transition-all hover:bg-white dark:hover:bg-white/10">
                    <div className="flex items-center gap-4">
                       <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-light text-slate-400 dark:bg-white/5 group-hover:scale-110 transition-transform">
                          <Globe size={20} />
                       </div>
                       <div>
                          <p className="text-xs font-black uppercase tracking-widest text-brand-dark dark:text-brand-light">Airtable Integration</p>
                          <p className="text-[10px] font-medium text-emerald-500">Connected • Rule Management Live</p>
                       </div>
                    </div>
                    <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-dark dark:hover:text-brand-light">Configure</button>
                 </div>

                 <div className="group flex items-center justify-between p-6 rounded-[2rem] border border-brand-light-grey bg-white/50 shadow-sm dark:border-brand-dark/20 dark:bg-white/5 transition-all hover:bg-white dark:hover:bg-white/10">
                    <div className="flex items-center gap-4">
                       <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-light text-slate-400 dark:bg-white/5 group-hover:scale-110 transition-transform">
                          <Database size={20} />
                       </div>
                       <div>
                          <p className="text-xs font-black uppercase tracking-widest text-brand-dark dark:text-brand-light">n8n Automation</p>
                          <p className="text-[10px] font-medium text-emerald-500">Active • 12 Active Workflows</p>
                       </div>
                    </div>
                    <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-dark dark:hover:text-brand-light">Status</button>
                 </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
