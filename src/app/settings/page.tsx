"use client";

import Sidebar from "@/components/common/Sidebar";
import Header from "@/components/common/Header";
import { Settings, Type } from "lucide-react";
import { useTheme } from "@/components/common/ThemeContext";
import { cn } from "@/lib/utils";

const fontSizeOptions = [
  { id: 'small', label: 'Small', description: 'Maximum content density', iconSize: 14 },
  { id: 'medium', label: 'Default', description: 'Balanced readability', iconSize: 16 },
  { id: 'large', label: 'Large', description: 'Increased comfort', iconSize: 18 },
  { id: 'extra-large', label: 'Extra Large', description: 'Maximum visibility', iconSize: 20 },
];

export default function SettingsPage() {
  const { fontSize, setFontSize } = useTheme();

  return (
    <div className="flex min-h-screen bg-brand-light dark:bg-brand-dark">
      <Sidebar role="content-manager" />
      
      <main className="flex-1 pl-[20rem] transition-all duration-300">
        <Header />
        
        <div className="mx-auto max-w-7xl p-10 space-y-12">
          <div className="flex items-center gap-3">
             <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-accent/10 text-brand-accent shadow-sm">
                <Settings size={22} strokeWidth={1.5} />
             </div>
             <h2 className="text-3xl font-semibold tracking-tight text-brand-dark dark:text-brand-light font-heading">
               Settings
             </h2>
          </div>

          <section className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-brand-dark dark:text-brand-light font-heading">Appearance</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Customize how the platform looks on your screen.</p>
            </div>

            <div className="glass-card p-10 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-brand-dark dark:text-brand-light">
                  <Type size={20} className="text-brand-accent" />
                  <span className="font-heading text-sm font-black uppercase tracking-widest">Global Font Size</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {fontSizeOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setFontSize(option.id as any)}
                      className={cn(
                        "flex flex-col items-center justify-center gap-4 rounded-[2rem] p-8 transition-all duration-300 border-2",
                        fontSize === option.id 
                          ? "bg-brand-accent border-brand-accent text-white shadow-xl shadow-brand-accent/20 scale-105" 
                          : "bg-white/50 dark:bg-brand-dark/50 border-transparent text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-brand-dark hover:border-brand-accent/30"
                      )}
                    >
                      <div className={cn(
                        "flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5",
                        fontSize === option.id ? "bg-white/20" : ""
                      )} style={{ width: 48, height: 48 }}>
                        <Type size={option.iconSize} />
                      </div>
                      <div className="text-center">
                        <span className="block font-heading text-xs font-black uppercase tracking-widest leading-none mb-1">{option.label}</span>
                        <span className={cn(
                          "block text-[10px] font-medium opacity-60",
                          fontSize === option.id ? "text-white" : "text-slate-500"
                        )}>{option.description}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
