"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/common/Sidebar";
import Header from "@/components/common/Header";
import { useAuth } from "@/components/common/AuthContext";
import { fetchPublishedContent } from "@/lib/firebase/published";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";
import { Loader2, Linkedin, Twitter, Mail, Calendar, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const PLATFORMS = ["All", "LinkedIn", "X (Twitter)", "Email Newsletter"];

export default function PublishedContentPage() {
  const { user } = useAuth();
  const [content, setContent] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activePlatform, setActivePlatform] = useState("All");
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  useEffect(() => {
    if (!user?.email) return;

    async function getData() {
      setIsLoading(true);
      try {
        const data = await fetchPublishedContent(user!.email!, "manager");
        setContent(data);
      } catch (err) {
        console.error("Error fetching published content:", err);
      } finally {
        setIsLoading(false);
      }
    }
    getData();
  }, [user]);

  const filteredContent = content.filter(item => 
    activePlatform === "All" || item.platform === activePlatform
  );

  return (
    <div className="flex min-h-screen bg-brand-light dark:bg-brand-dark">
      <Sidebar role="manager" />
      
      <main className="flex-1 lg:pl-[20rem] transition-all duration-300">
        <Header />
        
        <div className="mx-auto max-w-7xl p-6 lg:p-10">
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1">
              <h2 className="text-3xl font-semibold tracking-tight text-brand-dark dark:text-brand-light font-heading">
                Published Content
              </h2>
              <p className="text-sm font-normal text-slate-600 dark:text-brand-light-grey/60 font-body opacity-90">
                Archive and performance tracking for all content published through Fetemi.
              </p>
            </div>

            {/* Platform Filter */}
            <div className="flex flex-wrap gap-2 bg-white/50 dark:bg-white/5 p-1.5 rounded-2xl border border-brand-light-grey/50 dark:border-white/10 backdrop-blur-sm">
              {PLATFORMS.map((platform) => (
                <button
                  key={platform}
                  onClick={() => setActivePlatform(platform)}
                  className={cn(
                    "px-4 py-2 text-xs font-medium rounded-xl transition-all duration-300",
                    activePlatform === platform
                      ? "bg-brand-accent text-white shadow-md shadow-brand-accent/20"
                      : "text-brand-grey hover:bg-brand-accent/10 hover:text-brand-accent"
                  )}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex h-96 items-center justify-center rounded-[2.5rem] border border-brand-light-grey/50 dark:border-white/10 bg-white/50 dark:bg-white/5">
              <div className="text-center space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-brand-accent mx-auto" />
                <p className="text-sm font-medium text-brand-grey">Accessing archives...</p>
              </div>
            </div>
          ) : filteredContent.length === 0 ? (
            <div className="flex h-96 items-center justify-center rounded-[2.5rem] border border-brand-light-grey/50 dark:border-white/10 bg-white/50 dark:bg-white/5">
               <div className="text-center space-y-3">
                  <Search size={40} className="mx-auto text-brand-grey opacity-20" />
                  <p className="text-xl font-semibold tracking-tight text-brand-grey font-heading">No content found</p>
                  <p className="text-xs font-normal text-brand-grey font-body opacity-60">Try selecting a different platform or check back later.</p>
               </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-2">
              {filteredContent.map((item) => (
                <div 
                  key={item.id} 
                  className="group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-white dark:bg-brand-dark-grey/40 border border-brand-light-grey/30 dark:border-white/5 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-accent/5"
                >
                   {/* Card Header */}
                   <div className="p-6 pb-2 flex items-start justify-between">
                     <div className="space-y-2">
                       <div className="flex items-center gap-2">
                         <div className={cn(
                           "p-2 rounded-xl border transition-colors duration-300",
                           item.platform === "LinkedIn" ? "bg-[#0077B5]/10 border-[#0077B5]/20 text-[#0077B5]" :
                           item.platform === "X (Twitter)" ? "bg-black/5 dark:bg-white/10 border-black/10 text-brand-dark dark:text-brand-light" :
                           "bg-brand-accent/10 border-brand-accent/20 text-brand-accent"
                         )}>
                            {item.platform === "LinkedIn" && <Linkedin size={14} />}
                            {item.platform === "X (Twitter)" && <Twitter size={14} />}
                            {item.platform === "Email Newsletter" && <Mail size={14} />}
                         </div>
                         <span className="text-[10px] font-bold uppercase tracking-widest text-brand-grey/60 px-2">
                           {item.platform}
                         </span>
                       </div>
                       <h3 className="line-clamp-1 text-lg font-bold tracking-tight text-brand-dark dark:text-brand-light font-heading">
                         {item.topic}
                       </h3>
                     </div>
                     <div className="flex items-center gap-1.5 rounded-xl bg-brand-light-grey/20 dark:bg-white/5 px-2.5 py-1 text-[10px] font-medium text-brand-grey">
                        <Calendar size={10} />
                        {new Date(item.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                     </div>
                   </div>

                   {/* Content Area */}
                   <div className="px-6 pb-6 flex-1 overflow-hidden">
                     <div className="relative max-h-48 overflow-hidden rounded-2xl bg-brand-light/20 dark:bg-brand-dark/20 p-4 border border-brand-light-grey/30 dark:border-white/5">
                        <MarkdownRenderer 
                          content={item.content} 
                          className="prose-sm line-clamp-[6]" 
                        />
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white dark:from-brand-dark-grey/40 to-transparent" />
                     </div>
                   </div>

                   {/* Footer Actions */}
                   <div className="mt-auto px-6 py-4 flex items-center justify-between border-t border-brand-light-grey/30 dark:border-white/5 bg-brand-light/20 dark:bg-brand-dark/10">
                      <div className="flex items-center gap-4">
                        <div className="space-y-0.5">
                           <p className="text-[10px] uppercase tracking-wider text-brand-grey/50 font-bold">Author</p>
                           <p className="text-xs font-medium text-brand-dark dark:text-brand-light">{item.authorEmail.split('@')[0]}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setSelectedPost(item)}
                        className="text-[11px] font-bold text-brand-accent hover:opacity-80 transition-opacity"
                      >
                        View Full Post
                      </button>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Full Post Modal Overlay */}
      {selectedPost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8 backdrop-blur-md bg-brand-dark/20 animate-in fade-in duration-300">
          <div 
            className="absolute inset-0 cursor-zoom-out" 
            onClick={() => setSelectedPost(null)} 
          />
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[3rem] bg-brand-light dark:bg-brand-dark border border-brand-light-grey/50 dark:border-white/10 shadow-2xl flex flex-col transition-all duration-500 animate-in zoom-in-95 slide-in-from-bottom-10">
             {/* Modal Header */}
             <div className="p-8 pb-4 flex items-start justify-between">
                <div className="space-y-2">
                   <div className="flex items-center gap-3">
                     <div className={cn(
                       "p-2.5 rounded-2xl border bg-white/50 dark:bg-white/5",
                       selectedPost.platform === "LinkedIn" ? "text-[#0077B5] border-[#0077B5]/20" :
                       selectedPost.platform === "X (Twitter)" ? "text-brand-dark dark:text-brand-light border-black/10" :
                       "text-brand-accent border-brand-accent/20"
                     )}>
                        {selectedPost.platform === "LinkedIn" && <Linkedin size={18} />}
                        {selectedPost.platform === "X (Twitter)" && <Twitter size={18} />}
                        {selectedPost.platform === "Email Newsletter" && <Mail size={18} />}
                     </div>
                     <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-grey/50">
                       {selectedPost.platform}
                     </span>
                   </div>
                   <h2 className="text-2xl font-bold tracking-tight text-brand-dark dark:text-brand-light font-heading">
                     {selectedPost.topic}
                   </h2>
                </div>
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="group p-3 rounded-2xl bg-brand-light-grey/20 dark:bg-white/5 text-brand-grey hover:bg-brand-orange/10 hover:text-brand-orange transition-all"
                >
                  <Search className="rotate-45" size={20} />
                </button>
             </div>

             {/* Modal Content Scrollable Area */}
             <div className="flex-1 overflow-y-auto p-8 pt-0 custom-scrollbar">
                <div className="prose-lg max-w-none bg-white/30 dark:bg-white/5 rounded-[2.5rem] p-8 border border-brand-light-grey/30 dark:border-white/5">
                   <MarkdownRenderer content={selectedPost.content} />
                </div>
                
                {/* Meta details in footer of scroll area */}
                <div className="mt-8 flex flex-wrap gap-8 items-center px-4 font-body">
                   <div className="space-y-1 text-center sm:text-left">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-brand-grey/40">Published On</p>
                      <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-brand-dark dark:text-brand-light">
                         <Calendar size={14} className="text-brand-accent" />
                         {new Date(selectedPost.publishedAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                   </div>
                   <div className="space-y-1 text-center sm:text-left">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-brand-grey/40">Author Email</p>
                      <p className="text-xs font-semibold text-brand-dark dark:text-brand-light tracking-tight">{selectedPost.authorEmail}</p>
                   </div>
                   <div className="space-y-1 text-center sm:text-left">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-brand-grey/40">Record ID</p>
                      <p className="text-[9px] font-mono opacity-40">{selectedPost.id}</p>
                   </div>
                </div>
             </div>

             {/* Modal Footer */}
             <div className="p-8 pt-4 flex justify-end gap-4 border-t border-brand-light-grey/30 dark:border-white/5 bg-brand-light-grey/5 to-transparent">
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="px-10 py-3.5 rounded-2xl bg-brand-accent text-white font-bold text-[13px] shadow-lg shadow-brand-accent/20 hover:scale-[1.02] hover:shadow-xl transition-all"
                >
                  Close Archive View
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
