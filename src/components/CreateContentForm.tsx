"use client";

import { useState } from "react";
import { 
  Plus, 
  Trash2, 
  Link as LinkIcon, 
  Sparkles, 
  FileText, 
  Check, 
  ChevronDown,
  Loader2,
  Save
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function CreateContentForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [urls, setUrls] = useState<string[]>([""]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [draftCount, setDraftCount] = useState("3");

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    // Simulate AI workflow
    setTimeout(() => {
      setIsGenerating(false);
      alert("Draft generation process started via n8n workflow.");
    }, 3000);
  };

  if (isGenerating) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[2.5rem] bg-white p-10 text-center shadow-xl shadow-brand-dark/5 dark:bg-white/5">
        <div className="relative mb-8">
          <div className="absolute inset-0 animate-ping rounded-full bg-brand-orange/20 opacity-75" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
            <Loader2 size={48} className="animate-spin" />
          </div>
        </div>
        <h2 className="mb-2 text-3xl font-black tracking-tighter text-brand-dark dark:text-brand-light font-heading">
          GENERATING CONTENT
        </h2>
        <p className="max-w-xs font-medium text-brand-grey font-body">
          Generating SEO optimized drafts based on your requirements...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-20">
      {/* Section 1: Content Source */}
      <section className="rounded-[2.5rem] border border-brand-light-grey bg-white p-10 shadow-xl shadow-brand-dark/5 dark:border-brand-dark/20 dark:bg-white/5">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
            <Sparkles size={20} />
          </div>
          <h2 className="text-xl font-black tracking-tight text-brand-dark dark:text-brand-light font-heading uppercase">
            1. Content Source
          </h2>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Idea Input */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold uppercase tracking-widest text-brand-grey opacity-70 font-heading">
                Content Idea
              </label>
              <span className="text-[10px] font-bold text-brand-orange">REQUIRED</span>
            </div>
            <textarea 
              required
              rows={6}
              placeholder="Enter your content idea or topic..."
              className="w-full rounded-2xl border border-brand-light-grey bg-brand-light-grey/20 p-5 text-brand-dark placeholder:text-brand-grey/50 transition-all focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/5 dark:border-brand-dark/40 dark:bg-brand-dark/20 dark:text-brand-light font-body"
            />
          </div>

          {/* URL Inputs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold uppercase tracking-widest text-brand-grey opacity-70 font-heading">
                Reference URLs
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
                    placeholder="https://example.com/source"
                    className="w-full rounded-xl border border-brand-light-grey bg-brand-light-grey/20 py-3 pl-11 pr-12 text-sm text-brand-dark placeholder:text-brand-grey/50 transition-all focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/5 dark:border-brand-dark/40 dark:bg-brand-dark/20 dark:text-brand-light font-body"
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
                  className="flex items-center gap-2 rounded-xl border border-dashed border-brand-orange/40 px-4 py-2 text-xs font-bold text-brand-orange transition-all hover:bg-brand-orange/5"
                >
                  <Plus size={14} /> Add Reference URL
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 & 3: Selection & Settings */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Platform Selection */}
        <section className="rounded-[2.5rem] border border-brand-light-grey bg-white p-10 shadow-xl shadow-brand-dark/5 dark:border-brand-dark/20 dark:bg-white/5">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
              <Check size={20} />
            </div>
            <h2 className="text-xl font-black tracking-tight text-brand-dark dark:text-brand-light font-heading uppercase">
              2. Platforms
            </h2>
          </div>

          <div className="space-y-3">
            {["LinkedIn", "X (Twitter)", "Email Newsletter"].map((platform) => (
              <button
                key={platform}
                type="button"
                onClick={() => togglePlatform(platform)}
                className={cn(
                  "flex w-full items-center justify-between rounded-2xl border p-4 transition-all duration-200",
                  selectedPlatforms.includes(platform)
                    ? "border-brand-orange bg-brand-orange/5 text-brand-dark dark:text-brand-light"
                    : "border-brand-light-grey hover:border-brand-grey dark:border-brand-dark/40"
                )}
              >
                <span className="text-sm font-bold font-heading">{platform}</span>
                <div className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all",
                  selectedPlatforms.includes(platform)
                    ? "border-brand-orange bg-brand-orange text-white"
                    : "border-brand-light-grey dark:border-brand-dark/40"
                )}>
                  {selectedPlatforms.includes(platform) && <Check size={14} strokeWidth={4} />}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Draft Settings */}
        <section className="rounded-[2.5rem] border border-brand-light-grey bg-white p-10 shadow-xl shadow-brand-dark/5 dark:border-brand-dark/20 dark:bg-white/5">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
              <FileText size={20} />
            </div>
            <h2 className="text-xl font-black tracking-tight text-brand-dark dark:text-brand-light font-heading uppercase">
              3. Settings
            </h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-brand-grey opacity-70 font-heading">
                Number of AI Drafts
              </label>
              <div className="relative">
                <select 
                  value={draftCount}
                  onChange={(e) => setDraftCount(e.target.value)}
                  className="w-full appearance-none rounded-2xl border border-brand-light-grey bg-brand-light-grey/20 p-4 pr-12 text-sm font-bold text-brand-dark transition-all focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/5 dark:border-brand-dark/40 dark:bg-brand-dark/20 dark:text-brand-light font-heading"
                >
                  <option value="1">1 Draft</option>
                  <option value="2">2 Drafts</option>
                  <option value="3">3 Drafts (Recommended)</option>
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-brand-grey">
                  <ChevronDown size={20} />
                </div>
              </div>
              <p className="text-[11px] font-medium text-brand-grey italic font-body">
                Each draft will present a different perspective of the topic.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Section 4: Optional Notes */}
      <section className="rounded-[2.5rem] border border-brand-light-grey bg-white p-10 shadow-xl shadow-brand-dark/5 dark:border-brand-dark/20 dark:bg-white/5">
        <label className="mb-4 block text-sm font-bold uppercase tracking-widest text-brand-grey opacity-70 font-heading">
          Additional instructions for AI (Optional)
        </label>
        <textarea 
          rows={3}
          placeholder="e.g. Focus on a strategic angle, use a helpful tone..."
          className="w-full rounded-2xl border border-brand-light-grey bg-brand-light-grey/20 p-5 text-brand-dark placeholder:text-brand-grey/50 transition-all focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/5 dark:border-brand-dark/40 dark:bg-brand-dark/20 dark:text-brand-light font-body"
        />
      </section>

      {/* Section 5: Submit Actions */}
      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">
        <button 
          type="button"
          className="group flex h-14 items-center justify-center gap-2 rounded-2xl border border-brand-light-grey bg-white px-8 font-bold text-brand-dark transition-all hover:bg-brand-light-grey dark:border-brand-dark/20 dark:bg-white/5 dark:text-brand-light dark:hover:bg-white/10"
        >
          <Save size={18} />
          <span className="font-heading">Save as Draft</span>
        </button>
        <button 
          type="submit"
          className="group relative flex h-14 items-center justify-center gap-2 overflow-hidden rounded-2xl bg-brand-dark px-10 font-bold text-white transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-dark/20 dark:bg-brand-orange dark:hover:shadow-brand-orange/20"
        >
          <Sparkles size={18} />
          <span className="font-heading tracking-tight">Generate Drafts</span>
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
        </button>
      </div>
    </form>
  );
}
