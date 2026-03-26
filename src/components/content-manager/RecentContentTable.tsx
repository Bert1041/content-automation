import { Edit2, Eye, Trash2, Linkedin, Twitter, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { Draft, Platform, DraftStatus } from "@/types/content";

const recentContent: Partial<Draft>[] = [
  {
    id: 1,
    title: "How Startups Can Use AI for Marketing",
    platforms: ["linkedin", "twitter", "email"],
    status: "Published",
    lastUpdated: "2 hours ago",
  },
  {
    id: 2,
    title: "The Future of Content Automation in 2026",
    platforms: ["linkedin", "email"],
    status: "Pending Review",
    lastUpdated: "5 hours ago",
  },
  {
    id: 3,
    title: "10 SEO Tips for SaaS Platforms",
    platforms: ["twitter"],
    status: "Draft",
    lastUpdated: "1 day ago",
  },
  {
    id: 4,
    title: "Why Minimalist Design Wins in SaaS",
    platforms: ["linkedin", "twitter"],
    status: "Rejected",
    lastUpdated: "2 days ago",
  },
  {
    id: 5,
    title: "Building Scalable AI Workflows with n8n",
    platforms: ["email"],
    status: "Scheduled",
    lastUpdated: "3 days ago",
  },
];

const platformIcons: Partial<Record<Platform, React.ReactNode>> = {
  linkedin: <Linkedin size={16} />,
  twitter: <Twitter size={16} />,
  email: <Mail size={16} />,
};

const statusStyles: Record<DraftStatus, string> = {
  Published: "bg-emerald-500/10 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 ring-1 ring-emerald-500/20",
  "Pending Review": "bg-brand-accent/10 text-brand-accent ring-1 ring-brand-accent/20",
  Draft: "bg-slate-500/10 text-slate-800 dark:bg-slate-500/20 dark:text-slate-400 ring-1 ring-slate-500/20",
  Rejected: "bg-rose-500/10 text-rose-800 dark:bg-rose-500/20 dark:text-rose-400 ring-1 ring-rose-500/20",
  Scheduled: "bg-amber-500/10 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400 ring-1 ring-amber-500/20",
  Approved: "bg-emerald-500/10 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 ring-1 ring-emerald-500/20",
};

export default function RecentContentTable() {
  return (
    <div className="glass-card rounded-[2.5rem] overflow-hidden">
      <div className="flex items-center justify-between border-b border-brand-light-grey/50 px-8 py-6 dark:border-white/10">
        <h2 className="text-xl font-semibold tracking-tight text-brand-dark dark:text-brand-light font-heading">
          Recent Documents
        </h2>
        <button className="text-xs font-semibold text-brand-accent hover:text-brand-accent-light transition-colors px-4 py-2 rounded-xl hover:bg-brand-accent/5 focus-ring">
          View Directory
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-brand-light-grey/50 dark:border-white/10 bg-black/[0.01] dark:bg-white/[0.01]">
              <th className="px-8 py-4 text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 font-heading">Document Name</th>
              <th className="px-8 py-4 text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 font-heading">Channels</th>
              <th className="px-8 py-4 text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 font-heading">Status</th>
              <th className="px-8 py-4 text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 font-heading">Modified</th>
              <th className="px-8 py-4 text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 font-heading text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="">
            {recentContent.map((content, index) => (
              <tr 
                key={content.id} 
                className={cn(
                  "group hover:bg-brand-accent/5 transition-colors duration-300",
                  index !== recentContent.length - 1 && "border-b border-brand-light-grey/30 dark:border-white/5"
                )}
              >
                <td className="px-8 py-5">
                  <p className="max-w-md font-semibold text-[14px] line-clamp-1 font-body text-brand-dark dark:text-brand-light">
                    {content.title || "Untitled Document"}
                  </p>
                </td>
                <td className="px-8 py-5">
                  <div className="flex gap-2">
                    {content.platforms?.map((p) => (
                      <div 
                        key={p} 
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/50 dark:bg-white/5 text-brand-grey shadow-sm group-hover:text-brand-accent group-hover:bg-white dark:group-hover:bg-white/10 transition-all duration-300"
                        title={p}
                      >
                        {platformIcons[p]}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className={cn(
                    "inline-flex items-center px-3 py-1 text-[11px] font-medium rounded-full",
                    content.status && statusStyles[content.status]
                  )}>
                    {content.status || "Draft"}
                  </span>
                </td>
                <td className="px-8 py-5 text-sm font-normal text-slate-500 dark:text-slate-400 font-body">
                  {content.lastUpdated || "Recently"}
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center justify-end gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="p-2 rounded-xl text-slate-400 dark:text-slate-500 hover:bg-brand-accent/10 hover:text-brand-accent transition-colors focus-ring" title="Edit" aria-label={`Edit ${content.title}`}>
                      <Edit2 size={16} />
                    </button>
                    <button className="p-2 rounded-xl text-slate-400 dark:text-slate-500 hover:bg-brand-accent/10 hover:text-brand-accent transition-colors focus-ring" title="View" aria-label={`View ${content.title}`}>
                      <Eye size={16} />
                    </button>
                    <button className="p-2 rounded-xl text-slate-400 dark:text-slate-500 hover:bg-rose-500/10 hover:text-rose-500 transition-colors focus-ring" title="Delete" aria-label={`Delete ${content.title}`}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
