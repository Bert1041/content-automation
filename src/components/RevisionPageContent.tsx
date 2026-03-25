"use client";

import { 
  AlertCircle, 
  History, 
  User, 
  Calendar, 
  CheckCircle, 
  RefreshCcw, 
  Save, 
  Send,
  MoreVertical,
  ChevronRight,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const mockRevisionData = {
  id: 1,
  title: "How Startups Can Use AI for Marketing",
  manager: "Sarah Johnson",
  rejectionDate: "Oct 24, 2026",
  comments: "The tone in the second paragraph is a bit too aggressive. We need it to be more helpful and community-focused. Also, the SEO keyword usage is high, but the flow feels forced. Let's simplify the H2 headings.",
  history: [
    { version: "Original Draft", date: "Oct 22, 2026", status: "Generated" },
    { version: "Rejected Version", date: "Oct 24, 2026", status: "Rejected" },
    { version: "Current Revision", date: "Oct 25, 2026", status: "In Progress" },
  ],
  content: "<h1>How Startups Can Use AI for Marketing</h1><p>In 2026, AI is no longer a luxury for startups—it's a necessity. By leveraging large language models, startup marketing teams can scale their output by 10x while maintaining high quality.</p><h2>The Power of Automation</h2><p>Automation allows for consistent messaging across all channels. From SEO-optimized blog posts to snappy social media hooks, the AI-driven pipeline transforms raw ideas into multi-platform content in seconds.</p>",
};

export default function RevisionPageContent() {
  const [content, setContent] = useState(mockRevisionData.content);

  return (
    <div className="space-y-10 pb-20">
      {/* 1. Manager Feedback Panel */}
      <section className="relative overflow-hidden rounded-[2.5rem] border border-red-200 bg-red-50 p-10 dark:border-red-500/20 dark:bg-red-500/5 shadow-xl shadow-red-500/5">
        <div className="absolute right-0 top-0 p-8 text-red-500/20 dark:text-red-500/10">
          <AlertCircle size={120} strokeWidth={1} />
        </div>
        
        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500 text-white shadow-lg shadow-red-500/20">
              <AlertCircle size={32} />
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl font-black tracking-tighter text-brand-dark dark:text-brand-light font-heading uppercase">
                Revision Required
              </h2>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-500 font-heading">
                Status: REJECTED & NEEDS WORK
              </p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-brand-grey">
                <User size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest font-heading">Manager</span>
              </div>
              <p className="text-sm font-bold text-brand-dark dark:text-brand-light font-heading">{mockRevisionData.manager}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-brand-grey">
                <Calendar size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest font-heading">Date of Rejection</span>
              </div>
              <p className="text-sm font-bold text-brand-dark dark:text-brand-light font-heading">{mockRevisionData.rejectionDate}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white/50 p-6 border border-white/20 dark:bg-white/5 dark:border-white/10">
            <h4 className="mb-3 text-[10px] font-black uppercase tracking-widest text-brand-grey opacity-60 font-heading">
              Manager Comments
            </h4>
            <p className="text-sm font-medium leading-relaxed text-brand-dark dark:text-brand-light/90 font-body">
              "{mockRevisionData.comments}"
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* 2. Revision Editor Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black tracking-tighter text-brand-dark dark:text-brand-light font-heading uppercase">
              Revision Editor
            </h3>
            <span className="text-[10px] font-bold tracking-widest text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full uppercase">
              Editing Version 3
            </span>
          </div>

          <div className="rounded-[2.5rem] border border-brand-light-grey bg-white shadow-xl shadow-brand-dark/5 dark:border-brand-dark/20 dark:bg-white/5 overflow-hidden">
            <div className="h-12 border-b border-brand-light-grey dark:border-brand-dark/20 flex items-center px-6 gap-4">
              {/* Fake Toolbar */}
              <div className="flex gap-2">
                <div className="h-4 w-4 rounded bg-brand-light-grey/50" />
                <div className="h-4 w-4 rounded bg-brand-light-grey/50" />
                <div className="h-14 w-px bg-brand-light-grey/20" />
                <div className="h-4 w-12 rounded bg-brand-light-grey/50" />
              </div>
            </div>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full bg-transparent p-10 focus:outline-none text-brand-dark dark:text-brand-light font-body prose prose-brand dark:prose-invert max-w-none"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button className="flex items-center gap-2 rounded-xl border border-brand-light-grey px-6 py-3 text-xs font-bold uppercase tracking-widest text-brand-dark transition-all hover:bg-brand-light-grey dark:border-brand-dark/40 dark:bg-white/5 dark:text-brand-light">
              <Save size={16} /> Save Changes
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-brand-orange px-8 py-3 text-xs font-bold uppercase tracking-widest text-white transition-all hover:translate-y-[-2px] shadow-lg shadow-brand-orange/20">
              <RefreshCcw size={16} /> Resubmit for Review
            </button>
          </div>
        </div>

        {/* 3. Version History Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-black tracking-tighter text-brand-dark dark:text-brand-light font-heading uppercase">
            Version History
          </h3>
          
          <div className="space-y-4">
            {mockRevisionData.history.map((item, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "relative flex items-center gap-4 rounded-2xl border p-5 transition-all",
                  item.status === "Rejected" ? "border-red-200 bg-red-50/30 dark:border-red-500/20 dark:bg-red-500/5 shadow-sm" : 
                  item.status === "In Progress" ? "border-brand-orange/50 bg-brand-orange/5" :
                  "border-brand-light-grey dark:border-brand-dark/20"
                )}
              >
                <div className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg text-white",
                  item.status === "Rejected" ? "bg-red-500" : 
                  item.status === "In Progress" ? "bg-brand-orange" : 
                  "bg-brand-grey"
                )}>
                  {item.status === "Rejected" ? <AlertCircle size={16} /> : <History size={16} />}
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-brand-dark dark:text-brand-light font-heading">{item.version}</p>
                    <span className="text-[10px] font-bold text-brand-grey font-body">{item.date}</span>
                  </div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-brand-grey opacity-70 font-heading">
                    {item.status}
                  </p>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                  <ChevronRight size={16} className="text-brand-grey" />
                </div>
              </div>
            ))}
          </div>

          {/* Diff/Changes Highlight Mock */}
          <div className="rounded-3xl border border-brand-light-grey p-6 dark:border-brand-dark/20 bg-brand-light dark:bg-brand-dark/30">
            <h4 className="mb-4 text-[10px] font-black uppercase tracking-widest text-brand-grey opacity-60 font-heading">
              Key Changes Detected
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                <p className="text-xs font-medium text-brand-dark dark:text-brand-light font-body">Tone adjusted to helpful in paragraph 2</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                <p className="text-xs font-medium text-brand-dark dark:text-brand-light font-body">Headings simplified as requested</p>
              </div>
              <div className="flex items-center gap-2 opacity-50">
                <div className="h-1.5 w-1.5 rounded-full bg-brand-grey" />
                <p className="text-xs font-medium text-brand-grey font-body italic">Still waiting for SEO validation...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
