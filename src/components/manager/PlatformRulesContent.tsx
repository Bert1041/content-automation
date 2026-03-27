"use client";

import { 
  Linkedin, 
  Twitter, 
  Mail, 
  Save, 
  Sparkles,
  MousePointer2,
  Loader2,
  AlertCircle,
  RefreshCw,
  Share2,
  Heart,
  MessageSquare,
  Plus,
  Trash2,
  X as XIconLucide,
  RotateCcw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Platform } from "@/types/content";
import { useState, useEffect, useCallback, useRef } from "react";
import { n8nApi } from "@/lib/api/n8n";
import { useAuth } from "@/components/common/AuthContext";
import Toast, { ToastType } from "@/components/common/Toast";

interface PlatformRuleItem {
  id: string;
  Platform: string;
  Rule_Name: string;
  Description: string;
  Active: boolean;
  Char_Limit?: number;
}

const platformMeta: Record<string, { label: string; icon: React.ElementType; color: string; bgColor: string; identifier: string }> = {
  linkedin: { 
    label: "LinkedIn", 
    icon: Linkedin, 
    color: "text-[#0077b5]", 
    bgColor: "bg-[#0077b5]/10",
    identifier: "LinkedIn" 
  },
  twitter: { 
    label: "X (Twitter)", 
    icon: Twitter, 
    color: "text-brand-dark dark:text-white", 
    bgColor: "bg-brand-dark/10 dark:bg-white/10",
    identifier: "X (Twitter)" 
  },
  email: { 
    label: "Email", 
    icon: Mail, 
    color: "text-brand-orange", 
    bgColor: "bg-brand-orange/10",
    identifier: "Email" 
  }
};

