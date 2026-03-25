"use client";

import { 
  CheckCircle2, 
  XCircle, 
  Reply, 
  ChevronLeft, 
  History, 
  MessageSquare,
  Linkedin,
  Twitter,
  Mail,
  MoreVertical,
  ShieldCheck,
  Eye,
  ExternalLink
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { useState } from "react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const mockDraft = {
  id: "DR-123",
  title: "Why Founders need AI to scale marketing in 2026",
  creator: "Julian V.",
  date: "2 hours ago",
  status: "Pending",
  platforms: ["Linkedin", "Twitter"],
  content: `## The Marketing Bottleneck
In 2026, the pace of content production has outstripped human capacity. Founders who try to manage every post, email, and ad manually are hitting an invisible ceiling.

## The Solution: AI Augmentation
It's not about replacing the founder's voice; it's about amplifying it. Using a Content Automation Platform like Fetemi allows you to:

1. **Maintain Consistency**: Never miss a day of posting.
2. **Multi-Channel Presence**: One idea, three formats, localized per platform.
3. **Data-Driven Iteration**: AI analyzes what works and refines the next draft.

## Conclusion
The future is not human vs AI, but human + AI. The founders who win are those who systemize their creativity.`,
  versions: [
    { id: "v1", date: "4 hours ago", content: "Original AI Draft", status: "Revision Required" },
    { id: "v2", date: "2 hours ago", content: "Updated based on feedback", status: "Pending" },
  ],
};

