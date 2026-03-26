"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  CheckCircle2, 
  XCircle, 
  Reply, 
  ChevronLeft, 
  ShieldCheck,
  ExternalLink,
  Calendar,
  Zap,
  Loader2,
  Linkedin,
  Twitter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/common/AuthContext";
import { n8nApi } from "@/lib/api/n8n";

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
  const [approvalMode, setApprovalMode] = useState<"none" | "approve" | "request_revision" | "reject">("none");
  const [publishType, setPublishType] = useState<"immediate" | "schedule">("immediate");
  const [publishDate, setPublishDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleAction = (mode: "approve" | "request_revision" | "reject") => {
    setApprovalMode(mode);
  };

  const submitReview = async () => {
    if (approvalMode === "none") return;
    
    if ((approvalMode === "request_revision" || approvalMode === "reject") && !feedback.trim()) {
      alert("Please provide feedback for this decision.");
      return;
    }
    
    if (approvalMode === "approve" && publishType === "schedule" && !publishDate) {
      alert("Please select a valid scheduled date.");
      return;
    }

    setIsSubmitting(true);
    try {
      await n8nApi.submitManagerReview({
        draftId: mockDraft.id,
        action: approvalMode,
        feedback,
        publishDate: approvalMode === "approve" && publishType === "schedule" ? publishDate : undefined,
        userEmail: user?.email || "unknown_manager"
      });
      alert(`Review submitted successfully via n8n webhook: ${approvalMode.toUpperCase()}`);
      window.location.href = "/manager";
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unknown error occurred";
      console.error(err);
      alert("Failed to submit review: " + message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* 1. Breadcrumbs & Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/manager/review" className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-light-grey bg-white text-slate-600 transition-all hover:bg-brand-light dark:border-brand-dark/20 dark:bg-white/5">
            <ChevronLeft size={20} />
          </Link>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-accent font-heading">Review Queue</span>
              <span className="text-slate-300 dark:text-brand-dark/50">/</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-dark dark:text-brand-light font-heading">{mockDraft.id}</span>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-brand-dark dark:text-brand-light font-heading uppercase leading-none">
              {mockDraft.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex h-10 items-center justify-center gap-2 rounded-xl border border-brand-light-grey bg-white px-5 text-xs font-bold uppercase tracking-wider text-slate-600 transition-all hover:bg-brand-light dark:border-brand-dark/20 dark:bg-white/5">
            <ExternalLink size={16} />
            <span className="hidden sm:inline">View Profile</span>
          </button>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* 2. Left Column: Draft Content & Previews */}
        <div className="lg:col-span-2 space-y-8">
           <div className="flex gap-2 rounded-2xl bg-brand-light p-1.5 dark:bg-white/5 w-fit">
              <TabButton active={activeTab === "content"} onClick={() => setActiveTab("content")}>Draft Content</TabButton>
              <TabButton active={activeTab === "preview"} onClick={() => setActiveTab("preview")}>Platform Previews</TabButton>
              <TabButton active={activeTab === "history"} onClick={() => setActiveTab("history")}>History</TabButton>
           </div>

           <div className="min-h-[500px] rounded-[2.5rem] border border-brand-light-grey bg-white p-8 md:p-12 shadow-xl shadow-brand-dark/5 dark:border-brand-dark/20 dark:bg-white/5">
              {activeTab === "content" && (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div className="mb-10 flex items-center justify-between border-b border-brand-light-grey pb-6 dark:border-brand-dark/20">
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 font-heading">Reading Time: ~2m</span>
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
                    <div key={v.id} className="flex items-start gap-4 rounded-2xl border border-brand-light-grey p-6 dark:border-brand-dark/20">
                       <span className="text-[10px] font-black font-heading bg-brand-light dark:bg-white/10 p-2 rounded-lg">{mockDraft.versions.length - i}</span>
                       <div className="flex-1">
                          <p className="text-sm font-bold text-brand-dark dark:text-brand-light font-heading">{v.content}</p>
                          <p className="text-[10px] font-bold text-brand-grey font-body uppercase tracking-widest">{v.date} • {v.status}</p>
                       </div>
                    </div>
                  ))}
                </div>
              )}
           </div>
        </div>

        {/* 3. Right Column: Decision & Feedback */}
        <div className="space-y-8">
           <div className="rounded-[2.5rem] border border-brand-light-grey bg-white p-10 shadow-xl shadow-brand-dark/5 dark:border-brand-dark/20 dark:bg-white/5 overflow-hidden relative">
              <div className="mb-8 flex items-center gap-3">
                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-dark text-white dark:bg-brand-orange">
                    <Zap size={20} />
                 </div>
                 <h3 className="text-xl font-black uppercase tracking-tighter font-heading text-brand-dark dark:text-brand-light">Decision Panel</h3>
              </div>

              {approvalMode === "none" ? (
                <div className="space-y-4">
                   <button 
                      onClick={() => handleAction("approve")}
                      className="flex w-full items-center justify-center gap-3 rounded-2xl bg-green-500 py-4 text-xs font-black uppercase tracking-widest text-white transition-all active:scale-95 shadow-lg shadow-green-500/20"
                   >
                      <CheckCircle2 size={16} />
                      Approve Draft
                   </button>
                   <button 
                      onClick={() => handleAction("request_revision")}
                      className="flex w-full items-center justify-center gap-3 rounded-2xl bg-brand-orange py-4 text-xs font-black uppercase tracking-widest text-white transition-all active:scale-95 shadow-lg shadow-brand-orange/20"
                   >
                      <Reply size={16} />
                      Request Revision
                   </button>
                   <button 
                      onClick={() => handleAction("reject")}
                      className="flex w-full items-center justify-center gap-3 rounded-2xl border border-brand-light-grey bg-white py-4 text-xs font-black uppercase tracking-widest text-brand-grey transition-all hover:bg-red-50 text-red-500 hover:border-red-200 dark:bg-white/5 dark:border-brand-dark/20"
                   >
                      <XCircle size={16} />
                      Reject Draft
                   </button>
                </div>
              ) : (
                <div className="space-y-6">
                   {/* Comments Field (Mandatory for Revision/Reject) */}
                   {(approvalMode === "request_revision" || approvalMode === "reject") && (
                     <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-brand-light-grey/40 font-heading">Why is this {approvalMode === "request_revision" ? "revision" : approvalMode}ed? *</label>
                        <textarea 
                           className="min-h-[140px] w-full rounded-2xl bg-brand-light p-5 text-sm font-medium text-brand-dark placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-orange dark:bg-white/5 dark:text-brand-light border border-transparent focus:border-brand-orange transition-all"
                           placeholder="Enter your feedback for the content manager..."
                           value={feedback}
                           onChange={(e) => setFeedback(e.target.value)}
                        />
                     </div>
                   )}

                   {/* Approval Scheduling */}
                   {approvalMode === "approve" && (
                     <div className="space-y-6">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-widest text-brand-grey font-heading">Publishing Strategy</label>
                           <div className="grid grid-cols-2 gap-3">
                              <button 
                                 onClick={() => setPublishType("immediate")}
                                 className={cn(
                                   "flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all",
                                   publishType === "immediate" ? "border-brand-dark bg-brand-light shadow-inner dark:border-brand-orange dark:bg-brand-orange/10" : "border-brand-light-grey bg-white dark:border-brand-dark/20 dark:bg-white/5"
                                 )}
                              >
                                 <Zap size={16} className={publishType === "immediate" ? "text-brand-orange" : "text-slate-400"} />
                                 <span className="text-[9px] font-semibold uppercase tracking-wider">Immediate</span>
                              </button>
                              <button 
                                 onClick={() => setPublishType("schedule")}
                                 className={cn(
                                   "flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all",
                                   publishType === "schedule" ? "border-brand-dark bg-brand-light shadow-inner dark:border-brand-orange dark:bg-brand-orange/10" : "border-brand-light-grey bg-white dark:border-brand-dark/20 dark:bg-white/5"
                                 )}
                              >
                                 <Calendar size={16} className={publishType === "schedule" ? "text-brand-orange" : "text-slate-400"} />
                                 <span className="text-[9px] font-semibold uppercase tracking-wider">Schedule</span>
                              </button>
                           </div>
                        </div>

                        {publishType === "schedule" && (
                          <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
                             <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-brand-light-grey/40 font-heading">Select Date & Time</label>
                             <input 
                                type="datetime-local" 
                                className="w-full rounded-2xl bg-brand-light p-4 text-sm font-bold text-brand-dark focus:outline-none dark:bg-white/5 dark:text-brand-light border border-brand-light-grey dark:border-brand-dark/20"
                                value={publishDate}
                                onChange={(e) => setPublishDate(e.target.value)}
                             />
                          </div>
                        )}
                     </div>
                   )}

                   {/* Confirm Button */}
                   <div className="flex flex-col gap-3 pt-6">
                      <button 
                         onClick={submitReview}
                         disabled={isSubmitting}
                         className={cn(
                        "flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl transition-all active:scale-95 disabled:opacity-50",
                        approvalMode === "approve" ? "bg-green-500 shadow-green-500/20" : 
                        approvalMode === "request_revision" ? "bg-brand-orange shadow-brand-orange/20" :
                        "bg-red-500 shadow-red-500/20"
                      )}>
                         {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : `Confirm ${approvalMode}`}
                      </button>
                      <button 
                         onClick={() => setApprovalMode("none")}
                         className="w-full text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-brand-dark"
                      >
                         Cancel Action
                      </button>
                   </div>
                </div>
              )}
           </div>

           {/* SEO Check Card */}
           <div className="rounded-[2.5rem] border border-brand-light-grey bg-white p-8 shadow-xl shadow-brand-dark/5 dark:border-brand-dark/20 dark:bg-white/5">
              <h4 className="mb-6 text-[10px] font-black uppercase tracking-widest text-brand-dark dark:text-brand-light font-heading">System Verification</h4>
              <div className="space-y-4">
                 <MetricRow label="H1 Structure" value="Verified" status="good" />
                 <MetricRow label="Section Density" value="Optimal" status="good" />
                 <MetricRow label="Reading Score" value="78/100" status="good" />
                 <MetricRow label="Keyword Pass" value="92%" status="good" />
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
       <span className="text-[10px] font-bold text-slate-600 dark:text-brand-light-grey/40 font-body capitalize">{label}</span>
      <div className="flex items-center gap-2">
         <div className={cn("h-1.5 w-1.5 rounded-full", status === "good" ? "bg-green-500" : "bg-orange-500")} />
         <span className="text-xs font-semibold text-brand-dark dark:text-brand-light font-heading">{value}</span>
      </div>
    </div>
  );
}

function PlatformPreview({ platform, icon: Icon, content }: { platform: string, icon: React.ElementType, content: string }) {
  return (
    <div className="space-y-4">
       <div className="flex items-center gap-2">
          <Icon size={16} className="text-brand-dark dark:text-brand-light" />
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-dark dark:text-brand-light font-heading">{platform} Preview</span>
       </div>
       <div className="rounded-2xl border border-brand-light-grey bg-brand-light/50 p-6 dark:border-brand-dark/20 dark:bg-white/5">
          <p className="whitespace-pre-wrap font-body text-sm leading-relaxed text-brand-dark dark:text-brand-light opacity-80">{content}</p>
       </div>
    </div>
  );
}
