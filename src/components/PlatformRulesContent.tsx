"use client";

import { 
  Linkedin, 
  Twitter, 
  Mail, 
  Save, 
  Eye, 
  ChevronRight,
  Sparkles,
  Layout,
  MousePointer2,
  CheckCircle2
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useState } from "react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const platformRules = {
  LinkedIn: {
    icon: Linkedin,
    color: "text-[#0077b5]",
    rules: [
      { label: "Hook Opening", value: "Start with a provocative question or bold statement.", type: "textarea" },
      { label: "Paragraph Style", value: "Limit to 1-3 lines per paragraph. Max white space.", type: "textarea" },
      { label: "Bullet Points", value: "Use checkmark emojis for lists.", type: "text" },
      { label: "Call to Action", value: "Ask for a specific opinion in the comments.", type: "text" },
    ]
  },
  X: {
    icon: Twitter,
    color: "text-[#1DA1F2]",
    rules: [
      { label: "Max Character Count", value: "280 (Single) or Thread (Max 8 posts)", type: "text" },
      { label: "Thread Hooks", value: "1/N style formatting with curiosity gap.", type: "textarea" },
      { label: "Hashtag Rules", value: "Max 2 relevant tags. No broad tagging.", type: "text" },
    ]
  },
  Email: {
    icon: Mail,
    color: "text-brand-orange",
    rules: [
      { label: "Subject Line", value: "Personalized, value-driven, under 50 chars.", type: "text" },
      { label: "Intro Paragraph", value: "Direct bridge from subject line to body.", type: "textarea" },
      { label: "Body Text", value: "Conversational tone, focused on one primary goal.", type: "textarea" },
      { label: "CTA Placement", value: "One at 50% mark, one at the end.", type: "text" },
    ]
  }
};