export default function ManagerReviewDetail() {
  const [feedback, setFeedback] = useState("");
  const [activeTab, setActiveTab] = useState<"content" | "preview" | "history">("content");

  return (
    <div className="space-y-10 pb-20">
      {/* 1. Breadcrumbs & Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/manager" className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-light-grey bg-white text-brand-grey transition-all hover:bg-brand-light dark:border-brand-dark/20 dark:bg-white/5">
            <ChevronLeft size={20} />
          </Link>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-orange font-heading">Review Queue</span>
              <span className="text-brand-grey opacity-50">/</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark dark:text-brand-light font-heading">{mockDraft.id}</span>
            </div>
            <h2 className="text-2xl font-black tracking-tighter text-brand-dark dark:text-brand-light font-heading uppercase leading-none">
              {mockDraft.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex h-10 items-center justify-center gap-2 rounded-xl border border-brand-light-grey bg-white px-5 text-xs font-black uppercase tracking-widest text-brand-grey transition-all hover:bg-brand-light dark:border-brand-dark/20 dark:bg-white/5">
            <ExternalLink size={16} />
            <span>View Creator Profile</span>
          </button>
          <button className="flex h-10 items-center justify-center rounded-xl border border-brand-light-grey bg-white px-3 text-brand-grey transition-all hover:bg-brand-light dark:border-brand-dark/20 dark:bg-white/5">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* 2. Left Column: Draft Content & Previews */}
        <div className="lg:col-span-2 space-y-8">
           {/* Tab Switcher */}
           <div className="flex gap-2 rounded-2xl bg-brand-light p-1.5 dark:bg-white/5 w-fit">
              <TabButton active={activeTab === "content"} onClick={() => setActiveTab("content")}>Draft Content</TabButton>
              <TabButton active={activeTab === "preview"} onClick={() => setActiveTab("preview")}>Platform Previews</TabButton>
              <TabButton active={activeTab === "history"} onClick={() => setActiveTab("history")}>Version History</TabButton>
           </div>

           {/* Main Content Area */}
           <div className="min-h-[600px] rounded-[2.5rem] border border-brand-light-grey bg-white p-12 shadow-xl shadow-brand-dark/5 dark:border-brand-dark/20 dark:bg-white/5">
              {activeTab === "content" && (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div className="mb-10 flex items-center justify-between border-b border-brand-light-grey pb-6 dark:border-brand-dark/20">
                     <div className="flex items-center gap-4">
                       <span className="text-[10px] font-black uppercase tracking-widest text-brand-grey font-heading">Reading Time: ~2m</span>
                       <span className="text-[10px] font-black uppercase tracking-widest text-brand-grey font-heading">Drafted by: {mockDraft.creator}</span>
                     </div>
                     <ShieldCheck size={20} className="text-green-500" />
                  </div>
                  <div className="whitespace-pre-wrap font-body text-base leading-relaxed text-brand-dark dark:text-brand-light">
                    {mockDraft.content}
                  </div>
                </div>
              )}

              {activeTab === "preview" && (
                <div className="space-y-12">
                   <PlatformPreview 
                      platform="LinkedIn" 
                      icon={Linkedin} 
                      content={mockDraft.content}
                   />
                   <PlatformPreview 
                      platform="X (Twitter)" 
                      icon={Twitter} 
                      content={mockDraft.content.substring(0, 280)}
                   />
                </div>
              )}

              {activeTab === "history" && (
                <div className="space-y-6">
                  {mockDraft.versions.map((v, i) => (
                    <div key={v.id} className="flex items-start gap-6 rounded-2xl border border-brand-light-grey p-6 dark:border-brand-dark/20">
                       <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-light dark:bg-white/10 text-[10px] font-black font-heading">
                         {mockDraft.versions.length - i}
                       </div>
                       <div className="flex-1 space-y-1">
                          <p className="text-sm font-bold text-brand-dark dark:text-brand-light font-heading">{v.content}</p>
                          <p className="text-[10px] font-bold text-brand-grey font-body uppercase tracking-widest">{v.date} • {v.status}</p>
                       </div>
                       <button className="text-xs font-black uppercase tracking-widest text-brand-orange">Restore</button>
                    </div>
                  ))}
                </div>
              )}
           </div>
        </div>

        {/* 3. Right Column: Review Panel */}
        <div className="space-y-8">
           <div className="rounded-[2.5rem] bg-brand-dark p-10 text-white shadow-2xl shadow-brand-dark/40 dark:bg-white/5 dark:border dark:border-brand-dark/20">
              <div className="mb-8 flex items-center gap-3">
                 <MessageSquare size={24} className="text-brand-orange" />
                 <h3 className="text-xl font-black uppercase tracking-tighter font-heading">Decision Panel</h3>
              </div>

              <div className="space-y-6">
                <div>
                   <label className="mb-3 block text-[10px] font-black uppercase tracking-widest text-white/50 font-heading leading-none">Internal Feedback</label>
                   <textarea 
                      placeholder="Add specific comments for Julian..." 
                      className="min-h-[160px] w-full rounded-2xl bg-white/10 p-5 text-sm font-medium text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-brand-orange transition-all"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                   />
                </div>

                <div className="space-y-3 pb-4">
                   <label className="block text-[10px] font-black uppercase tracking-widest text-white/50 font-heading leading-none">Global Actions</label>
                   <button className="flex w-full items-center justify-center gap-3 rounded-2xl bg-green-500 py-4 text-xs font-black uppercase tracking-widest text-white transition-transform active:scale-95 shadow-lg shadow-green-500/20">
                      <CheckCircle2 size={16} />
                      Final Approval
                   </button>
                   <button className="flex w-full items-center justify-center gap-3 rounded-2xl bg-brand-orange py-4 text-xs font-black uppercase tracking-widest text-white transition-transform active:scale-95 shadow-lg shadow-brand-orange/20">
                      <Reply size={16} />
                      Request Revisions
                   </button>
                   <button className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white/5 py-4 text-xs font-black uppercase tracking-widest text-white/50 border border-white/10 transition-all hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20">
                      <XCircle size={16} />
                      Reject Draft
                   </button>
                </div>
              </div>
           </div>

           {/* Metrics Quick Check */}
           <div className="rounded-[2.5rem] border border-brand-light-grey bg-white p-8 shadow-xl shadow-brand-dark/5 dark:border-brand-dark/20 dark:bg-white/5">
              <h4 className="mb-6 text-sm font-black uppercase tracking-widest text-brand-dark dark:text-brand-light font-heading">Automated SEO Pass</h4>
              <div className="space-y-4">
                 <MetricRow label="Title Length" value="Optimal" status="good" />
                 <MetricRow label="Readability Index" value="High" status="good" />
                 <MetricRow label="Keyword Density" value="Targeted" status="good" />
                 <MetricRow label="Competitor Gap" value="Strong" status="good" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "rounded-xl px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all",
        active ? "bg-white text-brand-dark shadow-sm dark:bg-brand-orange dark:text-white" : "text-brand-grey hover:text-brand-dark"
      )}
    >
      {children}
    </button>
  );
}

function MetricRow({ label, value, status }: { label: string, value: string, status: "good" | "warning" | "error" }) {
  return (
    <div className="flex items-center justify-between border-b border-brand-light-grey pb-3 last:border-0 dark:border-brand-dark/20">
      <span className="text-[10px] font-bold text-brand-grey font-body uppercase tracking-wider">{label}</span>
      <div className="flex items-center gap-2">
         <div className={cn("h-1.5 w-1.5 rounded-full", status === "good" ? "bg-green-500" : "bg-orange-500")} />
         <span className="text-xs font-black text-brand-dark dark:text-brand-light font-heading">{value}</span>
      </div>
    </div>
  );
}

function PlatformPreview({ platform, icon: Icon, content }: { platform: string, icon: any, content: string }) {
  return (
    <div className="space-y-4">
       <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-light dark:bg-white/10">
            <Icon size={16} strokeWidth={2.5} className="text-brand-dark dark:text-brand-light" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-brand-dark dark:text-brand-light font-heading">{platform} Preview</span>
       </div>
       <div className="rounded-2xl border border-brand-light-grey bg-brand-light p-6 dark:border-brand-dark/20 dark:bg-white/5">
          <p className="whitespace-pre-wrap font-body text-sm leading-relaxed text-brand-dark dark:text-brand-light opacity-80">{content}</p>
       </div>
    </div>
  );
}
