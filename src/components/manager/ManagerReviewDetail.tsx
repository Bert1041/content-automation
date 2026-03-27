"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  LayoutGrid,
  List as ListIcon,
  History,
  MessageSquare,
  Send,
  Reply as ReplyIcon,
  ShieldCheck,
  Check,
  Loader2,
  Link as LinkIcon,
  Sparkles,
  Zap,
  Linkedin,
  Twitter,
  Mail,
  MoreHorizontal,
  ChevronRight,
  ChevronLeft,
  XCircle,
  AlertCircle,
  Calendar,
  Layout as LayoutIcon,
  AlignEndVertical,
  Paperclip
} from "lucide-react";
import { useRef } from "react";
import { PlatformPreview } from "./PlatformPreview";
import { cn, parseDraftContent } from "@/lib/utils";
import { useAuth } from "@/components/common/AuthContext";
import { n8nApi, Draft as AirtableDraft } from "@/lib/api/n8n";
import { savePublishedContent } from "@/lib/firebase/published";
import { useLayout } from "@/components/common/LayoutContext";

export default function ManagerReviewDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { sidebarCollapsed } = useLayout();
  const [groupDrafts, setGroupDrafts] = useState<AirtableDraft[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Selection & Batch State
  const [selections, setSelections] = useState<Record<string, string>>({}); // { Platform: DraftId }
  const [revisionNotes, setRevisionNotes] = useState<Record<string, string>>({}); // { Platform: Feedback }
  const [currentStage, setCurrentStage] = useState<"selection" | "media" | "deployment">("selection");
  const [imageDirectives, setImageDirectives] = useState<Record<string, string>>({}); // { Platform: Image Style }
  const [imagePlacements, setImagePlacements] = useState<Record<string, "banner" | "bottom" | "attach">>({});
  const [useImageGen, setUseImageGen] = useState<Record<string, boolean>>({}); // { Platform: Generate Image? }
  const [publishType, setPublishType] = useState<"immediate" | "schedule">("immediate");
  const [publishDate, setPublishDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activePlatform, setActivePlatform] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"content" | "preview">("content");

  useEffect(() => {
    const loadData = async () => {
      if (!user?.email || !id) {
        setLoading(false);
        return;
      }
      try {
        const data = await n8nApi.fetchReviewQueue(user.email);
        const queue = Array.isArray(data) ? data : (data as any)?.records || [];
        
        const targetDraft = queue.find((d: AirtableDraft) => d.id === id);
        if (targetDraft) {
          const requestId = targetDraft.fields?.RequestId;
          const group = queue.filter((d: AirtableDraft) => 
            (requestId && d.fields?.RequestId === requestId) || d.id === id
          );
          setGroupDrafts(group);
          
          if (group.length > 0) {
            const platforms = Array.from(new Set(group.map(d => d.fields.Platform)));
            setActivePlatform(platforms[0] || null);
          }
        }
      } catch (err) {
        console.error("Failed to fetch group drafts for review:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user?.email, id]);

  const sectionRefs = useRef<{[key: string]: HTMLElement | null}>({});

  const handleToggleSelection = (draftId: string, platform: string) => {
    setSelections(prev => {
      const next = { ...prev };
      if (prev[platform] === draftId) {
        delete next[platform];
      } else {
        next[platform] = draftId;
      }
      
      // Auto-scroll to next platform
      const sortedPlatforms = Array.from(new Set(groupDrafts.map(d => d.fields.Platform))).sort();
      const currentIndex = sortedPlatforms.indexOf(platform);
      if (currentIndex < sortedPlatforms.length - 1) {
        const nextPlatform = sortedPlatforms[currentIndex + 1];
        setTimeout(() => {
          sectionRefs.current[nextPlatform]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      }
      
      return next;
    });
  };

  const handleUpdateNotes = (platform: string, notes: string) => {
    setRevisionNotes(prev => ({ ...prev, [platform]: notes }));
  };

  const requestId = groupDrafts[0]?.fields?.RequestId;
  const userEmail = user?.email || "anonymous";

  const batchFinalize = async () => {
    if (Object.keys(selections).length === 0) {
      alert("Please select at least one variant before finalizing.");
      return;
    }

    if (publishType === "schedule" && !publishDate) {
      alert("Please select a valid scheduled date.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        requestId,
        userEmail,
        publishStrategy: publishType,
        publishDate: publishType === "schedule" ? publishDate : undefined,
        decisions: groupDrafts.map(draft => {
          const isSelected = selections[draft.fields.Platform] === draft.id;
          const note = revisionNotes[draft.fields.Platform];
          const wantsImage = useImageGen[draft.fields.Platform];
          const imagePrompt = imageDirectives[draft.fields.Platform];
          
          return {
            draftId: draft.id,
            action: isSelected ? (note ? "revision" : "approve") : "reject",
            feedback: note || (isSelected ? "Validated for publication" : "Not selected as platform winner"),
            platform: draft.fields.Platform,
            imageDirective: (isSelected && wantsImage) ? imagePrompt : "",
            imagePlacement: (isSelected && wantsImage) ? imagePlacements[draft.fields.Platform] || "attach" : "none"
          };
        })
      };

      await n8nApi.submitBatchReview(payload);
      
      // Secondary Persistence: Save approved content to Firebase
      const approvedDrafts = groupDrafts.filter(d => selections[d.fields.Platform] === d.id && !revisionNotes[d.fields.Platform]);
      for (const draft of approvedDrafts) {
        await savePublishedContent({
          draftId: draft.id,
          content: draft.fields.Content,
          platform: draft.fields.Platform,
          topic: draft.fields.Topic,
          publishedAt: publishType === "schedule" ? publishDate : new Date().toISOString(),
          managerEmail: userEmail
        });
      }

      alert("Batch Success! All platforms synchronized and archived.");
      window.location.href = "/manager/review";
    } catch (err) {
      console.error("Batch Finalize Error:", err);
      alert("Failed to finalize batch review. Some updates may have failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const platforms = Array.from(new Set(groupDrafts.map(d => d.fields.Platform))).sort();
  const isSelectionComplete = platforms.every(p => selections[p]);

  if (loading) {
    return (
       <div className="flex h-96 flex-col items-center justify-center gap-6">
          <Loader2 className="h-12 w-12 animate-spin text-brand-orange" />
          <div className="text-center space-y-2">
             <p className="text-lg font-black uppercase tracking-tighter text-slate-900 dark:text-white font-heading">Synchronizing with Pipeline</p>
             <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Fetching latest variants from Airtable...</p>
          </div>
       </div>
    );
  }

  if (!groupDrafts.length) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <XCircle className="h-12 w-12 text-red-500" />
        <p className="text-lg font-bold text-slate-900 dark:text-white font-heading">No Drafts Found</p>
        <Link href="/manager/review" className="text-sm font-bold text-brand-orange hover:underline">Return to Queue</Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-32">
      {/* 1. Universal Header & Stepper */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-white p-12 shadow-xl ring-1 ring-slate-200 transition-all duration-500 dark:bg-slate-900/50 dark:ring-white/10">
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-brand-orange/5 blur-[100px] dark:bg-brand-orange/20" />
        
        <div className="flex flex-col gap-12">
          {/* Header Info */}
          <div className="flex items-start justify-between">
            <div className="flex gap-8">
              <Link 
                href="/manager/review"
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.5rem] bg-slate-100 ring-1 ring-slate-200 transition-all hover:bg-slate-200 dark:bg-white/10 dark:ring-white/10 dark:hover:bg-white/20"
              >
                <ChevronLeft size={32} className="text-slate-600 dark:text-white" />
              </Link>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-2 rounded-full bg-brand-orange/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-brand-orange ring-1 ring-brand-orange/30">
                    <div className="h-1.5 w-1.5 rounded-full bg-brand-orange animate-pulse" />
                    Review Pipeline v5.0
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-white/40">{requestId || "BATCH_ID"}</span>
                </div>
                <h1 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white font-heading">
                  {groupDrafts[0]?.fields.Topic}
                </h1>
              </div>
            </div>
          </div>

          {/* Stepper Nav */}
          <div className="flex items-center gap-8">
            {[
              { id: "selection", label: "Variant Selection" },
              { id: "media", label: "Media Refinement" },
              { id: "deployment", label: "Final Deployment" }
            ].map((s, idx) => (
              <React.Fragment key={s.id}>
                <div className="group flex items-center gap-5">
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full text-xs font-black transition-all duration-500 shadow-lg",
                    currentStage === s.id 
                      ? "bg-brand-orange text-white ring-4 ring-brand-orange/20 scale-110" 
                      : "bg-slate-100 text-slate-400 ring-1 ring-slate-200 dark:bg-white/5 dark:text-white/20 dark:ring-white/5"
                  )}>
                    {idx + 1}
                  </div>
                  <div className="space-y-0.5">
                    <p className={cn(
                      "text-[11px] font-black uppercase tracking-widest transition-all duration-500",
                      currentStage === s.id ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-white/20"
                    )}>
                      {s.label}
                    </p>
                    <p className="text-[9px] font-bold text-slate-400 dark:text-white/10 uppercase tracking-tighter">Stage 0{idx + 1}</p>
                  </div>
                </div>
                {idx < 2 && (
                  <div className="h-[2px] w-12 rounded-full bg-slate-100 dark:bg-white/5" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Stage Router */}
      {currentStage === "selection" && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
           {/* Professional Instructions Panel */}
           <div className="rounded-[2.5rem] bg-slate-50 p-10 dark:bg-white/5 ring-1 ring-slate-200 dark:ring-slate-800 animate-in fade-in slide-in-from-top-4 duration-500">
             <div className="flex gap-8">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-brand-orange shadow-lg">
                   <ShieldCheck size={24} />
                </div>
                <div className="space-y-4">
                   <h4 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-slate-100 font-heading">Stage 1: Platform Selection</h4>
                   <ul className="grid gap-x-16 gap-y-3 text-[13px] font-bold text-slate-500 dark:text-slate-400 md:grid-cols-2">
                      <li className="flex items-start gap-3">
                         <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                         <span>Pick your favorite version for each platform.</span>
                      </li>
                      <li className="flex items-start gap-3">
                         <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                         <span>Write a note if you want a revision (skips image gen).</span>
                      </li>
                   </ul>
                </div>
             </div>
          </div>

           {platforms.map((platform) => {
             const drafts = groupDrafts.filter(d => d.fields.Platform === platform);
             return (
               <section 
                 key={platform} 
                 ref={el => sectionRefs.current[platform] = el}
                 className="animate-in fade-in slide-in-from-bottom-6 duration-700 scroll-mt-40"
               >
                 <div className="mb-10 flex items-center gap-5 border-b border-slate-200 pb-8 dark:border-slate-800">
                   <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-xl dark:bg-brand-orange">
                     {platform === "LinkedIn" && <Linkedin size={24} />}
                     {platform.includes("X") && <Twitter size={24} />}
                     {platform.includes("Email") && <Mail size={24} />}
                   </div>
                   <div className="space-y-1">
                     <h2 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white font-heading">{platform}</h2>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{drafts.length} Creative Variants</p>
                   </div>
                 </div>

                 <div className="grid gap-8 lg:grid-cols-2">
                   {drafts.map((draft) => {
                     const isSelected = selections[platform] === draft.id;
                     const hasNote = revisionNotes[platform];

                     return (
                       <div 
                         key={draft.id}
                         onClick={() => handleToggleSelection(draft.id, platform)}
                         className={cn(
                           "group relative cursor-pointer overflow-hidden rounded-[2.5rem] bg-white transition-all duration-500 dark:bg-slate-900 border-2",
                           isSelected 
                             ? "border-emerald-500 shadow-2xl shadow-emerald-500/10 scale-[1.02]" 
                             : "border-slate-100 ring-offset-4 hover:border-slate-300 hover:scale-[1.01] dark:border-white/5 dark:hover:border-white/10"
                         )}
                       >
                         {isSelected && (
                           <div className="absolute right-6 top-6 z-10 animate-in zoom-in duration-500">
                              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                                 <Check size={20} />
                              </div>
                           </div>
                         )}

                         <div className="p-8">
                            <PlatformPreview platform={platform} content={draft.fields.Content} />
                         </div>

                         {isSelected && (
                           <div className="border-t border-slate-100 bg-slate-50/50 p-8 dark:border-white/5 dark:bg-white/5 animate-in slide-in-from-bottom-2 duration-500">
                             <div className="flex items-start gap-6">
                               <div className={cn(
                                 "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors duration-500",
                                 hasNote ? "bg-amber-500 text-white" : "bg-slate-900 text-slate-400 dark:bg-slate-800"
                               )}>
                                 <MessageSquare size={20} />
                               </div>
                               <div className="flex-1 space-y-4">
                                 <div className="space-y-1">
                                   <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Manager Directives</h4>
                                   <p className="text-[11px] font-bold text-slate-500">Request specific adjustments for this variant.</p>
                                 </div>
                                 <textarea
                                   placeholder="Type here to request a revision (e.g. 'Make the tone more professional')..."
                                   className="w-full min-h-[100px] rounded-2xl bg-white p-6 text-[13px] font-bold text-slate-900 focus:outline-none dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 transition-all focus:ring-2 focus:ring-amber-500"
                                   onClick={(e) => e.stopPropagation()}
                                   value={revisionNotes[platform] || ""}
                                   onChange={(e) => handleUpdateNotes(platform, e.target.value)}
                                 />
                                 {hasNote && (
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-amber-500 animate-pulse">
                                       <Zap size={10} className="fill-amber-500" />
                                       <span>Revision requested: Image generation will be skipped.</span>
                                    </div>
                                 )}
                              </div>
                             </div>
                           </div>
                         )}
                       </div>
                     );
                   })}
                 </div>
               </section>
             );
           })}
        </div>
      )}

      {currentStage === "media" && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
           {/* Section Headers */}
           <div className="rounded-[2.5rem] bg-emerald-500 p-10 text-white shadow-xl animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex gap-8">
                 <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-white shadow-lg">
                    <Sparkles size={24} />
                 </div>
                 <div className="space-y-2">
                    <h4 className="text-xl font-black uppercase tracking-tight font-heading">Stage 2: Media Refinement</h4>
                    <p className="text-[13px] font-bold opacity-80">Finalize visual style for your selected platform winners.</p>
                 </div>
              </div>
           </div>

           <div className="grid gap-8">
              {platforms.map(platform => {
                 const winnerId = selections[platform];
                 const winner = groupDrafts.find(d => d.id === winnerId);
                 const hasNote = revisionNotes[platform];
                 if (!winner) return null;

                 return (
                    <div key={platform} className="overflow-hidden rounded-[2.5rem] bg-white shadow-xl dark:bg-slate-900 border border-slate-100 dark:border-white/5">
                       <div className="flex items-center gap-6 border-b border-slate-100 p-8 dark:border-white/5">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-brand-orange">
                            {platform === "LinkedIn" && <Linkedin size={20} />}
                            {platform.includes("X") && <Twitter size={20} />}
                            {platform.includes("Email") && <Mail size={20} />}
                          </div>
                          <div className="space-y-0.5">
                             <h3 className="text-lg font-black tracking-tight dark:text-white font-heading">{platform} Winner</h3>
                             <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Validated for Sync</p>
                          </div>
                       </div>
                       
                       <div className="grid md:grid-cols-2">
                          <div className="p-8 border-r border-slate-100 dark:border-white/5">
                             <PlatformPreview platform={platform} content={winner.fields.Content} />
                          </div>
                          
                          <div className="bg-slate-50/50 p-8 dark:bg-white/5 space-y-8">
                             {hasNote ? (
                                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 p-8">
                                   <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                                      <AlertCircle size={24} />
                                   </div>
                                   <div className="space-y-1">
                                      <p className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white">Revision Mode Active</p>
                                      <p className="text-[11px] font-bold text-slate-500">Images are disabled for variants marked for revision.</p>
                                   </div>
                                </div>
                             ) : (
                                <>
                                   <div className="flex items-center justify-between">
                                      <div className="space-y-1">
                                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Generate Custom Image</label>
                                         <p className="text-[11px] font-bold text-slate-500">Use AI to create a unique visual for this post.</p>
                                      </div>
                                      <button 
                                        onClick={() => setUseImageGen(prev => ({ ...prev, [platform]: !prev[platform] }))}
                                        className={cn(
                                          "relative h-6 w-12 rounded-full transition-colors duration-500",
                                          useImageGen[platform] ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
                                        )}
                                      >
                                         <div className={cn(
                                            "absolute top-1 h-4 w-4 rounded-full bg-white transition-all duration-500",
                                            useImageGen[platform] ? "right-1" : "left-1"
                                         )} />
                                      </button>
                                   </div>

                                   {useImageGen[platform] ? (
                                      <div className="space-y-4 animate-in zoom-in-95 duration-500">
                                         <div className="space-y-2 mt-6">
                                            <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Visual Style Guide</h5>
                                            <textarea
                                              placeholder="E.g. 'Minimalist desk background, high contrast lighting, premium aesthetic'..."
                                              className="w-full min-h-[100px] rounded-2xl bg-white p-6 text-[13px] font-bold text-slate-900 focus:outline-none dark:bg-slate-900/50 dark:text-white border border-slate-200 dark:border-slate-800 transition-all focus:ring-2 focus:ring-emerald-500"
                                              value={imageDirectives[platform] || ""}
                                              onChange={(e) => setImageDirectives(prev => ({ ...prev, [platform]: e.target.value }))}
                                            />
                                         </div>
                                          <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500">
                                             <Zap size={10} className="fill-emerald-500" />
                                             <span>n8n will trigger DALL-E for this platform upon sync.</span>
                                          </div>

                                          {/* Placement Selection */}
                                          <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-white/5">
                                             <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Positioning Strategy</h5>
                                             <div className="flex gap-2">
                                                {[
                                                   { id: "banner", label: "Top Banner", icon: LayoutIcon },
                                                   { id: "bottom", label: "Page Bottom", icon: AlignEndVertical },
                                                   { id: "attach", label: "Attachment", icon: Paperclip }
                                                ].map((pos) => (
                                                   <button
                                                      key={pos.id}
                                                      onClick={() => setImagePlacements(prev => ({ ...prev, [platform]: pos.id as any }))}
                                                      className={cn(
                                                         "flex flex-1 items-center justify-center gap-3 rounded-xl py-3 text-[10px] font-black uppercase tracking-widest transition-all shadow-sm",
                                                         imagePlacements[platform] === pos.id
                                                            ? "bg-slate-900 text-white dark:bg-emerald-500"
                                                            : "bg-white text-slate-500 hover:bg-slate-50 dark:bg-white/5 dark:text-slate-400 border border-slate-100 dark:border-slate-800"
                                                      )}
                                                   >
                                                      <pos.icon size={12} />
                                                      {pos.label}
                                                   </button>
                                                ))}
                                             </div>
                                          </div>
                                      </div>
                                   ) : (
                                      <div className="flex flex-col items-center justify-center h-48 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-white/10 opacity-50">
                                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No Image Required</p>
                                      </div>
                                   )}
                                </>
                             )}
                          </div>
                       </div>
                    </div>
                 );
              })}
           </div>
        </div>
      )}

      {currentStage === "deployment" && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <div className="rounded-[2.5rem] bg-brand-orange p-10 text-white shadow-xl animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex gap-8">
                 <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-white shadow-lg">
                    <History size={24} />
                 </div>
                 <div className="space-y-2">
                    <h4 className="text-xl font-black uppercase tracking-tight font-heading">Stage 3: Deployment Strategy</h4>
                    <p className="text-[13px] font-bold opacity-80">Choose the heartbeat of this content batch.</p>
                 </div>
              </div>
           </div>

           <div className="bg-white rounded-[2.5rem] p-12 shadow-2xl dark:bg-slate-900 border border-slate-100 dark:border-white/5 space-y-12">
              <div className="grid gap-16 md:grid-cols-2">
                 <div className="space-y-8">
                    <div className="space-y-2">
                       <h3 className="text-2xl font-black tracking-tighter dark:text-white font-heading">Publishing Mode</h3>
                       <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Set common sync strategy</p>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                       <button 
                         onClick={() => setPublishType("immediate")}
                         className={cn(
                           "flex items-center justify-between rounded-3xl p-6 transition-all duration-500",
                           publishType === "immediate" 
                            ? "bg-slate-900 text-white shadow-xl scale-[1.02] dark:bg-brand-orange" 
                            : "bg-slate-50 text-slate-500 hover:bg-slate-100 dark:bg-white/5 dark:text-slate-400"
                         )}
                       >
                          <div className="flex items-center gap-4">
                             <div className={cn(
                               "flex h-10 w-10 items-center justify-center rounded-2xl",
                               publishType === "immediate" ? "bg-white/20" : "bg-slate-200 dark:bg-white/10"
                             )}>
                                <Zap size={18} />
                             </div>
                             <div className="text-left">
                                <p className="text-sm font-black uppercase tracking-tight">Instant Sync</p>
                                <p className="text-[10px] font-bold opacity-60">Deploy immediately to all channels</p>
                             </div>
                          </div>
                          {publishType === "immediate" && <Check size={20} />}
                       </button>

                       <button 
                         onClick={() => setPublishType("schedule")}
                         className={cn(
                           "flex items-center justify-between rounded-3xl p-6 transition-all duration-500",
                           publishType === "schedule" 
                            ? "bg-slate-900 text-white shadow-xl scale-[1.02] dark:bg-brand-orange" 
                            : "bg-slate-50 text-slate-500 hover:bg-slate-100 dark:bg-white/5 dark:text-slate-400"
                         )}
                       >
                          <div className="flex items-center gap-4">
                             <div className={cn(
                               "flex h-10 w-10 items-center justify-center rounded-2xl",
                               publishType === "schedule" ? "bg-white/20" : "bg-slate-200 dark:bg-white/10"
                             )}>
                                <History size={18} />
                             </div>
                             <div className="text-left">
                                <p className="text-sm font-black uppercase tracking-tight">Prime Time Schedule</p>
                                <p className="text-[10px] font-bold opacity-60">Queue for optimal engagement window</p>
                             </div>
                          </div>
                          {publishType === "schedule" && <Check size={20} />}
                       </button>
                    </div>
                 </div>

                 {publishType === "schedule" && (
                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-700">
                       <div className="space-y-2">
                          <h3 className="text-2xl font-black tracking-tighter dark:text-white font-heading">Window Selection</h3>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Target a specific date and time</p>
                       </div>
                       <input 
                         type="datetime-local" 
                         className="w-full h-16 rounded-3xl bg-slate-50 px-8 text-sm font-bold text-slate-900 focus:outline-none dark:bg-white/5 dark:text-white border-2 border-slate-100 dark:border-white/10 focus:border-brand-orange"
                         value={publishDate}
                         onChange={(e) => setPublishDate(e.target.value)}
                       />
                    </div>
                 )}
              </div>

              <div className="pt-12 border-t border-slate-100 dark:border-white/5">
                 <div className="flex items-center gap-6 p-8 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white">
                       <ShieldCheck size={24} />
                    </div>
                    <div className="space-y-1">
                       <h4 className="text-sm font-black uppercase tracking-tight dark:text-white">Validation Summary</h4>
                       <p className="text-[11px] font-bold text-slate-500">
                          {platforms.length} Platforms • {Object.keys(useImageGen).filter(k => useImageGen[k]).length} AI Images • Strategy: {publishType.toUpperCase()}
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* 4. Action Bar (Glass Hub) */}
      <div className={cn(
        "fixed bottom-12 z-50 transition-all duration-500",
        sidebarCollapsed ? "left-6 lg:left-[112px]" : "left-6 lg:left-[328px]",
        "right-6 lg:right-12"
      )}>
        <div className="flex items-center justify-between rounded-[2.5rem] bg-white/80 p-4 px-10 shadow-2xl ring-1 ring-slate-200 backdrop-blur-3xl dark:bg-slate-900/90 dark:ring-white/10">
          <div className="flex items-center gap-10">
            {/* Action Meta Info */}
            <div className="hidden items-center gap-6 md:flex">
              <div className="space-y-0.5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Topic Stream</p>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-brand-orange animate-pulse" />
                  <p className="text-[13px] font-black tracking-tight text-slate-900 dark:text-white font-heading">{groupDrafts[0]?.fields.Topic}</p>
                </div>
              </div>
              <div className="h-10 w-[1px] bg-slate-200 dark:bg-white/10" />
              <div className="space-y-0.5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Validation Status</p>
                <div className="flex items-center gap-3">
                  <p className={cn(
                    "text-[13px] font-black tracking-tight transition-colors duration-500",
                    isSelectionComplete ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
                  )}>
                    {Object.keys(selections).length} / {platforms.length} Platforms Ready
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
             {currentStage !== "selection" && (
                <button
                   onClick={() => setCurrentStage(prev => prev === "deployment" ? "media" : "selection")}
                   className="flex h-14 items-center gap-3 rounded-2xl bg-slate-100 px-8 text-[11px] font-black uppercase tracking-widest text-slate-600 transition-all hover:bg-slate-200 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                >
                   <ReplyIcon size={16} />
                   Back
                </button>
             )}

             {currentStage !== "deployment" ? (
                <button
                  disabled={!isSelectionComplete}
                  onClick={() => setCurrentStage(prev => prev === "selection" ? "media" : "deployment")}
                  className={cn(
                    "flex h-16 items-center gap-4 rounded-3xl px-12 transition-all duration-500 font-heading text-sm font-black uppercase tracking-widest",
                    isSelectionComplete 
                      ? "bg-slate-900 text-white shadow-xl hover:scale-[1.02] hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900 dark:hover:bg-white/90" 
                      : "bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-white/5 dark:text-white/30"
                  )}
                >
                  Save & Continue
                  <ChevronRight size={18} />
                </button>
             ) : (
                <button
                  disabled={isSubmitting || (publishType === "schedule" && !publishDate)}
                  onClick={batchFinalize}
                  className={cn(
                    "flex h-16 items-center gap-4 rounded-3xl px-12 transition-all duration-500 font-heading text-sm font-black uppercase tracking-widest",
                    isSubmitting 
                      ? "bg-slate-100 text-slate-400 cursor-wait dark:bg-white/5 dark:text-white/30" 
                      : (publishType === "schedule" && !publishDate)
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-white/5 dark:text-white/30"
                          : "bg-emerald-600 text-white shadow-xl shadow-emerald-600/20 hover:scale-[1.02] hover:bg-emerald-500 active:scale-95 active:shadow-inner dark:bg-emerald-500 dark:shadow-emerald-500/20 dark:hover:bg-emerald-400"
                  )}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Send size={18} />
                      Finalize & Sync All
                    </>
                  )}
                </button>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
