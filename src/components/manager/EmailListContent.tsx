"use client";

import { useState, useEffect } from "react";
import { 
  Search, Mail, Trash2, 
  Plus, X as XIcon, Loader2, RotateCcw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { n8nApi } from "@/lib/api/n8n";
import { useAuth } from "@/components/common/AuthContext";
import Toast, { ToastType } from "@/components/common/Toast";

interface EmailEntry {
  id: string;
  email: string;
  addedAt?: string;
}

export default function EmailListContent() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [emails, setEmails] = useState<EmailEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Add form state
  const [newEmail, setNewEmail] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const fetchEmailList = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
       console.log(`[EmailList] Fetching with role: Manager, table: Email_List`);
       // Using the generic rulesManager as a pattern for list management
       const res = await n8nApi.rulesManager({
         action: "read",
         table: "Email_List",
         role: "Manager",
         userEmail: user.email
       });
        
       console.log(`[EmailList] Raw response received:`, res);
        // Robust parsing to handle different n8n response structures
        let data: any[] = [];
        if (Array.isArray(res)) {
          data = res;
        } else if (res && typeof res === 'object') {
          // If it's a single record object (has fields or id directly)
          if (res.fields || res.id) {
            data = [res];
          } else {
            // Handle cases where data is wrapped in a property like 'data', 'items', or 'records'
            data = res.data || res.items || res.records || res.item || (Array.isArray(res.body) ? res.body : []);
          }
        }

        if (Array.isArray(data)) {
          const mapped = data.map((item: any) => {
            // Handle both raw Airtable and n8n-wrapped formats
            const fields = item.fields || item.json?.fields || item.json || item;
            return {
              id: item.id || fields.id || Math.random().toString(36),
              email: fields.Email || fields.email || fields.email_address || "",
              addedAt: fields.AddedAt || fields.addedAt || item.createdTime || item.CreatedTime || ""
            };
          }).filter(e => e.email);
          
          console.log(`[EmailList] Mapped ${mapped.length} emails:`, mapped);
          setEmails(mapped);
        } else {
          console.warn(`[EmailList] No array data found in response. Found:`, typeof data);
        }
    } catch (e) {
       console.error("Failed to fetch email list:", e);
    } finally {
       setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmailList();
  }, [user?.email]);

  const handleAddEmail = async () => {
    if (!newEmail.trim()) {
      setToast({ message: "Please enter at least one email address.", type: "error" });
      return;
    }
    if (!user?.email) return;
    
    // Parse emails: split by comma, newline, or space
    const emailList = newEmail
      .split(/[\n,\s;]+/)
      .map(e => e.trim())
      .filter(e => e !== "" && e.includes("@")); // Basic validation

    if (emailList.length === 0) {
      setToast({ message: "No valid email addresses found.", type: "error" });
      return;
    }

    setIsAdding(true);
    
    try {
      await n8nApi.addBatchEmails({
        emails: emailList,
        role: "Manager",
        userEmail: user.email
      });
      
      setToast({ 
        message: `Successfully imported ${emailList.length} emails!`, 
        type: "success" 
      });
      setNewEmail("");
      setShowAddModal(false);
      fetchEmailList();
    } catch (err: unknown) {
      console.error("Failed to import emails:", err);
      const message = err instanceof Error ? err.message : "An unknown error occurred";
      setToast({ message: "Error importing emails: " + message, type: "error" });
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteEmail = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to remove ${email} from the list?`)) return;
    if (!user?.email) return;

    setIsDeleting(id);
    try {
      await n8nApi.rulesManager({
        action: "delete",
        table: "Email_List",
        role: "Manager",
        id: id,
        userEmail: user.email
      });

      // Handle success - optimistically remove
      setEmails(emails.filter(e => e.id !== id));
      setToast({ message: `Email removed from the list.`, type: "success" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unknown error occurred";
      setToast({ message: "Error removing email: " + message, type: "error" });
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredEmails = emails.filter(entry => {
    const searchLow = searchQuery.toLowerCase();
    return entry.email.toLowerCase().includes(searchLow);
  });

  return (
    <div className="space-y-10 relative">
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
         <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
            <input 
               type="text" 
               placeholder="Search emails..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full rounded-2xl border border-brand-light-grey bg-white py-4 pl-14 pr-6 text-sm font-medium text-brand-dark shadow-xl shadow-brand-dark/5 focus:outline-none dark:border-brand-dark/20 dark:bg-white/5 dark:text-brand-light placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
         </div>
                  <div className="flex items-center gap-4">
            <button 
               onClick={fetchEmailList}
               className="group flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-light-grey bg-white text-slate-400 transition-all hover:text-brand-dark dark:border-brand-dark/20 dark:bg-white/5 dark:text-slate-500 dark:hover:text-brand-light shadow-xl shadow-brand-dark/5"
               title="Refresh List"
            >
               <RotateCcw size={20} className="transition-transform group-hover:-rotate-180 duration-500" />
            </button>

            <button 
               onClick={() => setShowAddModal(true)}
               className="flex items-center justify-center gap-3 rounded-2xl bg-brand-dark px-8 py-4 h-14 text-xs font-black uppercase tracking-widest text-white shadow-xl transition-all active:scale-95 dark:bg-brand-orange whitespace-nowrap"
            >
               <Plus size={18} />
               Add To List
            </button>
          </div>
      </div>

      <div className="rounded-[2.5rem] border border-brand-light-grey bg-white shadow-xl shadow-brand-dark/5 dark:border-brand-dark/20 dark:bg-white/5 overflow-hidden">
         <table className="w-full text-left font-body">
            <thead>
               <tr className="border-b border-brand-light-grey dark:border-brand-dark/20 bg-black/[0.01] dark:bg-white/[0.01]">
                  <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Distribution List</th>
                  <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Date Added</th>
                  <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-brand-light-grey dark:divide-brand-dark/20">
               {loading ? (
                 <tr>
                   <td colSpan={3} className="p-10 text-center text-brand-grey">
                     <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                   </td>
                 </tr>
               ) : filteredEmails.length === 0 ? (
                 <tr>
                   <td colSpan={3} className="p-10 text-center text-brand-grey text-sm font-bold">No emails found.</td>
                 </tr>
               ) : filteredEmails.map((entry) => (
                 <tr key={entry.id} className="group transition-colors hover:bg-brand-light/20 dark:hover:bg-white/5">
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-4">
                          <div className="h-10 w-10 shrink-0 rounded-full bg-brand-light-grey flex items-center justify-center text-xs font-black text-brand-grey dark:bg-white/10 dark:text-brand-light">
                             <Mail size={16} />
                          </div>
                          <span className="text-sm font-medium text-brand-dark dark:text-brand-light">{entry.email}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-xs text-slate-600 dark:text-slate-500 font-bold uppercase tracking-widest">
                       {entry.addedAt ? new Date(entry.addedAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleDeleteEmail(entry.id, entry.email)}
                            disabled={isDeleting === entry.id}
                            className="h-8 w-8 rounded-lg bg-brand-light flex items-center justify-center text-brand-grey hover:bg-red-500 hover:text-white transition-all dark:bg-white/10 disabled:opacity-50"
                          >
                             {isDeleting === entry.id ? (
                               <Loader2 size={14} className="animate-spin" />
                             ) : (
                               <Trash2 size={14} />
                             )}
                          </button>
                       </div>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-dark/80 backdrop-blur-sm p-6">
           <div className="w-full max-w-xl rounded-[3rem] bg-white p-12 shadow-2xl dark:bg-brand-dark dark:border dark:border-brand-dark/20 relative">
              <button 
                 onClick={() => setShowAddModal(false)}
                 className="absolute right-10 top-10 text-brand-grey hover:text-brand-dark transition-colors"
              >
                 <XIcon size={24} />
              </button>
              
              <div className="mb-10 space-y-2">
                 <h3 className="text-3xl font-black uppercase tracking-tighter font-heading text-brand-dark dark:text-brand-light">Bulk Add Emails</h3>
                 <p className="text-sm font-medium text-slate-700 dark:text-slate-300 font-body">Paste a list of emails separated by commas or newlines.</p>
              </div>

              <div className="space-y-6">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 font-heading">Distribution List</label>
                    <textarea 
                      placeholder="user1@example.com&#10;user2@example.com&#10;user3@example.com" 
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      rows={8}
                      className="w-full rounded-2xl bg-brand-light px-6 py-4 text-sm font-bold text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-orange dark:bg-white/5 dark:text-white border border-transparent resize-none font-mono placeholder:text-slate-400" 
                    />
                 </div>
              </div>

              <div className="mt-12">
                 <button 
                   onClick={handleAddEmail}
                   disabled={isAdding}
                   className="w-full rounded-[2rem] bg-brand-dark py-5 text-sm flex justify-center items-center font-black uppercase tracking-widest text-white shadow-2xl transition-all active:scale-95 disabled:opacity-50 dark:bg-brand-orange"
                 >
                    {isAdding ? <Loader2 className="animate-spin text-white" size={18} /> : "Import Emails"}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