export default function PlatformRulesContent() {
  const [activePlatform, setActivePlatform] = useState<keyof typeof platformRules>("LinkedIn");
  const platform = platformRules[activePlatform];

  return (
    <div className="space-y-12">
      {/* 1. Platform Selector */}
      <div className="grid grid-cols-3 gap-6">
         {(Object.keys(platformRules) as Array<keyof typeof platformRules>).map((p) => {
           const Icon = platformRules[p].icon;
           const isActive = activePlatform === p;
           return (
             <button 
                key={p}
                onClick={() => setActivePlatform(p)}
                className={cn(
                  "flex flex-col items-center gap-4 rounded-[2.5rem] border p-10 transition-all",
                  isActive 
                    ? "border-brand-dark bg-white shadow-2xl shadow-brand-dark/10 dark:border-brand-orange dark:bg-white/5" 
                    : "border-brand-light-grey bg-brand-light/30 hover:bg-white dark:border-brand-dark/20 dark:bg-white/5 opacity-50 hover:opacity-100"
                )}
             >
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg dark:bg-brand-dark", isActive && platformRules[p].color)}>
                   <Icon size={24} />
                </div>
                <span className={cn("text-xs font-black uppercase tracking-widest font-heading", isActive ? "text-brand-dark dark:text-brand-light" : "text-brand-grey")}>
                   {p === "X" ? "X (Twitter)" : p === "Email" ? "Newsletter" : p}
                </span>
             </button>
           );
         })}
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
         {/* 2. Rules Editor */}
         <div className="rounded-[2.5rem] border border-brand-light-grey bg-white p-12 shadow-xl shadow-brand-dark/5 dark:border-brand-dark/20 dark:bg-white/5">
            <div className="mb-10 flex items-center gap-3">
               <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light dark:bg-white/10 text-brand-dark dark:text-brand-light">
                  <Layout size={20} />
               </div>
               <h3 className="text-xl font-black uppercase tracking-tighter font-heading text-brand-dark dark:text-brand-light">Formatting Templates</h3>
            </div>

            <div className="space-y-8">
               {platform.rules.map((rule, idx) => (
                 <div key={idx} className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-grey font-heading">{rule.label}</label>
                    {rule.type === "textarea" ? (
                      <textarea 
                         defaultValue={rule.value}
                         className="min-h-[100px] w-full rounded-2xl bg-brand-light p-5 text-sm font-medium text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-orange dark:bg-white/5 dark:text-brand-light border border-transparent focus:border-brand-orange transition-all"
                      />
                    ) : (
                      <input 
                         type="text"
                         defaultValue={rule.value}
                         className="w-full rounded-2xl bg-brand-light px-5 py-4 text-sm font-bold text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-orange dark:bg-white/5 dark:text-brand-light border border-transparent focus:border-brand-orange transition-all"
                      />
                    )}
                 </div>
               ))}
            </div>

            <div className="mt-12 flex justify-end gap-4">
               <button className="flex items-center gap-2 rounded-2xl bg-brand-dark px-10 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl transition-all active:scale-95 dark:bg-brand-orange">
                  <Save size={16} />
                  Save Draft
               </button>
            </div>
         </div>

         {/* 3. Live Preview Mockup */}
         <div className="space-y-6">
            <div className="flex items-center justify-between">
               <h3 className="text-sm font-black uppercase tracking-widest text-brand-dark dark:text-brand-light font-heading">AI Output Preview</h3>
               <span className="flex items-center gap-2 text-[10px] font-bold text-brand-orange uppercase animate-pulse">
                  <Sparkles size={12} />
                  Simulated Generation
               </span>
            </div>

            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-brand-light-grey bg-brand-light-grey shadow-2xl dark:border-brand-dark/20">
               {/* Browser/App Shell Mock */}
               <div className="flex h-12 w-full items-center justify-between border-b border-white/20 bg-brand-dark px-6 text-white/50">
                  <div className="flex gap-1.5">
                     <div className="h-2 w-2 rounded-full bg-red-500" />
                     <div className="h-2 w-2 rounded-full bg-yellow-500" />
                     <div className="h-2 w-2 rounded-full bg-green-500" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">fetemi_preview.ai</span>
                  <div />
               </div>

               {/* Content Preview */}
               <div className="h-full bg-white p-10 dark:bg-brand-dark overflow-y-auto pb-20">
                  <div className="mx-auto max-w-sm space-y-6">
                     <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-brand-light-grey" />
                        <div className="space-y-1">
                           <div className="h-3 w-32 rounded bg-brand-light-grey" />
                           <div className="h-2 w-20 rounded bg-brand-light-grey/50" />
                        </div>
                     </div>
                     
                     <div className="space-y-4 pt-4">
                        <p className="text-sm font-bold text-brand-dark dark:text-brand-light font-heading">
                           Why is it so hard to scale human creativity? 🤔
                        </p>
                        <p className="text-xs text-brand-grey font-body leading-relaxed">
                           In 2026, the bottleneck isn't the ideas. It's the execution. Founders are stuck in the "drafting loop" while competitors are shipping at 10x speed.
                        </p>
                        <div className="space-y-2">
                           <div className="flex items-center gap-2 text-xs text-brand-dark dark:text-brand-light font-bold">
                              ✅ Systemize your voice
                           </div>
                           <div className="flex items-center gap-2 text-xs text-brand-dark dark:text-brand-light font-bold">
                              ✅ Multi-channel automation
                           </div>
                        </div>
                        <p className="text-xs text-brand-orange font-black uppercase tracking-widest pt-4">
                           What's your biggest scale blocker? 👇
                        </p>
                     </div>

                     <div className="h-40 w-full rounded-2xl bg-brand-light-grey/50" />
                  </div>
               </div>

               {/* Interaction Mock */}
               <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
                  <div className="flex items-center gap-2 rounded-full bg-brand-dark px-6 py-3 text-white shadow-2xl">
                     <MousePointer2 size={14} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Update Rules to Preview</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