export default function PlatformRulesContent() {
  const { user, role } = useAuth();
  const [activePlatform, setActivePlatform] = useState<Platform>("linkedin");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rules, setRules] = useState<PlatformRuleItem[]>([]);
  const [dirtyIds, setDirtyIds] = useState<Set<string>>(new Set());
  
  // Add Rule State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addingRule, setAddingRule] = useState(false);
  const [newRule, setNewRule] = useState({
    name: "",
    description: "",
    platform: ""
  });
  
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchRules = useCallback(async () => {
    try {
      setLoading(true);
      const response = await n8nApi.rulesManager({
        action: "read",
        table: "Platform_Rules",
        role: role?.toLowerCase() === "manager" ? "manager" : "user"
      });

      if (response && Array.isArray(response)) {
        const platformRules: PlatformRuleItem[] = response.map((record: { id: string; fields: Record<string, unknown> }) => {
          const fields = record.fields || record;
          return {
            id: (record.id || fields.id) as string,
            Platform: (fields.Platform || fields.Platform_Name || "Miscellaneous") as string,
            Rule_Name: (fields["Rule Name"] || fields.Rule_Name || fields.Name || "Unnamed Rule") as string,
            Description: (fields.Description || fields.Formatting_Rules || fields.Rules || "") as string,
            Char_Limit: (fields.Char_Limit || 0) as number,
            Active: (fields.Active === true || fields.Active === 1) as boolean
          };
        });
        
        setRules(platformRules);
        setDirtyIds(new Set());
      }
    } catch (err: unknown) {
      console.error("Failed to load platform constraints:", err);
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  const handleToggleActive = (id: string) => {
    setRules(prev => prev.map(rule => {
      if (rule.id === id) {
        setDirtyIds(prevDirty => {
          const newDirty = new Set(prevDirty);
          newDirty.add(id);
          return newDirty;
        });
        return { ...rule, Active: !rule.Active };
      }
      return rule;
    }));
  };

  const handleUpdateDescription = (id: string, newDesc: string) => {
    setRules(prev => prev.map(rule => {
      if (rule.id === id) {
        if (rule.Description !== newDesc) {
          setDirtyIds(prevDirty => {
            const newDirty = new Set(prevDirty);
            newDirty.add(id);
            return newDirty;
          });
        }
        return { ...rule, Description: newDesc };
      }
      return rule;
    }));
  };

  const handleSave = async () => {
    if (role?.toLowerCase() !== "manager") return;

    const modifiedRules = rules.filter(r => dirtyIds.has(r.id));
    if (modifiedRules.length === 0) return;

    try {
      setSaving(true);
      for (const rule of modifiedRules) {
        await n8nApi.rulesManager({
          action: "update",
          table: "Platform_Rules",
          id: rule.id,
          role: "manager",
          userEmail: user?.email || "",
          data: {
            Description: rule.Description,
            Active: rule.Active
          }
        });
      }
      setDirtyIds(new Set());
      fetchRules();
      setToast({ message: "Rules updated successfully!", type: "success" });
    } catch (err: unknown) {
      console.error("Failed to update rules:", err);
      setToast({ message: "Failed to update rules.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleAddRule = async (data?: { name: string; description: string; platform: string }) => {
    // If data is provided (from the modal), use it. Otherwise fallback to state (unlikely with current modal).
    const name = data?.name || newRule.name;
    const description = data?.description || newRule.description;
    const platform = data?.platform || newRule.platform;

    if (!name || !description || !platform) {
      setToast({ message: "Please fill in all fields.", type: "error" });
      return;
    }

    try {
      setAddingRule(true);
      await n8nApi.rulesManager({
        action: "create",
        table: "Platform_Rules",
        role: "manager",
        userEmail: user?.email || "",
        data: {
          "Rule Name": name,
          Description: description,
          Platform: platform, 
          Active: true
        }
      });

      setIsAddModalOpen(false);
      setNewRule({ name: "", description: "", platform: "" });
      fetchRules();
      setToast({ message: "Platform rule created successfully!", type: "success" });
    } catch (err) {
      console.error("Failed to add platform rule:", err);
      setToast({ message: "Failed to add platform rule.", type: "error" });
    } finally {
      setAddingRule(false);
    }
  };

  const handleDeleteRule = async (id: string) => {
    if (role?.toLowerCase() !== "manager") return;
    if (!confirm("Are you sure you want to delete this rule?")) return;

    try {
      await n8nApi.rulesManager({
        action: "delete",
        table: "Platform_Rules",
        id: id,
        role: "manager",
        userEmail: user?.email || ""
      });
      fetchRules();
      setToast({ message: "Rule deleted successfully!", type: "success" });
    } catch (err) {
      console.error("Failed to delete rule:", err);
      setToast({ message: "Failed to delete rule.", type: "error" });
    }
  };

  const openAddModal = () => {
    setNewRule(prev => ({ ...prev, platform: platformMeta[activePlatform].identifier }));
    setIsAddModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-brand-orange/60" />
      </div>
    );
  }

  const availablePlatforms = Object.keys(platformMeta) as Platform[];
  const currentMeta = platformMeta[activePlatform];
  const filteredRules = rules.filter(r => r.Platform === currentMeta.identifier);
  const totalDirty = dirtyIds.size;
  const combinedActiveDescription = filteredRules
    .filter(r => r.Active)
    .map(r => r.Description)
    .join("\n\n");

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 relative">
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      {/* 1. Scalable Platform Selector */}
      <div className="relative">
        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x"
        >
          {availablePlatforms.map((p) => {
            const meta = platformMeta[p];
            const Icon = meta.icon;
            const isActive = activePlatform === p;
            const hasRules = rules.some(r => r.Platform === meta.identifier);
            
            return (
              <button 
                key={p}
                onClick={() => setActivePlatform(p)}
                className={cn(
                  "group relative min-w-[160px] snap-start flex flex-col gap-4 rounded-3xl border p-6 transition-all duration-500",
                  isActive 
                    ? "border-brand-orange bg-white dark:bg-brand-dark shadow-xl" 
                    : "border-brand-light-grey/20 bg-white/40 opacity-70 hover:opacity-100 dark:bg-white/5"
                )}
              >
                <div className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-500",
                  isActive ? meta.bgColor : "bg-brand-light-grey/10"
                )}>
                  <Icon size={24} className={cn("transition-colors", isActive ? meta.color : "text-slate-400")} />
                </div>
                <div className="text-left">
                  <span className={cn(
                    "block font-heading text-[10px] font-black uppercase tracking-widest",
                    isActive ? "text-brand-orange" : "text-slate-400"
                  )}>
                    {meta.label}
                  </span>
                  <span className="text-[9px] font-body text-slate-500 font-medium">
                    {hasRules ? `${rules.filter(r => r.Platform === meta.identifier).length} Rules` : "No Rules yet"}
                  </span>
                </div>
                {isActive && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-1 w-8 rounded-full bg-brand-orange" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* 2. Rules Editor Section */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between px-2">
            <div>
              <h3 className="font-heading text-xl font-black uppercase tracking-tighter text-brand-dark dark:text-brand-light">
                {currentMeta.label} Constraints
              </h3>
              <p className="font-body text-[11px] font-medium text-brand-grey uppercase tracking-wider">
                Control how the AI formats content for this platform
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={fetchRules}
                className="group flex items-center gap-2 px-6 py-4 font-heading text-xs font-bold uppercase tracking-wider text-slate-500 transition-colors hover:text-brand-dark dark:hover:text-brand-light"
              >
                 <RotateCcw size={16} className="transition-transform group-hover:-rotate-180 duration-500" />
                 Refresh
              </button>
              
              <button 
                onClick={handleSave}
                disabled={saving || dirtyIds.size === 0}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-8 py-4 font-heading text-xs font-bold uppercase tracking-wider text-white shadow-2xl transition-all active:scale-95 disabled:opacity-30 disabled:grayscale",
                  "bg-brand-dark shadow-brand-dark/20 dark:bg-brand-orange dark:shadow-brand-orange/30",
                  "hover:-translate-y-0.5"
                )}
              >
                 {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                 {saving ? "Save" : `Save ${dirtyIds.size > 0 ? `(${dirtyIds.size})` : ""}`}
              </button>

              <button 
                onClick={openAddModal}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-light-grey/10 text-brand-grey transition-all hover:bg-brand-dark hover:text-white dark:hover:bg-brand-orange shadow-xl shadow-brand-dark/5"
              >
                <Plus size={24} />
              </button>
            </div>
          </div>

          {!filteredRules.length ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-[2.5rem] border border-dashed border-brand-light-grey/40 py-20">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-light-grey/10 text-brand-light-grey">
                <AlertCircle size={32} />
              </div>
              <p className="font-heading text-sm font-bold text-slate-400 uppercase tracking-widest">No custom rules for {currentMeta.label}</p>
            </div>
          ) : (
            <div className="grid gap-5">
              {filteredRules.map((rule) => (
                <div 
                  key={rule.id}
                  className={cn(
                    "group relative flex flex-col gap-5 rounded-[2.5rem] border p-8 transition-all duration-500 overflow-hidden",
                    rule.Active 
                      ? "border-brand-light-grey dark:border-brand-dark/30 bg-white dark:bg-white/5 shadow-premium" 
                      : "border-brand-light-grey/20 bg-brand-light-grey/5 opacity-60"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-500",
                        rule.Active ? "bg-brand-orange shadow-lg shadow-brand-orange/20" : "bg-slate-100 text-slate-400 dark:bg-white/5"
                      )}>
                        <Sparkles size={16} className={rule.Active ? "text-white" : "text-slate-400"} />
                      </div>
                      <div>
                        <h4 className="font-heading text-xs font-black uppercase tracking-tighter text-brand-dark dark:text-brand-light">
                          {rule.Rule_Name}
                        </h4>
                        <div className="flex items-center gap-2">
                           <span className={cn("text-[9px] font-bold uppercase", rule.Active ? "text-emerald-500" : "text-slate-400")}>
                             {rule.Active ? "Active" : "Disabled"}
                           </span>
                           {dirtyIds.has(rule.id) && (
                             <>
                               <span className="text-[9px] text-slate-300">•</span>
                               <span className="text-[9px] font-black uppercase tracking-wider text-brand-orange animate-pulse">Unsaved</span>
                             </>
                           )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleDeleteRule(rule.id)}
                        className="group/del rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all dark:hover:bg-rose-500/10"
                        title="Delete rule"
                      >
                        <Trash2 size={16} className="transition-transform group-hover/del:scale-110" />
                      </button>
                      <button 
                        onClick={() => handleToggleActive(rule.id)}
                        className={cn(
                          "relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-500 ease-in-out",
                          rule.Active ? "bg-brand-orange" : "bg-slate-200 dark:bg-white/10"
                        )}
                      >
                        <span
                          className={cn(
                            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xl transition-all duration-500 ease-in-out",
                            rule.Active ? "translate-x-6" : "translate-x-0"
                          )}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <textarea 
                      value={rule.Description}
                      onChange={(e) => handleUpdateDescription(rule.id, e.target.value)}
                      className="min-h-[100px] w-full rounded-2xl border-none bg-brand-light-grey/5 p-5 font-body text-xs font-medium leading-relaxed text-brand-dark dark:text-brand-light/80 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-orange/20 transition-all"
                      placeholder="Describe the formatting rule for the AI..."
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. Enhanced Feed Preview Section */}
        <div className="lg:col-span-5 sticky top-8 space-y-6">
          <div className="flex items-center justify-between px-2">
            <div>
              <h3 className="font-heading text-sm font-black uppercase tracking-widest text-brand-dark dark:text-brand-light">Feed Simulator</h3>
              <p className="font-body text-[10px] font-bold text-brand-grey uppercase">Native Rendering Preview</p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-brand-orange/10 px-3 py-1 text-[9px] font-bold text-brand-orange">
               <div className="h-1.5 w-1.5 rounded-full bg-brand-orange animate-pulse" />
               AI POWERED
            </div>
          </div>

          <div className="relative group overflow-hidden rounded-[3rem] border border-brand-light-grey bg-brand-light-grey shadow-premium dark:border-brand-dark/20 p-8 pt-10">
            {/* Platform Mockup Container */}
            <div 
              className={cn(
                "relative h-full w-full overflow-hidden rounded-[2rem] bg-white shadow-2xl transition-all duration-700 dark:bg-brand-dark",
                activePlatform === 'linkedin' && "bg-[#F3F2EF] dark:bg-brand-dark",
                activePlatform === 'twitter' && "bg-white dark:bg-black",
                activePlatform === 'email' && "bg-[#F5F5F5] dark:bg-brand-dark"
              )}
            >
              {/* LinkedIn Style */}
              {activePlatform === 'linkedin' && (
                <div className="p-4 space-y-4 font-sans text-[#1d1d1d] dark:text-white">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-300 animate-pulse" />
                    <div>
                      <div className="h-3 w-24 rounded bg-slate-300 mb-1" />
                      <div className="h-2 w-16 rounded bg-slate-200" />
                    </div>
                  </div>
                  <div className="space-y-3 text-sm leading-normal">
                    <p className="font-semibold">Why is scaling creativity so hard? 🤔</p>
                    <p className="text-[13px] text-slate-600 dark:text-slate-400">
                       {combinedActiveDescription || "Defining platform rules makes AI output consistent..."}
                    </p>
                  </div>
                  <div className="aspect-square rounded-lg bg-slate-200" />
                  <div className="flex items-center gap-6 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-xs"><Heart size={14} /> 12</div>
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-xs"><MessageSquare size={14} /> 4</div>
                  </div>
                </div>
              )}

              {/* Twitter/X Style */}
              {activePlatform === 'twitter' && (
                <div className="p-6 space-y-4 font-sans text-black dark:text-white">
                  <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-200" />
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-20 rounded bg-slate-200" />
                        <div className="h-3 w-24 rounded bg-slate-100" />
                      </div>
                      <p className="text-sm leading-relaxed">
                        {combinedActiveDescription 
                          ? combinedActiveDescription.substring(0, 280) + (combinedActiveDescription.length > 280 ? "..." : "")
                          : "Configure rules to ensure your X (Twitter) posts remain within character limits and maintain proper brand tone."}
                      </p>
                      <div className="aspect-video rounded-2xl bg-slate-100" />
                      <div className="flex items-center gap-12 text-slate-400">
                         <MessageSquare size={14} />
                         <RefreshCw size={14} />
                         <Heart size={14} />
                         <Share2 size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Email Style */}
              {activePlatform === 'email' && (
                <div className="p-6 bg-white dark:bg-brand-dark/20 h-full">
                  <div className="space-y-4 border rounded-xl p-4 bg-white dark:bg-brand-dark">
                    <div className="space-y-2 border-b pb-4">
                      <p className="text-[10px] text-slate-400">From: Fetemi Content</p>
                      <p className="text-[10px] text-slate-400">To: Marketing Team</p>
                      <p className="font-heading text-sm font-bold text-brand-dark dark:text-brand-light">Subject: Final Content Review</p>
                    </div>
                    <div className="space-y-4 font-serif text-[12px] text-slate-600 dark:text-slate-300 leading-relaxed">
                       <p>Hi Team,</p>
                       <p>{combinedActiveDescription || "Your email rules will define tone, structure, and length to ensure high conversion rates."}</p>
                       <p>Regards,<br/>AI Assistant</p>
                    </div>
                    <div className="h-40 w-full rounded bg-brand-light-grey/10" />
                  </div>
                </div>
              )}

              {/* Generic Style for others */}
              {!['linkedin', 'twitter', 'email'].includes(activePlatform) && (
                <div className="flex flex-col items-center justify-center h-full p-10 text-center gap-6">
                   <div className={cn("p-8 rounded-[2rem]", currentMeta.bgColor)}>
                      <currentMeta.icon size={48} className={currentMeta.color} />
                   </div>
                   <div className="space-y-2">
                      <h4 className="font-heading text-lg font-black uppercase tracking-widest text-brand-dark dark:text-brand-light">
                        {currentMeta.label} Preview
                      </h4>
                      <p className="text-xs font-body text-slate-500 leading-relaxed">
                        Redesigning preview module for {currentMeta.label}. 
                        AI instructions are currently being optimized for this platform.
                      </p>
                   </div>
                   <div className="w-full h-2 rounded-full bg-brand-light-grey/20 relative overflow-hidden">
                      <div className="absolute inset-0 bg-brand-orange w-1/2 animate-progress" />
                   </div>
                </div>
              )}
            </div>

            {/* Interaction Hint */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
               <div className="flex items-center gap-3 rounded-2xl bg-brand-dark/90 px-8 py-4 text-white shadow-2xl backdrop-blur-md dark:bg-brand-orange/90 whitespace-nowrap">
                  <MousePointer2 size={16} className="animate-pulse" />
                  <span className="font-heading text-[10px] font-black uppercase tracking-widest">Active rules affect AI output</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>

      <AddPlatformRuleModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddRule}
        adding={addingRule}
        initialPlatform={platformMeta[activePlatform].identifier}
        platforms={platformMeta}
      />
    </div>
  );
}

// Reuse X icon from another component or import if available
function XIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  );
}

// Add Rule Modal
function AddPlatformRuleModal({ 
  isOpen, 
  onClose, 
  onAdd, 
  adding,
  initialPlatform,
  platforms
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onAdd: (rule: { name: string; description: string; platform: string }) => void;
  adding: boolean;
  initialPlatform: string;
  platforms: typeof platformMeta;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [platform, setPlatform] = useState(initialPlatform);

  useEffect(() => {
    if (isOpen) {
      setPlatform(initialPlatform);
    }
  }, [isOpen, initialPlatform]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-dark/80 backdrop-blur-sm p-6">
       <div className="w-full max-w-xl rounded-[3rem] bg-white p-12 shadow-2xl dark:bg-brand-dark dark:border dark:border-brand-dark/20 relative">
          <button 
             onClick={onClose}
             className="absolute right-10 top-10 text-brand-grey hover:text-brand-dark transition-colors"
          >
             <XIcon size={24} />
          </button>
          
          <div className="mb-10 space-y-2">
             <h3 className="text-3xl font-black uppercase tracking-tighter font-heading text-brand-dark dark:text-brand-light">Add Platform Rule</h3>
             <p className="text-sm font-medium text-slate-700 dark:text-slate-300 font-body">Define a formatting constraint for a specific platform.</p>
          </div>

          <div className="space-y-6">
             <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 font-heading">Rule Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Hashtag Usage" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl bg-brand-light px-6 py-4 text-sm font-bold text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-orange dark:bg-white/10 dark:text-white border border-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                />
             </div>
             
             <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 font-heading">Platform</label>
                <select 
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full rounded-2xl bg-brand-light px-6 py-4 text-sm font-bold text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-orange dark:bg-white/10 dark:text-white border border-transparent appearance-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                >
                  {Object.entries(platforms).map(([key, meta]) => (
                    <option key={key} value={meta.identifier}>{meta.label}</option>
                  ))}
                </select>
             </div>

             <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 font-heading">Constraint Instruction</label>
                <textarea 
                  placeholder="e.g. Always include 3-5 relevant hashtags at the end..." 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-32 rounded-2xl bg-brand-light px-6 py-4 text-sm font-bold text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-orange dark:bg-white/10 dark:text-white border border-transparent resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                />
             </div>
          </div>

          <div className="mt-12">
             <button 
               onClick={() => onAdd({ name, description, platform })}
               disabled={adding}
               className="w-full rounded-[2rem] bg-brand-dark py-5 text-sm flex justify-center items-center font-black uppercase tracking-widest text-white shadow-2xl transition-all active:scale-95 disabled:opacity-50 dark:bg-brand-orange"
             >
                {adding ? <Loader2 className="animate-spin text-white" size={18} /> : "Create Constraint"}
             </button>
          </div>
       </div>
    </div>
  );
}
