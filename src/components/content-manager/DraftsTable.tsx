"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Linkedin,
  Twitter,
  Mail,
  Eye,
  Edit2,
  Trash2,
  Send,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Loader2,
  X,
  Check,
  AlertCircle
} from "lucide-react";
import { cn, parseDraftContent } from "@/lib/utils";
import { Draft, Platform, DraftStatus } from "@/types/content";
import { useAuth } from "@/components/common/AuthContext";
import { n8nApi } from "@/lib/api/n8n";


const platformIcons: Partial<Record<Platform, React.ReactNode>> = {
  linkedin: <Linkedin size={14} />,
  twitter: <Twitter size={14} />,
  email: <Mail size={14} />,
};

const getStatusStyle = (status: string): string => {
  const s = status.toLowerCase();
  if (s === "approved") return "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 ring-1 ring-emerald-500/20";
  if (s === "pending review") return "bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-orange-400 ring-1 ring-amber-500/20";
  if (s === "rejected") return "bg-rose-500/10 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 ring-1 ring-rose-500/20";
  if (s === "revision required") return "bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 ring-1 ring-blue-500/20";
  if (s === "scheduled") return "bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 ring-1 ring-amber-500/20";
  if (s === "published") return "bg-slate-500/10 text-slate-800 dark:bg-slate-500/20 dark:text-brand-light ring-1 ring-slate-500/20";
  return "bg-slate-500/10 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400 ring-1 ring-slate-500/20";
};

