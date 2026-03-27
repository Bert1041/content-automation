"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Save, 
  RotateCcw, 
  Plus, 
  Trash2, 
  ChevronRight,
  Info,
  Layers,
  Link as LinkIcon,
  Sparkles,
  Layout,
  Loader2,
  AlertCircle,
  X as XIcon
} from "lucide-react";
import { n8nApi } from "@/lib/api/n8n";
import { useAuth } from "@/components/common/AuthContext";
import { cn } from "@/lib/utils";
import Toast, { ToastType } from "@/components/common/Toast";

interface Rule {
  id: string;
  Rule_Name: string;
  Description: string;
  Category: string;
  Active: boolean;
}

interface GroupedRules {
  category: string;
  icon: React.ElementType;
  rules: Rule[];
}

const categoryIcons: Record<string, React.ElementType> = {
  "Structure": Layers,
  "Keyword": LinkIcon,
  "Enrichment": Sparkles,
  "General": Layout,
};

export default function SEORulesContent() {
  const { user, role } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sections, setSections] = useState<GroupedRules[]>([]);
  const [dirtyIds, setDirtyIds] = useState<Set<string>>(new Set());
  
  // Add Rule State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRule, setNewRule] = useState({
    name: "",
    description: "",
    category: ""
  });
  const [addingRule, setAddingRule] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const fetchRules = useCallback(async () => {
    try {
      console.debug(`[Rules] Fetching SEO rules for role: ${role}`);
      setLoading(true);
      setError(null);
      const response = await n8nApi.rulesManager({
        action: "read",
        table: "SEO_Rules",
        role: role?.toLowerCase() === "manager" ? "manager" : "user"
      });

      if (response && Array.isArray(response)) {
        const grouped = response.reduce((acc: Record<string, Rule[]>, rule: { id: string; fields: Record<string, unknown> }) => {
          const fields = rule.fields || rule;
          const cat = (fields.Category || "Miscellaneous") as string;
          
          if (!acc[cat]) acc[cat] = [];
          
          acc[cat].push({
            id: (rule.id || fields.id) as string,
            Rule_Name: (fields["Rule Name"] || fields.Rule_Name || fields.Name || "Unnamed Rule") as string,
            Description: (fields.Description || "") as string,
            Category: (fields.Category || "Miscellaneous") as string,
            Active: (fields.Active === true || fields.Active === 1) as boolean
          });
          return acc;
        }, {});

        const formattedSections = Object.entries(grouped).map(([category, rules]) => ({
          category,
          icon: categoryIcons[category] || Layers,
          rules: rules as Rule[]
        }));

        setSections(formattedSections);
        setDirtyIds(new Set()); // Reset dirty state on fetch
      }
    } catch (err: unknown) {
      console.error("Error fetching rules:", err);
      setError("Failed to load SEO rules. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  const handleToggleActive = (id: string) => {
    setSections(prev => prev.map(section => ({
      ...section,
      rules: section.rules.map(rule => {
        if (rule.id === id) {
          const updated = { ...rule, Active: !rule.Active };
          setDirtyIds(prevDirty => new Set(prevDirty).add(id));
          return updated;
        }
        return rule;
      })
    })));
  };

  const handleUpdateDescription = (id: string, newDesc: string) => {
    setSections(prev => prev.map(section => ({
      ...section,
      rules: section.rules.map(rule => {
        if (rule.id === id) {
          if (rule.Description !== newDesc) {
            setDirtyIds(prevDirty => new Set(prevDirty).add(id));
          }
          return { ...rule, Description: newDesc };
        }
        return rule;
      })
    })));
  };

  const handleSaveAll = async () => {
    if (role?.toLowerCase() !== "manager") {
      alert("Only managers can update SEO rules.");
      return;
    }

    if (dirtyIds.size === 0) {
      alert("No changes to save.");
      return;
    }

    try {
      setSaving(true);
      const allRules = sections.flatMap(s => s.rules);
      const modifiedRules = allRules.filter(r => dirtyIds.has(r.id));

      console.debug(`[Rules] Saving ${modifiedRules.length} modified rules...`);

      // Update each modified rule in sequence (or parallel if n8n handles it)
      for (const rule of modifiedRules) {
        await n8nApi.rulesManager({
          action: "update",
          table: "SEO_Rules",
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
      setToast({ message: `Successfully updated ${modifiedRules.length} rules!`, type: "success" });
      fetchRules(); // Refresh to confirm state
    } catch (err) {
      console.error("Failed to save rules:", err);
      setToast({ message: "Failed to save some rules. Please check the logs.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRule = async (id: string) => {
    if (!confirm("Are you sure you want to delete this rule?")) return;
    
    try {
      await n8nApi.rulesManager({
        action: "delete",
        table: "SEO_Rules",
        id,
        role: "manager",
        userEmail: user?.email || ""
      });
      fetchRules();
      setToast({ message: "Rule deleted successfully!", type: "success" });
    } catch (err: unknown) {
      console.error("Failed to delete rule:", err);
      setToast({ message: "Failed to delete rule.", type: "error" });
    }
  };

  const handleAddRule = async () => {
    if (!newRule.name || !newRule.description || !newRule.category) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      setAddingRule(true);
      await n8nApi.rulesManager({
        action: "create",
        table: "SEO_Rules",
        role: "manager",
        userEmail: user?.email || "",
        data: {
          "Rule Name": newRule.name,
          Description: newRule.description,
          Category: newRule.category,
          Active: true
        }
      });

      setIsAddModalOpen(false);
      setNewRule({ name: "", description: "", category: "" });
      fetchRules();
      setToast({ message: "Rule created successfully!", type: "success" });
    } catch (err) {
      console.error("Failed to add rule:", err);
      setToast({ message: "Failed to add rule.", type: "error" });
    } finally {
      setAddingRule(false);
    }
  };

  const openAddModal = (category: string = "") => {
    setNewRule(prev => ({ ...prev, category }));
    setIsAddModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-brand-orange/60" />
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      {/* 1. Caution Banner */}
      <div className="group flex items-center gap-6 rounded-[2rem] border border-brand-orange/20 bg-brand-orange/5 p-8 text-brand-orange shadow-lg shadow-brand-orange/5 transition-all hover:bg-brand-orange/10">
         <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-orange/10">
            <Info size={24} />
         </div>
         <div className="space-y-1">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider">System Logic Warning</h4>
            <p className="font-body text-sm font-medium opacity-80">
              Changes will affect all future AI generated drafts. Existing drafts will not be modified.
            </p>
         </div>
      </div>

      {error && (
        <div className="flex items-center gap-4 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-600 dark:border-red-900/30 dark:bg-red-900/10">
          <AlertCircle size={20} />
          <p className="text-sm font-semibold">{error}</p>
          <button onClick={fetchRules} className="ml-auto text-xs font-bold uppercase tracking-wider underline">Try Again</button>
        </div>
      )}

      {/* 2. Rule Sections */}
      <div className="grid gap-8 lg:grid-cols-2">
         {sections.map((section, sIdx) => (
           <div 
             key={section.category} 
             className="group/card relative overflow-hidden rounded-[2.5rem] border border-brand-light-grey bg-white p-10 shadow-xl shadow-brand-dark/5 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-dark/10 dark:border-brand-dark/20 dark:bg-white/5"
             style={{ animationDelay: `${sIdx * 100}ms` }}
           >
              {/* Glassmorphism background glow */}
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-orange/5 blur-3xl transition-opacity group-hover/card:opacity-100 opacity-0" />
              
              <div className="relative mb-8 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-light text-brand-dark shadow-inner dark:bg-white/10 dark:text-brand-light">
                       <section.icon size={22} />
                    </div>
                    <h3 className="font-heading text-xl font-bold uppercase tracking-tight text-brand-dark dark:text-brand-light">{section.category}</h3>
                 </div>
                 <button 
                    onClick={() => openAddModal(section.category)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light/50 text-brand-grey transition-all hover:bg-brand-dark hover:text-white dark:bg-white/5 dark:hover:bg-brand-orange"
                 >
                    <Plus size={20} />
                 </button>
              </div>

              <div className="relative space-y-6">
                 {section.rules.map((rule) => {
                   const isDirty = dirtyIds.has(rule.id);
                   return (
                     <div key={rule.id} className={cn(
                       "group flex items-center justify-between border-b border-brand-light-grey pb-6 last:border-0 dark:border-brand-dark/20 transition-all",
                       isDirty && "border-l-2 border-l-brand-orange pl-4 -ml-4"
                     )}>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <p className="font-heading text-[10px] font-bold uppercase tracking-widest text-slate-500">{rule.Rule_Name}</p>
                            {isDirty && (
                              <span className="flex items-center gap-1 text-[9px] font-bold text-brand-orange uppercase animate-pulse">
                                <RotateCcw size={10} /> Unsaved
                              </span>
                            )}
                          </div>
                          <input 
                             type="text" 
                             value={rule.Description}
                             onChange={(e) => handleUpdateDescription(rule.id, e.target.value)}
                             className="w-full bg-transparent font-body text-sm font-medium text-brand-dark/80 transition-colors focus:text-brand-orange focus:outline-none dark:text-brand-light/80"
                          />
                        </div>
                        <div className="ml-4 flex items-center gap-6">
                           {/* Active Toggle Switch */}
                           <div className="flex items-center gap-3">
                             <span className={cn(
                               "hidden sm:block text-[9px] font-bold uppercase tracking-wider transition-colors",
                               rule.Active ? "text-emerald-500" : "text-slate-400"
                             )}>
                               {rule.Active ? "Active" : "Inactive"}
                             </span>
                             <button 
                               onClick={() => handleToggleActive(rule.id)}
                               className={cn(
                                 "relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2",
                                 rule.Active ? "bg-brand-orange" : "bg-slate-200 dark:bg-white/10"
                               )}
                               aria-label={`Toggle ${rule.Rule_Name} ${rule.Active ? 'inactive' : 'active'}`}
                             >
                               <span
                                 className={cn(
                                   "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                   rule.Active ? "translate-x-5" : "translate-x-0"
                                 )}
                               />
                             </button>
                           </div>

                           <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                              <button 
                               onClick={() => handleDeleteRule(rule.id)}
                               className="flex h-8 w-8 items-center justify-center rounded-lg text-brand-grey transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                              >
                                 <Trash2 size={16} />
                              </button>
                              <ChevronRight size={16} className="text-brand-light-grey" />
                           </div>
                        </div>
                     </div>
                   );
                 })}
              </div>
           </div>
         ))}

         {/* Add New Section Placeholder */}
          <button 
            onClick={() => openAddModal()}
            className="flex flex-col items-center justify-center gap-6 rounded-[2.5rem] border-2 border-dashed border-brand-light-grey p-10 text-slate-600 transition-all hover:border-brand-orange hover:bg-brand-orange/5 hover:text-brand-orange dark:border-brand-dark/20 dark:text-slate-500 dark:hover:border-brand-orange dark:hover:bg-brand-orange/5"
          >
             <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-light/50 dark:bg-white/5">
                <Plus size={32} strokeWidth={1.5} />
             </div>
             <div className="text-center">
                <span className="block font-heading text-xs font-bold uppercase tracking-widest">Add New Rule</span>
                <span className="mt-1 block font-body text-[10px] font-medium opacity-60 italic">Define custom parameters for AI generation</span>
             </div>
          </button>
      </div>

      {/* 3. Action Footer */}
      <div className="flex items-center justify-between border-t border-brand-light-grey pt-10 dark:border-brand-dark/20">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
             Airtable Synced: Rule Manager Live
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={fetchRules}
              className="group flex items-center gap-2 px-8 py-4 font-heading text-xs font-bold uppercase tracking-wider text-slate-500 transition-colors hover:text-brand-dark dark:hover:text-brand-light"
            >
                <RotateCcw size={16} className="transition-transform group-hover:-rotate-180 duration-500" />
                Refresh Rules
            </button>
            <button 
              onClick={handleSaveAll}
              disabled={saving || dirtyIds.size === 0}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-12 py-5 font-heading text-xs font-bold uppercase tracking-wider text-white shadow-2xl transition-all active:scale-95 disabled:opacity-30 disabled:grayscale",
                "bg-brand-dark shadow-brand-dark/20 dark:bg-brand-orange dark:shadow-brand-orange/30",
                "hover:-translate-y-0.5"
              )}
            >
               {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
               {saving ? "Saving Changes..." : `Save Rules ${dirtyIds.size > 0 ? `(${dirtyIds.size})` : ""}`}
            </button>
          </div>
      </div>

      {/* Add Rule Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-dark/80 backdrop-blur-sm p-6">
           <div className="w-full max-w-xl rounded-[3rem] bg-white p-12 shadow-2xl dark:bg-brand-dark dark:border dark:border-brand-dark/20 relative">
              <button 
                 onClick={() => setIsAddModalOpen(false)}
                 className="absolute right-10 top-10 text-brand-grey hover:text-brand-dark transition-colors"
              >
                 <XIcon size={24} />
              </button>
              
              <div className="mb-10 space-y-2">
                 <h3 className="text-3xl font-black uppercase tracking-tighter font-heading text-brand-dark dark:text-brand-light">Add New SEO Rule</h3>
                 <p className="text-sm font-medium text-slate-700 dark:text-slate-300 font-body">Define a new directive for AI content generation.</p>
              </div>

              <div className="space-y-6">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 font-heading">Rule Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Header Structure" 
                      value={newRule.name}
                      onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full rounded-2xl bg-brand-light px-6 py-4 text-sm font-bold text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-orange dark:bg-white/10 dark:text-white border border-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                    />
                 </div>
                 
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 font-heading">Category</label>
                    <select 
                      value={newRule.category}
                      onChange={(e) => setNewRule(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full rounded-2xl bg-brand-light px-6 py-4 text-sm font-bold text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-orange dark:bg-white/10 dark:text-white border border-transparent appearance-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    >
                      <option value="" disabled>Select a category</option>
                      <option value="Structure">Structure</option>
                      <option value="Keyword">Keyword</option>
                      <option value="Enrichment">Enrichment</option>
                      <option value="General">General</option>
                    </select>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 font-heading">Instruction</label>
                    <textarea 
                      placeholder="e.g. Always use H2 tags for main sections..." 
                      value={newRule.description}
                      onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full h-32 rounded-2xl bg-brand-light px-6 py-4 text-sm font-bold text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-orange dark:bg-white/10 dark:text-white border border-transparent resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                    />
                 </div>
              </div>

              <div className="mt-12">
                 <button 
                   onClick={handleAddRule}
                   disabled={addingRule}
                   className="w-full rounded-[2rem] bg-brand-dark py-5 text-sm flex justify-center items-center font-black uppercase tracking-widest text-white shadow-2xl transition-all active:scale-95 disabled:opacity-50 dark:bg-brand-orange"
                 >
                    {addingRule ? <Loader2 className="animate-spin text-white" size={18} /> : "Create Rule"}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
