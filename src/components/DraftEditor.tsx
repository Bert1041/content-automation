"use client";

import { useState } from "react";
import { 
  Type, 
  Bold, 
  Italic, 
  List, 
  Link as LinkIcon, 
  CheckCircle2, 
  Circle, 
  Save, 
  Trash2, 
  Send, 
  Columns, 
  MoreHorizontal,
  ChevronRight,
  Sparkles,
  Heading1,
  Heading2
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const mockDrafts = [
  {
    id: 1,
    name: "Draft 1",
    angle: "Educational",
    content: "<h1>How Startups Can Use AI for Marketing</h1><p>In 2026, AI is no longer a luxury for startups—it's a necessity. By leveraging large language models, startup marketing teams can scale their output by 10x while maintaining high quality.</p><h2>The Power of Automation</h2><p>Automation allows for consistent messaging across all channels. From SEO-optimized blog posts to snappy social media hooks, the AI-driven pipeline transforms raw ideas into multi-platform content in seconds.</p><h3>Key Benefits</h3><ul><li>Increased efficiency</li><li>Consistent brand voice</li><li>Data-driven SEO optimization</li></ul>",
  },
  {
    id: 2,
    name: "Draft 2",
    angle: "Strategic",
    content: "<h1>Strategic AI Implementation for Startups</h1><p>This draft focuses on the competitive advantage that comes from early AI adoption in marketing departments.</p><h2>The Core Strategy</h2><p>Scaling a startup requires a lean approach. AI-driven content platforms empower small teams to compete with global marketing budgets.</p>",
  },
  {
    id: 3,
    name: "Draft 3",
    angle: "Industry Insight",
    content: "<h1>Modern Marketing: The AI Revolution</h1><p>Deep dive into industry trends and how content automation is reshaping the landscape for founders.</p><h2>The Shift in Workflow</h2><p>Traditional content creation is dead. Long-form content is now structured by algorithms first, then refined by human insight.</p>",
  },
];

export default function DraftEditor() {
  const [selectedDraftId, setSelectedDraftId] = useState(1);
  const [isComparing, setIsComparing] = useState(false);

  const currentDraft = mockDrafts.find(d => d.id === selectedDraftId) || mockDrafts[0];

  return (
    <div className="flex h-[calc(100vh-5rem)] overflow-hidden">
      {/* Left Panel: Draft Selector */}
      <div className="w-64 border-r border-brand-light-grey bg-brand-light dark:border-brand-dark/20 dark:bg-brand-dark/50 p-4">
        <label className="text-[10px] font-bold uppercase tracking-widest text-brand-grey opacity-60 font-heading block mb-4">
          Available Drafts
        </label>
        <div className="space-y-3">
          {mockDrafts.map((draft) => (
            <button
              key={draft.id}
              onClick={() => setSelectedDraftId(draft.id)}
              className={cn(
                "w-full text-left rounded-2xl p-4 transition-all duration-200 border",
                selectedDraftId === draft.id 
                  ? "bg-brand-dark text-brand-light border-brand-dark shadow-lg dark:bg-white dark:text-brand-dark" 
                  : "bg-white border-brand-light-grey hover:border-brand-grey dark:bg-white/5 dark:border-brand-dark/40 dark:text-brand-light"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold font-heading">{draft.name}</span>
                <Sparkles size={12} className={selectedDraftId === draft.id ? "text-brand-orange" : "text-brand-grey"} />
              </div>
              <p className={cn(
                "text-[10px] uppercase font-bold tracking-widest leading-none",
                selectedDraftId === draft.id ? "text-brand-orange" : "text-brand-grey"
              )}>
                {draft.angle}
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
              : "border-brand-light-grey text-brand-grey hover:bg-brand-light-grey dark:border-brand-dark/40"
          )}
        >
          <Columns size={16} />
          {isComparing ? "Exit Comparison" : "Compare Drafts"}
        </button>
      </div>

      {/* Main Panel: Editor */}
      <div className={cn(
        "flex-1 bg-white dark:bg-brand-dark flex flex-col",
        isComparing && "divide-x divide-brand-light-grey dark:divide-brand-dark/20 flex-row"
      )}>
        {/* Editor Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Toolbar */}
          <div className="h-14 border-b border-brand-light-grey bg-brand-light-grey/10 px-6 flex items-center gap-1 dark:border-brand-dark/20">
            <button className="p-2 rounded-lg hover:bg-brand-light-grey dark:hover:bg-white/10 text-brand-dark dark:text-brand-light">
              <Heading1 size={18} />
            </button>
            <button className="p-2 rounded-lg hover:bg-brand-light-grey dark:hover:bg-white/10 text-brand-dark dark:text-brand-light">
              <Heading2 size={18} />
            </button>
            <div className="w-px h-6 bg-brand-light-grey mx-2 dark:bg-brand-dark/40" />
            <button className="p-2 rounded-lg hover:bg-brand-light-grey dark:hover:bg-white/10 text-brand-dark dark:text-brand-light">
              <Bold size={18} />
            </button>
            <button className="p-2 rounded-lg hover:bg-brand-light-grey dark:hover:bg-white/10 text-brand-dark dark:text-brand-light">
              <Italic size={18} />
            </button>
            <button className="p-2 rounded-lg hover:bg-brand-light-grey dark:hover:bg-white/10 text-brand-dark dark:text-brand-light">
              <List size={18} />
            </button>
            <button className="p-2 rounded-lg hover:bg-brand-light-grey dark:hover:bg-white/10 text-brand-dark dark:text-brand-light">
              <LinkIcon size={18} />
            </button>
          </div>

          {/* Scrollable Editor */}
          <div className="flex-1 overflow-y-auto p-12 lg:p-20">
            <div className="max-w-3xl mx-auto">
              <div 
                className="prose prose-brand max-w-none focus:outline-none dark:prose-invert font-body text-brand-dark dark:text-brand-light"
                dangerouslySetInnerHTML={{ __html: currentDraft.content }}
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="h-20 border-t border-brand-light-grey px-8 flex items-center justify-between bg-white dark:bg-brand-dark dark:border-brand-dark/20">
            <button className="flex items-center gap-2 text-brand-grey hover:text-red-500 font-bold text-xs uppercase tracking-widest transition-colors">
              <Trash2 size={16} /> Delete Draft
            </button>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-6 py-3 rounded-xl border border-brand-light-grey text-brand-dark font-bold text-xs uppercase tracking-widest hover:bg-brand-light-grey transition-all dark:bg-white/5 dark:text-brand-light dark:border-brand-dark/40">
                <Save size={16} /> Save Changes
              </button>
              <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-orange text-white font-bold text-xs uppercase tracking-widest hover:translate-y-[-2px] shadow-lg shadow-brand-orange/20 transition-all">
                <Send size={16} /> Send for Review
              </button>
            </div>
          </div>
        </div>

        {/* Side-by-Side Comparison Panel (if enabled) */}
        {isComparing && (
          <div className="flex-1 overflow-y-auto p-12 lg:p-20 bg-brand-light-grey/10">
            <div className="max-w-3xl mx-auto opacity-50">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-grey mb-8">Comparing with Draft 2</p>
              <div 
                className="prose prose-brand max-w-none focus:outline-none dark:prose-invert font-body text-brand-dark dark:text-brand-light"
                dangerouslySetInnerHTML={{ __html: mockDrafts[1].content }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar: SEO Checklist */}
      {!isComparing && (
        <div className="w-80 border-l border-brand-light-grey bg-brand-light dark:border-brand-dark/20 dark:bg-brand-dark/50 p-6 overlow-y-auto">
          <div className="flex items-center gap-2 mb-8">
            <Sparkles size={18} className="text-brand-orange" />
            <h3 className="text-sm font-black uppercase tracking-widest text-brand-dark dark:text-brand-light font-heading">SEO Checklist</h3>
          </div>

          <div className="space-y-6">
            <CheckItem label="Title Present" isChecked={true} />
            <CheckItem label="H1 Present" isChecked={true} />
            <CheckItem label="H2 Sections (min 2)" isChecked={true} />
            <CheckItem label="Primary Keyword Used" isChecked={true} />
            <CheckItem label="Paragraph Length (Short)" isChecked={false} />
            <CheckItem label="Readability (Grade 7)" isChecked={true} />
            <CheckItem label="Internal Links" isChecked={false} />
          </div>

          <div className="mt-10 rounded-2xl bg-brand-orange/5 p-4 border border-brand-orange/10">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-orange mb-2">AI Tip</h4>
            <p className="text-xs font-medium text-brand-dark dark:text-brand-light/80 leading-relaxed font-body">
              Your second H2 section could be shorter to improve mobile readability.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function CheckItem({ label, isChecked }: { label: string; isChecked: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={cn(
        "text-xs font-bold font-heading",
        isChecked ? "text-brand-dark dark:text-brand-light" : "text-brand-grey"
      )}>
        {label}
      </span>
      {isChecked ? (
        <CheckCircle2 size={16} className="text-green-500" />
      ) : (
        <Circle size={16} className="text-brand-light-grey" />
      )}
    </div>
  );
}