export default function DraftsTable() {
  const router = useRouter();
  const { user } = useAuth();
  const [drafts, setDrafts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [platformFilter, setPlatformFilter] = useState("All Platforms");
  
  // Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any[] | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    async function getDrafts() {
      if (!user?.email) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const data = await n8nApi.fetchDrafts(user.email);
        const draftsArray = Array.isArray(data) ? data : (data as any)?.records || [];
        setDrafts(draftsArray);
      } catch (error) {
        console.error("Failed to fetch drafts:", error);
      } finally {
        setIsLoading(false);
      }
    }
    getDrafts();
  }, [user?.email]);

  const groupedDrafts = useMemo(() => {
    const groups: Record<string, any[]> = {};
    drafts.forEach(draft => {
      const requestId = draft.fields?.RequestId || draft.id || "unknown";
      if (!groups[requestId]) groups[requestId] = [];
      groups[requestId].push(draft);
    });
    // Sort groups by the most recent generation in each group
    return Object.values(groups).sort((a, b) => {
      const dateA = new Date(a[0].fields?.GeneratedAt || 0).getTime();
      const dateB = new Date(b[0].fields?.GeneratedAt || 0).getTime();
      return dateB - dateA;
    });
  }, [drafts]);

  const filteredGroups = groupedDrafts.filter(group => {
    const mainDraft = group[0];
    const fields = mainDraft.fields || {};
    const matchesSearch = (fields.Topic || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    // For status/platform filters, we check if ANY draft in the group matches
    const matchesStatus = statusFilter === "All Statuses" || group.some(d => (d.fields?.Status || "").toLowerCase() === statusFilter.toLowerCase());
    
    const matchesPlatform = platformFilter === "All Platforms" || group.some(d => {
      let pKey = "";
      if (d.fields?.Platform === "X (Twitter)") pKey = "Twitter";
      else if (d.fields?.Platform === "LinkedIn") pKey = "LinkedIn";
      else if (d.fields?.Platform === "Email Newsletter") pKey = "Email";
      return pKey === platformFilter;
    });
    
    return matchesSearch && matchesStatus && matchesPlatform;
  });

  // Real Pagination Logic
  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
  const paginatedGroups = filteredGroups.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, platformFilter]);

  const handleUpdateDraft = async (draftId: string, content: string) => {
    if (!user?.email) return;
    setIsUpdating(true);
    try {
      await n8nApi.updateDraft({
        id: draftId,
        fields: { Content: content },
        userEmail: user.email
      });
      // Refresh local state or re-fetch
      const data = await n8nApi.fetchReviewQueue(user.email);
      setDrafts(data || []);
      // If we are in edit modal, we might need to update the selectedGroup too
      if (selectedGroup) {
         setSelectedGroup(prev => prev ? prev.map(d => d.id === draftId ? { ...d, fields: { ...d.fields, Content: content } } : d) : null);
      }
    } catch (error) {
      console.error("Failed to update draft:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteGroup = async (requestId: string) => {
    if (!user?.email) return;
    setIsUpdating(true);
    try {
      await n8nApi.deleteDraft({
        requestId: requestId,
        userEmail: user.email
      });
      const data = await n8nApi.fetchReviewQueue(user.email);
      setDrafts(data || []);
      setIsDeleteModalOpen(false);
      setSelectedGroup(null);
    } catch (error) {
      console.error("Failed to delete group:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center glass-card p-10">
        <Loader2 className="h-10 w-10 animate-spin text-brand-accent" />
        <p className="mt-4 text-sm font-medium text-brand-grey">Loading your drafts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 transition-colors group-focus-within:text-brand-orange" size={18} />
          <input 
            type="text"
            placeholder="Search drafts by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search drafts"
            className="w-full rounded-2xl border border-brand-light-grey bg-white py-3 pl-12 pr-4 text-sm text-brand-dark transition-all focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 dark:border-brand-dark/20 dark:bg-white/5 dark:text-brand-light shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <div className="relative">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
              className="appearance-none rounded-xl border border-brand-light-grey bg-white py-2 pl-4 pr-10 text-[11px] font-semibold uppercase tracking-widest text-brand-dark transition-all hover:bg-brand-light-grey focus:border-brand-accent dark:border-brand-dark/20 dark:bg-white/5 dark:text-brand-light dark:hover:bg-white/10 focus-ring"
            >
              <option>All Statuses</option>
              <option>Draft</option>
              <option>Pending Review</option>
              <option>Revision Required</option>
              <option>Rejected</option>
              <option>Approved</option>
            </select>
            <Filter size={14} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          </div>

          {/* Platform Filter */}
          <div className="relative">
            <select 
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              aria-label="Filter by platform"
              className="appearance-none rounded-xl border border-brand-light-grey bg-white py-2 pl-4 pr-10 text-[11px] font-semibold uppercase tracking-widest text-brand-dark transition-all hover:bg-brand-light-grey focus:border-brand-accent dark:border-brand-dark/20 dark:bg-white/5 dark:text-brand-light dark:hover:bg-white/10 focus-ring"
            >
              <option>All Platforms</option>
              <option>LinkedIn</option>
              <option>Twitter</option>
              <option>Email</option>
            </select>
            <Filter size={14} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden glass-card lg:block overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-brand-light-grey dark:border-brand-dark/20 bg-black/[0.01] dark:bg-white/[0.01]">
              <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Title</th>
              <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Category</th>
              <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Created</th>
              <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Status</th>
              <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-light-grey dark:divide-brand-dark/20">
            {paginatedGroups.map((group) => {
              const mainDraft = group[0];
              const { fields } = mainDraft;
              const date = fields.GeneratedAt ? new Date(fields.GeneratedAt).toLocaleDateString() : "N/A";
              
              // Get unique platforms in this group
              const platforms = Array.from(new Set(group.map(d => {
                const p = d.fields?.Platform;
                if (p === "X (Twitter)") return "twitter";
                if (p === "LinkedIn") return "linkedin";
                if (p === "Email Newsletter") return "email";
                return "twitter";
              }))) as Platform[];

              // Overall status: if any are pending, show pending, else most frequent
              const status = group.some(d => d.fields?.Status?.toLowerCase() === "pending review") 
                ? "Pending Review" 
                : fields.Status || "Draft";

              return (
                <tr key={mainDraft.fields?.RequestId || mainDraft.id} className="group hover:bg-brand-light-grey/30 dark:hover:bg-white/5 transition-colors">
                  <td className="px-8 py-5 max-w-sm">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-brand-dark dark:text-brand-light truncate">{fields.Topic}</span>
                      <span className="text-[10px] text-slate-400 font-mono mt-1 opacity-60">ID: {fields.RequestId}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex gap-2">
                       {platforms.map(pKey => (
                         <div key={pKey} className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-light-grey/50 text-slate-500 dark:bg-white/10 dark:text-slate-400" title={pKey}>
                           {platformIcons[pKey]}
                         </div>
                       ))}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-600 dark:text-slate-400 font-body">
                    {date}
                  </td>
                  <td className="px-8 py-5">
                    <span className={cn(
                      "inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] shadow-sm",
                      getStatusStyle(status)
                    )}>
                      {status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-end gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button 
                        onClick={() => { setSelectedGroup(group); setIsViewModalOpen(true); }}
                        className="rounded-lg p-2 transition-colors hover:bg-brand-accent/10 hover:text-brand-accent text-slate-400 dark:text-slate-500 focus-ring" title="View Generation Results">
                        <Eye size={16} />
                      </button>
                      <button 
                         onClick={() => { 
                           const requestId = group[0].fields?.RequestId;
                           if (requestId) router.push(`/edit?requestId=${requestId}`);
                         }}
                        className="rounded-lg p-2 transition-colors hover:bg-brand-orange/10 hover:text-brand-orange text-slate-400 dark:text-slate-500 focus-ring" title="Edit Drafts">
                        <Edit2 size={16} />
                      </button>
                      {status.toLowerCase() === "draft" && (
                        <button 
                          onClick={async () => {
                            if (!user?.email) return;
                            setIsUpdating(true);
                            try {
                              // We submit the first draft in the group for review by default
                              await n8nApi.updateDraft({
                                id: mainDraft.id,
                                fields: { Status: "Pending Review" },
                                userEmail: user.email
                              });
                              const data = await n8nApi.fetchReviewQueue(user.email);
                              setDrafts(data || []);
                            } catch (error) {
                              console.error("Failed to submit for review:", error);
                            } finally {
                              setIsUpdating(false);
                            }
                          }}
                          className="rounded-lg p-2 transition-colors hover:bg-emerald-500/10 hover:text-emerald-500 text-slate-400 dark:text-slate-500 focus-ring" title="Quick Submit for Review">
                          <Send size={16} />
                        </button>
                      )}
                      <button 
                        onClick={() => { setSelectedGroup(group); setIsDeleteModalOpen(true); }}
                        className="rounded-lg p-2 transition-colors hover:bg-red-500/10 hover:text-red-500 text-slate-400 dark:text-slate-500 focus-ring" title="Delete Group">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 lg:hidden">
        {paginatedGroups.map((group) => {
          const mainDraft = group[0];
          const { fields } = mainDraft;
          const date = fields.GeneratedAt ? new Date(fields.GeneratedAt).toLocaleDateString() : "N/A";
          
          const platforms = Array.from(new Set(group.map(d => {
            const p = d.fields?.Platform;
            if (p === "X (Twitter)") return "twitter";
            if (p === "LinkedIn") return "linkedin";
            if (p === "Email Newsletter") return "email";
            return "twitter";
          }))) as Platform[];

          const status = group.some(d => d.fields?.Status?.toLowerCase() === "pending review") 
            ? "Pending Review" 
            : fields.Status || "Draft";

          return (
            <div key={mainDraft.fields?.RequestId || mainDraft.id} className="glass-card p-6 glass-card-hover">
              <div className="mb-4 flex items-start justify-between">
                <span className={cn(
                  "rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em]",
                  getStatusStyle(status)
                )}>
                  {status}
                </span>
                <button className="text-brand-grey">
                  <MoreVertical size={20} />
                </button>
              </div>
              <h3 className="mb-2 text-lg font-bold text-brand-dark dark:text-brand-light font-heading leading-tight truncate">
                {fields.Topic}
              </h3>
              <p className="mb-4 text-[10px] text-slate-400 font-mono opacity-60">ID: {fields.RequestId}</p>
              
              <div className="flex items-center justify-between border-t border-brand-light-grey pt-4 dark:border-brand-dark/20">
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setSelectedGroup(group); setIsViewModalOpen(true); }}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-accent/10 text-brand-accent shadow-sm"
                  >
                    <Eye size={18} />
                  </button>
                  <button 
                    onClick={() => { 
                      const requestId = group[0].fields?.RequestId;
                      if (requestId) router.push(`/edit?requestId=${requestId}`);
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange shadow-sm"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => { setSelectedGroup(group); setIsDeleteModalOpen(true); }}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500 shadow-sm"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 opacity-60">Created</p>
                  <p className="text-xs font-bold text-brand-dark dark:text-brand-light">{date}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination UI */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-brand-light-grey dark:border-brand-dark/20">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 font-heading uppercase tracking-widest">
          Showing {(currentPage-1)*itemsPerPage + 1} - {Math.min(currentPage*itemsPerPage, filteredGroups.length)} of {filteredGroups.length} Groups
        </p>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm transition-all hover:text-brand-dark dark:bg-white/5 dark:text-slate-500 dark:hover:text-brand-light disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={18} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
               key={page}
               onClick={() => setCurrentPage(page)}
               className={cn(
                 "flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold transition-all",
                 currentPage === page 
                   ? "bg-brand-dark text-white dark:bg-brand-orange" 
                   : "bg-white text-brand-dark hover:bg-brand-light-grey dark:bg-white/5 dark:text-brand-light dark:hover:bg-white/10"
               )}
            >
              {page}
            </button>
          ))}
          <button 
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm transition-all hover:text-brand-dark dark:bg-white/5 dark:text-slate-500 dark:hover:text-brand-light disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* View Modal */}
      {isViewModalOpen && selectedGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white dark:bg-brand-dark rounded-[2.5rem] shadow-2xl flex flex-col border border-brand-light-grey dark:border-brand-dark/20">
            <div className="p-8 border-b border-brand-light-grey dark:border-brand-dark/20 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-brand-dark dark:text-brand-light font-heading">{selectedGroup[0].fields?.Topic}</h2>
                <p className="text-sm text-brand-grey mt-1">Generation Overview • {selectedGroup.length} Variations</p>
              </div>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="p-2 hover:bg-brand-light-grey dark:hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={24} className="text-brand-grey" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-premium">
              {selectedGroup.map((draft, idx) => (
                <div key={draft.id} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-accent/10 text-brand-accent">
                      {platformIcons[draft.fields?.Platform === "X (Twitter)" ? "twitter" : draft.fields?.Platform === "LinkedIn" ? "linkedin" : "email"]}
                    </div>
                    <span className="font-bold text-brand-dark dark:text-brand-light uppercase tracking-widest text-xs">{draft.fields?.Platform}</span>
                    <span className={cn(
                      "ml-auto rounded-full border px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em]",
                      getStatusStyle(draft.fields?.Status || "Draft")
                    )}>
                      {draft.fields?.Status}
                    </span>
                  </div>
                  <div className="p-6 bg-brand-light-grey/30 dark:bg-white/5 rounded-2xl border border-brand-light-grey/50 dark:border-brand-dark/10">
                    <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {parseDraftContent(draft.fields?.Content, draft.fields?.Platform)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white dark:bg-brand-dark rounded-[2.5rem] shadow-2xl flex flex-col border border-brand-light-grey dark:border-brand-dark/20">
            <div className="p-8 border-b border-brand-light-grey dark:border-brand-dark/20 flex items-center justify-between bg-brand-light-grey/10 dark:bg-white/[0.02]">
              <div>
                <h2 className="text-2xl font-bold text-brand-dark dark:text-brand-light font-heading italic">Edit Generation Group</h2>
                <p className="text-sm text-brand-grey mt-1">Manual Content Refinement</p>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-brand-light-grey dark:hover:bg-white/10 rounded-full transition-colors"
                disabled={isUpdating}
              >
                <X size={24} className="text-brand-grey" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-10 scroll-premium">
              {selectedGroup.map((draft, idx) => (
                <div key={draft.id} className="space-y-4 group/item">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
                      {platformIcons[draft.fields?.Platform === "X (Twitter)" ? "twitter" : draft.fields?.Platform === "LinkedIn" ? "linkedin" : "email"]}
                    </div>
                    <span className="font-bold text-brand-dark dark:text-brand-light uppercase tracking-widest text-xs italic">{draft.fields?.Platform}</span>
                  </div>
                  <div className="relative">
                    <textarea 
                      defaultValue={parseDraftContent(draft.fields?.Content, draft.fields?.Platform)}
                      onBlur={(e) => handleUpdateDraft(draft.id, e.target.value)}
                      rows={5}
                      className="w-full rounded-2xl border border-brand-light-grey bg-white p-6 text-sm text-brand-dark transition-all focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 dark:border-brand-dark/20 dark:bg-white/5 dark:text-brand-light shadow-inner resize-none overflow-hidden"
                      placeholder="Enter content..."
                    />
                    {isUpdating && (
                      <div className="absolute top-4 right-4 animate-spin text-brand-accent">
                        <Loader2 size={16} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-8 border-t border-brand-light-grey dark:border-brand-dark/20 bg-brand-light-grey/10 dark:bg-white/[0.02] flex justify-end gap-4">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="px-6 py-2 text-sm font-bold text-brand-grey hover:text-brand-dark dark:text-slate-400 dark:hover:text-brand-light transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedGroup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-brand-dark/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-brand-dark rounded-[2rem] p-8 shadow-2xl border border-brand-light-grey dark:border-brand-dark/20 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mb-6">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-brand-dark dark:text-brand-light font-heading mb-2 italic">Delete Generation Group?</h3>
            <p className="text-sm text-brand-grey mb-8">This will permanently remove the entire group of variations for <br/><span className="font-bold text-brand-dark dark:text-brand-light italic">"{selectedGroup[0].fields?.Topic}"</span>. This action cannot be undone.</p>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="py-3 rounded-xl border border-brand-light-grey dark:border-brand-dark/20 text-sm font-bold text-brand-grey hover:bg-brand-light-grey dark:hover:bg-white/5 transition-all"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDeleteGroup(selectedGroup[0].fields?.RequestId)}
                className="py-3 rounded-xl bg-rose-500 text-white text-sm font-bold hover:bg-rose-600 shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-2"
                disabled={isUpdating}
              >
                {isUpdating ? <Loader2 size={18} className="animate-spin" /> : "Delete Everything"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
