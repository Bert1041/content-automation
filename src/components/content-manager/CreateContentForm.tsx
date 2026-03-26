"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Trash2, 
  Link as LinkIcon, 
  Sparkles, 
  FileText, 
  Files,
  Check, 
  ChevronDown,
  Loader2,
  Save,
  Copy,
  ExternalLink,
  RotateCcw,
  Mail,
  Twitter,
  Linkedin
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/common/AuthContext";
import { n8nApi } from "@/lib/api/n8n";
import Toast, { ToastType } from "@/components/common/Toast";

export default function CreateContentForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [urls, setUrls] = useState<string[]>([""]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [draftCount, setDraftCount] = useState("3");
  const [idea, setIdea] = useState("");
  const [instructions, setInstructions] = useState("");
  const { user } = useAuth();
  const router = useRouter();
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [results, setResults] = useState<any[] | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (results && results.length > 0 && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [results]);

  const addUrl = () => {
    if (urls.length < 3) {
      setUrls([...urls, ""]);
    }
  };

  const removeUrl = (index: number) => {
    const newUrls = [...urls];
    newUrls.splice(index, 1);
    setUrls(newUrls);
  };

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const togglePlatform = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: string[] = [];
    if (!idea.trim()) newErrors.push("idea");
    if (selectedPlatforms.length === 0) newErrors.push("platforms");
    
    if (newErrors.length > 0) {
      setErrors(newErrors);
      setToast({ message: "Please fill in all required fields.", type: "error" });
      return;
    }

    setErrors([]);

    setIsGenerating(true);
    
    try {
      const response = await n8nApi.submitContentRequest({
         topic: idea,
         referenceUrls: urls.filter(u => u.trim() !== "").join(", "),
         creativeGuidelines: instructions,
         platforms: selectedPlatforms,
         draftCount: draftCount,
         userEmail: user?.email || "unknown_user",
      });
      
      setResults(response);
      setToast({ message: "Content generated successfully!", type: "success" });
      
      // Reset form
      setIdea("");
      setInstructions("");
      setUrls([""]);
      setSelectedPlatforms([]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unknown error occurred";
      console.error(err);
      setToast({ message: "Failed to start generation: " + message, type: "error" });
    } finally {
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center glass-card p-10 text-center animate-fade-in-up">
        <div className="relative mb-10">
          <div className="absolute inset-0 animate-ping rounded-full bg-brand-accent/20 opacity-75" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-brand-accent/10 text-brand-accent shadow-inner">
            <Loader2 size={48} className="animate-spin" strokeWidth={1.5} />
          </div>
        </div>
        <h2 className="mb-3 text-2xl font-semibold tracking-tight text-brand-dark dark:text-brand-light font-heading">
          Generating Your Content
        </h2>
        <p className="max-w-xs text-sm font-normal text-brand-grey font-body leading-relaxed">
          Our AI is weaving your ideas into optimized drafts. This usually takes 30-60 seconds.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-32 relative">
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      {/* Section 1: Content Source */}
      <section className="glass-card p-8 lg:p-10">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-accent/10 text-brand-accent shadow-sm">
            <Sparkles size={22} strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-brand-dark dark:text-brand-light font-heading">
              Content Engine
            </h3>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400 font-body uppercase tracking-wider">AI Generation Sources</p>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Idea Input */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 font-heading">
                Main Idea / Topic
              </label>
              <span className="text-[10px] font-bold text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded-full">REQUIRED</span>
            </div>
            <textarea 
              required
              value={idea}
              onChange={(e) => {
                setIdea(e.target.value);
                if (errors.includes("idea")) setErrors(errors.filter(e => e !== "idea"));
              }}
              rows={6}
              placeholder="What specifically should the content be about?"
              className={cn(
                "w-full rounded-2xl border bg-brand-light-grey/10 p-5 text-brand-dark placeholder:text-slate-500 focus-ring dark:bg-brand-dark/20 dark:text-brand-light font-body shadow-sm transition-all",
                errors.includes("idea") 
                  ? "border-red-500 ring-2 ring-red-500/20" 
                  : "border-brand-light-grey dark:border-brand-dark/40"
              )}
            />
          </div>

          {/* URL Inputs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-widest text-brand-dark/70 dark:text-slate-400 font-heading">
                Reference Material
              </label>
              <span className={cn(
                "text-[10px] font-bold",
                urls.length >= 3 ? "text-brand-grey" : "text-brand-orange"
              )}>
                {urls.length}/3 MAX
              </span>
            </div>
            <div className="space-y-3">
              {urls.map((url, index) => (
                <div key={index} className="group relative flex items-center gap-2">
                  <div className="absolute left-4 text-brand-grey">
                    <LinkIcon size={16} />
                  </div>
                  <input 
                    type="url"
                    value={url}
                    onChange={(e) => updateUrl(index, e.target.value)}
                    placeholder="https://example.com/source-article"
                    className="w-full rounded-xl border border-brand-light-grey bg-brand-light-grey/10 py-3 pl-11 pr-12 text-sm text-brand-dark placeholder:text-slate-500 focus-ring dark:border-brand-dark/40 dark:bg-brand-dark/20 dark:text-brand-light font-body shadow-sm"
                  />
                  {urls.length > 1 && (
                    <button 
                      type="button"
                      onClick={() => removeUrl(index)}
                      className="absolute right-3 p-1 text-brand-grey hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              {urls.length < 3 && (
                <button 
                  type="button"
                  onClick={addUrl}
                  className="flex items-center gap-2 rounded-xl border border-dashed border-brand-accent/40 px-4 py-2.5 text-xs font-semibold text-brand-accent transition-all hover:bg-brand-accent/5 focus-ring"
                >
                  <Plus size={14} strokeWidth={2.5} /> Add URL Source
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 & 3: Selection & Settings */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Platform Selection */}
        <section className={cn(
          "glass-card p-8 lg:p-10 transition-all",
          errors.includes("platforms") 
            ? "border-red-500 ring-2 ring-red-500/20" 
            : "border-brand-light-grey dark:border-brand-dark/20"
        )}>
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-accent/10 text-brand-accent shadow-sm">
              <Check size={22} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-xl font-semibold tracking-tight text-brand-dark dark:text-brand-light font-heading">
                Distribution
              </h3>
              <p className="text-xs font-bold text-brand-dark/60 dark:text-slate-400 font-body uppercase tracking-wider">Target Platforms</p>
            </div>
          </div>

          <div className="space-y-3">
            {["LinkedIn", "X (Twitter)", "Email Newsletter"].map((platform) => (
              <button
                key={platform}
                type="button"
                onClick={() => {
                  togglePlatform(platform);
                  if (errors.includes("platforms")) setErrors(errors.filter(e => e !== "platforms"));
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-2xl border p-4 transition-all duration-300 focus-ring shadow-sm",
                  selectedPlatforms.includes(platform)
                    ? "border-brand-accent bg-brand-accent/5 text-brand-dark dark:text-brand-light"
                    : "border-brand-light-grey hover:border-brand-grey text-slate-600 dark:text-slate-400 dark:border-brand-dark/40"
                )}
              >
                <span className="text-sm font-semibold font-body text-brand-dark dark:text-brand-light">{platform}</span>
                <div className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-300",
                  selectedPlatforms.includes(platform)
                    ? "border-brand-accent bg-brand-accent text-white scale-110"
                    : "border-brand-light-grey dark:border-brand-dark/40"
                )}>
                  {selectedPlatforms.includes(platform) && <Check size={14} strokeWidth={3} />}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Draft Settings */}
        <section className="rounded-[2.5rem] border border-brand-light-grey bg-white p-8 lg:p-10 shadow-xl shadow-brand-dark/5 dark:border-brand-dark/20 dark:bg-white/5">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-accent/10 text-brand-accent shadow-sm">
              <FileText size={22} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-xl font-semibold tracking-tight text-brand-dark dark:text-brand-light font-heading">
                Workflow
              </h3>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400 font-body uppercase tracking-wider">Initial Draft State</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <label className="text-[11px] font-bold uppercase tracking-widest text-brand-dark/70 dark:text-slate-400 font-heading">
                Variations
              </label>
              <div className="relative">
                <select 
                  value={draftCount}
                  onChange={(e) => setDraftCount(e.target.value)}
                  className="w-full appearance-none rounded-2xl border border-brand-light-grey bg-brand-light-grey/10 p-4 pr-12 text-sm font-semibold text-brand-dark focus-ring dark:border-brand-dark/40 dark:bg-brand-dark/20 dark:text-brand-light font-heading shadow-sm"
                >
                  <option value="1">1 Draft</option>
                  <option value="2">2 Drafts</option>
                  <option value="3">3 Drafts (Recommended)</option>
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-brand-grey">
                  <ChevronDown size={20} />
                </div>
              </div>
                <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 italic font-body">
                Each variation will explore a different strategic angle.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Section 4: Optional Notes */}
      <section className="rounded-[2.5rem] border border-brand-light-grey bg-white p-8 lg:p-10 shadow-xl shadow-brand-dark/5 dark:border-brand-dark/20 dark:bg-white/5">
        <label className="mb-4 block text-[11px] font-bold uppercase tracking-widest text-brand-dark/70 dark:text-slate-400 font-heading">
          Creative Guidelines (Optional)
        </label>
        <textarea 
          rows={3}
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Describe the tone, target audience, or specific constraints..."
          className="w-full rounded-2xl border border-brand-light-grey bg-brand-light-grey/10 p-5 text-brand-dark placeholder:text-slate-500 focus-ring dark:border-brand-dark/40 dark:bg-brand-dark/20 dark:text-brand-light font-body shadow-sm"
        />
      </section>

      {/* Section 5: Submit Actions */}
      {!results && (
        <div className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end pb-10">
          <button 
            type="submit"
            disabled={isGenerating}
            className="group relative flex h-14 items-center justify-center gap-2 overflow-hidden rounded-2xl bg-brand-dark px-10 font-semibold text-white shadow-xl transition-all hover:-translate-y-1 hover:shadow-brand-dark/20 active:scale-95 disabled:opacity-50 dark:bg-brand-accent focus-ring"
          >
            <Sparkles size={18} strokeWidth={2} />
            <span className="font-heading tracking-wide">Generate Content</span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
          </button>
        </div>
      )}

      {/* Section 6: Generation Results */}
      {results && (
        <section ref={resultsRef} className="space-y-8 animate-fade-in-up scroll-mt-10">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold tracking-tight text-brand-dark dark:text-brand-light font-heading">
              Generated Drafts
            </h3>
            <div className="flex items-center gap-4">
              <button 
                type="button"
                onClick={() => router.push("/drafts")}
                className="group flex items-center gap-2 rounded-xl bg-brand-dark px-6 py-2.5 text-xs font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 dark:bg-brand-accent shadow-brand-dark/10"
              >
                <Files size={14} />
                Manage All Drafts
              </button>
              <button 
                type="button"
                onClick={() => setResults(null)}
                className="group flex items-center gap-2 rounded-xl border border-brand-light-grey px-4 py-2 text-xs font-bold text-slate-600 transition-all hover:bg-brand-light-grey dark:border-brand-dark/20 dark:text-slate-400 dark:hover:bg-white/5"
              >
                <RotateCcw size={14} className="transition-transform group-hover:-rotate-180" />
                Reset Form
              </button>
            </div>
          </div>

          <div className="grid gap-6">
            {results.map((record: any) => {
              const { fields } = record;
              let content = fields.Content;
              try {
                const parsed = JSON.parse(fields.Content);
                if (parsed.drafts && parsed.drafts[0]) {
                  content = parsed.drafts[0].content;
                }
              } catch (e) {}

              return (
                <div key={record.id} className="glass-card p-8 lg:p-10 group transition-all glass-card-hover">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-accent/10 text-brand-accent">
                        {fields.Platform === "X (Twitter)" ? <Twitter size={18} /> : fields.Platform === "LinkedIn" ? <Linkedin size={18} /> : <Mail size={18} />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-brand-dark dark:text-brand-light font-heading">{fields.Platform}</h4>
                        <p className="text-[10px] uppercase font-bold text-slate-500 opacity-60">Status: {fields.Status}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        type="button"
                        onClick={async (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          try {
                            await navigator.clipboard.writeText(content);
                            setToast({ message: "Copied to clipboard!", type: "success" });
                          } catch (err) {
                            setToast({ message: "Failed to copy.", type: "error" });
                          }
                        }}
                        className="rounded-lg p-2 text-brand-grey hover:bg-brand-accent/10 hover:text-brand-accent transition-all"
                        title="Copy to clipboard"
                      >
                        <Copy size={16} />
                      </button>
                      <a 
                        href="/drafts"
                        className="rounded-lg p-2 text-brand-grey hover:bg-brand-accent/10 hover:text-brand-accent transition-all"
                        title="View all drafts"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>
                  <div className="relative rounded-2xl bg-brand-light-grey/10 p-6 dark:bg-brand-dark/20 border border-brand-light-grey/50 dark:border-brand-dark/10">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-brand-dark dark:text-brand-light font-body">
                      {content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </form>
  );
}
