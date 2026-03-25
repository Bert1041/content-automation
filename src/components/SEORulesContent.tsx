"use client";

import { 
  Save, 
  RotateCcw, 
  Plus, 
  Trash2, 
  ChevronRight,
  Info,
  Layers,
  Link as LinkIcon,
  Type,
  AlignLeft
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useState } from "react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const defaultRules = [
  {
    category: "Article Structure",
    icon: Layers,
    rules: [
      { id: "s1", label: "Required H1 Title", value: "Enabled", type: "toggle" },
      { id: "s2", label: "Minimum H2 Sections", value: "3", type: "number" },
      { id: "s3", label: "Max Paragraph Length", value: "250 chars", type: "text" },
      { id: "s4", label: "Use Bullet Points", value: "Enabled", type: "toggle" },
    ]
  },
  {
    category: "Keyword Strategy",
    icon: LinkIcon,
    rules: [
      { id: "k1", label: "Primary Keyword Usage", value: "Include in H1 & Intro", type: "text" },
      { id: "k2", label: "Secondary Placement", value: "Spread across H2s", type: "text" },
      { id: "k3", label: "Keyword Density", value: "1.5% - 2.5%", type: "text" },
    ]
  },
  {
    category: "Readability",
    icon: Type,
    rules: [
      { id: "r1", label: "Reading Grade Level", value: "8th Grade", type: "text" },
      { id: "r2", label: "Max Sentence Length", value: "20 words", type: "text" },
      { id: "r3", label: "Paragraph Cap", value: "5 lines", type: "text" },
    ]
  }
];

export default function SEORulesContent() {
  const [sections, setSections] = useState(defaultRules);

  return (
    <div className="space-y-12">
      {/* 1. Caution Banner */}
      <div className="flex items-center gap-4 rounded-[2rem] border border-brand-orange/20 bg-brand-orange/5 p-8 text-brand-orange">
         <Info size={24} />
         <p className="text-sm font-bold font-body">
           <span className="uppercase font-black font-heading tracking-widest mr-2">Warning:</span>
           Changes will affect all future AI generated drafts. Existing drafts will not be modified.
         </p>
      </div>

      {/* 2. Rule Sections */}
      <div className="grid gap-8 lg:grid-cols-2">
         {sections.map((section, sIdx) => (
           <div key={section.category} className="rounded-[2.5rem] border border-brand-light-grey bg-white p-10 shadow-xl shadow-brand-dark/5 dark:border-brand-dark/20 dark:bg-white/5">
              <div className="mb-8 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light dark:bg-white/10 text-brand-dark dark:text-brand-light">
                       <section.icon size={20} />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tighter font-heading text-brand-dark dark:text-brand-light">{section.category}</h3>
                 </div>
                 <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-brand-light dark:hover:bg-white/10 text-brand-grey transition-colors">
                    <Plus size={18} />
                 </button>
              </div>

              <div className="space-y-4">
                 {section.rules.map((rule) => (
                   <div key={rule.id} className="group flex items-center justify-between border-b border-brand-light-grey pb-4 last:border-0 dark:border-brand-dark/20">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-brand-grey font-heading">{rule.label}</p>
                        <input 
                           type="text" 
                           defaultValue={rule.value}
                           className="bg-transparent text-sm font-bold text-brand-dark dark:text-brand-light focus:outline-none focus:text-brand-orange transition-colors"
                        />
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="p-2 text-brand-grey hover:text-red-500 transition-colors">
                            <Trash2 size={16} />
                         </button>
                         <ChevronRight size={16} className="text-brand-light-grey" />
                      </div>
                   </div>
                 ))}
              </div>
           </div>
         ))}

         {/* Add New Section Placeholder */}
         <button className="flex flex-col items-center justify-center gap-4 rounded-[2.5rem] border-2 border-dashed border-brand-light-grey p-10 text-brand-grey hover:border-brand-orange hover:bg-brand-orange/5 hover:text-brand-orange transition-all dark:border-brand-dark/20">
            <Plus size={32} />
            <span className="text-xs font-black uppercase tracking-widest font-heading">Add New Category</span>
         </button>
      </div>

      {/* 3. Action Footer */}
      <div className="flex items-center justify-end gap-4 border-t border-brand-light-grey pt-10 dark:border-brand-dark/20">
         <button className="flex items-center gap-2 px-8 py-4 text-xs font-black uppercase tracking-widest text-brand-grey hover:text-brand-dark transition-colors">
            <RotateCcw size={16} />
            Reset to Default
         </button>
         <button className="flex items-center gap-2 rounded-2xl bg-brand-dark px-10 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-brand-dark/20 transition-all active:scale-95 dark:bg-brand-orange dark:shadow-brand-orange/20">
            <Save size={16} />
            Save Rules
         </button>
      </div>
    </div>
  );
}
