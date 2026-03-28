"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { 
  Bold, 
  Italic, 
  List, 
  Link as LinkIcon, 
  CheckCircle2, 
  Circle, 
  Save, 
  Trash2, 
  Columns, 
  Sparkles,
  Heading1,
  Heading2,
  Loader2,
  AlertCircle,
  ChevronLeft
} from "lucide-react";
import { cn, parseDraftContent } from "@/lib/utils";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/common/AuthContext";
import { n8nApi } from "@/lib/api/n8n";
import { type FirestoreDraft, fetchDraftsFromFirestore, updateDraftInFirestore } from "@/lib/firebase/drafts";
import Toast, { ToastType } from "@/components/common/Toast";

interface DraftEditorProps {
  requestId?: string;
}

export default function DraftEditor({ requestId }: DraftEditorProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [drafts, setDrafts] = useState<FirestoreDraft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null);
  const [comparisonDraftId, setComparisonDraftId] = useState<string | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const applyFormatting = (prefix: string, suffix: string = "") => {
    if (!textareaRef.current || !selectedDraftId) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selection = text.substring(start, end);
    
    let replacement = "";
    if (prefix.startsWith("#") || prefix === "- ") {
      const beforeText = text.substring(0, start);
      const needsNewline = beforeText.length > 0 && !beforeText.endsWith("\n");
      replacement = (needsNewline ? "\n" : "") + prefix + (selection || "Text");
    } else {
      replacement = prefix + (selection || "Text") + suffix;
    }

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    handleUpdateContent(newContent);
    
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + replacement.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  useEffect(() => {
    async function fetchDrafts() {
      if (!user?.email) return;
      setIsLoading(true);
      try {
        const allDrafts = await fetchDraftsFromFirestore(user.email);
        const filtered = requestId 
          ? allDrafts.filter((d: FirestoreDraft) => (d.requestId === requestId || d.id === requestId))
          : allDrafts;
        
        setDrafts(filtered || []);
        if (filtered && filtered.length > 0) {
          setSelectedDraftId(filtered[0].id);
          if (filtered.length > 1) {
            setComparisonDraftId(filtered[1].id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch drafts:", error);
        setToast({ message: "Failed to load drafts.", type: "error" });
      } finally {
        setIsLoading(false);
      }
    }
    fetchDrafts();
  }, [user?.email, requestId]);

  const currentDraft = useMemo(() => 
    drafts.find(d => d.id === selectedDraftId), 
  [drafts, selectedDraftId]);

  const seoStats = useMemo(() => {
    if (!currentDraft) return { hasTitle: false, hasH1: false, h2Count: 0 };
    const content = parseDraftContent(currentDraft.content, currentDraft.platform);
    
    // Robust detection: 
    // - Title: Any line starting with 1-6 # or a very short first line that is bolded
    // - H1: Specifically level 1 header
    // - H2+: Any line starting with 2 or more # 
    const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const hasH1 = lines.some(l => /^#\s+.+/.test(l));
    const h2Matches = content.match(/^\s*##+\s+.+/gm) || [];
    
    return {
      hasTitle: hasH1 || lines.some(l => /^#{1,4}\s+.+/.test(l)) || (lines[0]?.startsWith('**') && lines[0]?.endsWith('**')),
      hasH1: hasH1,
      h2Count: h2Matches.length
    };
  }, [currentDraft]);

  const handleUpdateContent = (content: string) => {
    if (!selectedDraftId) return;
    setDrafts(prev => prev.map(d => 
      d.id === selectedDraftId 
        ? { ...d, content: content } 
        : d
    ));
  };

  const handleSave = async () => {
    if (!user?.email || !currentDraft) return;
    const saveId = currentDraft.id;
    setIsSaving(true);
    try {
      // Parallel update: Airtable (via n8n) and Firestore (direct)
      // This ensures the dashboard stays in sync immediately
      await Promise.all([
        n8nApi.updateDraft({
          id: saveId,
          fields: { Content: currentDraft.content },
          userEmail: user.email
        }),
        updateDraftInFirestore(saveId, {
          content: currentDraft.content
        })
      ]);
      
      setToast({ message: "Changes saved successfully.", type: "success" });
    } catch (error) {
      console.error("[DraftEditor] Failed to save draft:", error);
      setToast({ message: "Failed to save changes.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDraft = async () => {
    if (!user?.email || !currentDraft) return;
    if (!confirm("Are you sure you want to delete all variations for this request?")) return;
    
    setIsSaving(true);
    try {
      for (const draft of drafts) {
        await n8nApi.deleteDraft({
          id: draft.id,
          userEmail: user.email
        });
      }
      router.push('/drafts');
      setToast({ message: "Drafts deleted successfully.", type: "success" });
    } catch (error) {
      console.error("Failed to delete draft:", error);
      setToast({ message: "Failed to delete drafts.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-white dark:bg-brand-dark">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-brand-accent" />
          <p className="mt-4 text-sm font-medium text-brand-grey">Loading editor...</p>
        </div>
      </div>
    );
  }

  if (drafts.length === 0) {
    return (
      <div className="flex h-full items-center justify-center bg-white dark:bg-brand-dark">
        <div className="text-center max-w-md p-8">
          <AlertCircle className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <h3 className="text-lg font-bold text-brand-dark dark:text-brand-light mb-2">No Drafts Found</h3>
          <p className="text-sm text-brand-grey mb-6">We couldn't find any drafts for this request.</p>
          <button onClick={() => router.push('/drafts')} className="text-brand-accent font-bold hover:underline">Back to My Drafts</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden">
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      
      {/* Left Panel: Draft Selector */}
      <div className="w-64 border-r border-brand-light-grey bg-brand-light dark:border-brand-dark/20 dark:bg-brand-dark/50 p-4 flex flex-col">
        <button 
          onClick={() => router.push('/drafts')}
          className="mb-8 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-brand-accent transition-colors"
        >
          <ChevronLeft size={16} /> Back to Drafts
        </button>

        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 font-heading block mb-4">
          Available Variations
        </label>
        <div className="flex-1 overflow-y-auto pr-1 space-y-3 scrollbar-hide">
          {drafts.map((draft, idx) => (
            <button
              key={draft.id}
              onClick={() => setSelectedDraftId(draft.id)}
              className={cn(
                "w-full text-left rounded-2xl p-4 transition-all duration-200 border",
                selectedDraftId === draft.id 
                  ? "bg-brand-dark text-brand-light border-brand-dark shadow-lg dark:bg-white dark:text-brand-dark" 
                  : "bg-white border-brand-light-grey hover:border-brand-grey dark:bg-white/5 dark:border-brand-dark/40 text-slate-700 dark:text-slate-300"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold font-heading truncate">Variation {idx + 1}</span>
                <Sparkles size={12} className={selectedDraftId === draft.id ? "text-brand-orange" : "text-slate-400"} />
              </div>
              <p className={cn(
                "text-[10px] uppercase font-bold tracking-wider leading-none",
                selectedDraftId === draft.id ? "text-brand-orange" : "text-slate-500 dark:text-slate-400"
              )}>
                {draft.platform}
              </p>
            </button>
          ))}
        </div>

        <button 
          onClick={() => setIsComparing(!isComparing)}
          className={cn(
            "mt-8 w-full flex items-center justify-center gap-2 rounded-2xl p-4 border text-xs font-bold transition-all",
            isComparing 
              ? "bg-brand-orange text-white border-brand-orange" 
              : "border-brand-light-grey text-slate-700 hover:bg-brand-light-grey dark:border-brand-dark/40 dark:text-slate-300"
          )}
        >
          <Columns size={16} />
          {isComparing ? "Exit Comparison" : "Compare Drafts"}
        </button>
      </div>

      {/* Main Panel: Editor */}
      <div className={cn(
        "flex-1 bg-white dark:bg-brand-dark flex min-w-0",
        isComparing 
          ? "divide-x divide-brand-light-grey dark:divide-brand-dark/20 flex-row" 
          : "flex-col"
      )}>
        {/* Editor Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="h-14 border-b border-brand-light-grey bg-brand-light-grey/10 px-6 flex items-center gap-1 dark:border-brand-dark/20">
            <button onClick={() => applyFormatting("# ")} className="p-2 rounded-lg hover:bg-brand-light-grey dark:hover:bg-white/10 text-brand-dark" title="Heading 1"><Heading1 size={18} /></button>
            <button onClick={() => applyFormatting("## ")} className="p-2 rounded-lg hover:bg-brand-light-grey dark:hover:bg-white/10 text-brand-dark" title="Heading 2"><Heading2 size={18} /></button>
            <div className="w-px h-6 bg-brand-light-grey mx-2 dark:bg-brand-dark/40" />
            <button onClick={() => applyFormatting("**", "**")} className="p-2 rounded-lg hover:bg-brand-light-grey dark:hover:bg-white/10 text-brand-dark" title="Bold"><Bold size={18} /></button>
            <button onClick={() => applyFormatting("*", "*")} className="p-2 rounded-lg hover:bg-brand-light-grey dark:hover:bg-white/10 text-brand-dark" title="Italic"><Italic size={18} /></button>
            <button onClick={() => applyFormatting("- ")} className="p-2 rounded-lg hover:bg-brand-light-grey dark:hover:bg-white/10 text-brand-dark" title="List"><List size={18} /></button>
            <button onClick={() => applyFormatting("[", "](url)")} className="p-2 rounded-lg hover:bg-brand-light-grey dark:hover:bg-white/10 text-brand-dark" title="Link"><LinkIcon size={18} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-12 lg:p-20 bg-white dark:bg-brand-dark scroll-premium">
            <div className="max-w-3xl mx-auto">
              <textarea 
                ref={textareaRef}
                className="w-full min-h-[500px] p-0 border-none focus:ring-0 bg-transparent text-brand-dark dark:text-brand-light font-body text-lg leading-relaxed resize-none"
                value={parseDraftContent(currentDraft?.content || "", currentDraft?.platform)}
                onChange={(e) => handleUpdateContent(e.target.value)}
                onBlur={handleSave}
                placeholder="Start writing..."
              />
            </div>
          </div>

          <div className="h-20 border-t border-brand-light-grey px-8 flex items-center justify-between bg-white dark:bg-brand-dark dark:border-brand-dark/20">
            <button onClick={handleDeleteDraft} className="flex items-center gap-2 text-slate-500 hover:text-red-500 font-semibold text-xs uppercase tracking-wider transition-colors"><Trash2 size={16} /> Delete Draft</button>
            <div className="flex gap-4">
              <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-6 py-3 rounded-xl border border-brand-light-grey text-brand-dark font-semibold text-xs uppercase tracking-wider hover:bg-brand-light-grey transition-all dark:bg-white/5 dark:text-brand-light disabled:opacity-50">
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* Side-by-Side Comparison Panel */}
        {isComparing && (
          <div className="flex-1 overflow-y-auto p-12 lg:p-20 bg-brand-light-grey/10 border-l border-brand-light-grey dark:border-brand-dark/20 scroll-premium">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Comparing with {(() => {
                    const compId = comparisonDraftId || drafts.find(d => d.id !== selectedDraftId)?.id;
                    const comparisonDraft = drafts.find(d => d.id === compId);
                    return comparisonDraft?.platform || "Variation";
                  })()}
                </p>
                {drafts.length > 2 && (
                  <div className="flex gap-2">
                    {drafts.filter(d => d.id !== selectedDraftId).map(d => (
                       <button
                         key={d.id}
                         onClick={() => setComparisonDraftId(d.id)}
                         className={cn(
                           "px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition-all",
                           comparisonDraftId === d.id ? "bg-brand-accent text-white" : "bg-brand-light-grey/20 text-slate-500"
                         )}
                       >
                         {d.platform}
                       </button>
                    ))}
                  </div>
                )}
              </div>
              <MarkdownRenderer 
                content={(() => {
                  const compId = comparisonDraftId || drafts.find(d => d.id !== selectedDraftId)?.id;
                  const comparisonDraft = drafts.find(d => d.id === compId);
                  return parseDraftContent(comparisonDraft?.content || "", comparisonDraft?.platform);
                })()}
                className="opacity-70"
              />
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar: SEO Checklist */}
      {!isComparing && (
        <div className="w-80 border-l border-brand-light-grey bg-brand-light dark:border-brand-dark/20 dark:bg-brand-dark/50 p-6 overflow-y-auto">
          <div className="flex items-center gap-2 mb-8"><Sparkles size={18} className="text-brand-accent" /><h3 className="text-sm font-semibold uppercase tracking-wider text-brand-dark font-heading">SEO Insights</h3></div>
          <div className="space-y-6">
            <CheckItem label="Title Present" isChecked={seoStats.hasTitle} />
            <CheckItem label="H1 Present" isChecked={seoStats.hasH1} />
            <CheckItem label="H2 Sections (min 2)" isChecked={seoStats.h2Count >= 2} />
          </div>
        </div>
      )}
    </div>
  );
}

function CheckItem({ label, isChecked }: { label: string; isChecked: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={cn("text-xs font-medium font-heading", isChecked ? "text-brand-dark" : "text-slate-500")}>{label}</span>
      {isChecked ? <CheckCircle2 size={16} className="text-green-500" /> : <Circle size={16} className="text-brand-light-grey" />}
    </div>
  );
}
