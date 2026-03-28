import { Edit2, Eye, Trash2, Linkedin, Twitter, Mail, Facebook, Instagram, Music } from "lucide-react";
import { cn } from "@/lib/utils";
import { Platform, DraftStatus } from "@/types/content";
import Link from "next/link";

interface RecentContentItem {
  id: string;
  title: string;
  platforms: string[];
  status: string;
  generatedAt?: any;
  requestId: string;
}

interface RecentContentTableProps {
  items: RecentContentItem[];
}

const platformIcons: Record<string, React.ReactNode> = {
  linkedin: <Linkedin size={16} />,
  twitter: <Twitter size={16} />,
  email: <Mail size={16} />,
  facebook: <Facebook size={16} />,
  instagram: <Instagram size={16} />,
  tiktok: <Music size={16} />,
};

const statusStyles: Record<string, string> = {
  published: "bg-emerald-500/10 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 ring-1 ring-emerald-500/20",
  completed: "bg-emerald-500/10 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 ring-1 ring-emerald-500/20",
  "pending review": "bg-brand-accent/10 text-brand-accent ring-1 ring-brand-accent/20",
  review: "bg-brand-accent/10 text-brand-accent ring-1 ring-brand-accent/20",
  draft: "bg-slate-500/10 text-slate-800 dark:bg-slate-500/20 dark:text-slate-400 ring-1 ring-slate-500/20",
  rejected: "bg-rose-500/10 text-rose-800 dark:bg-rose-500/20 dark:text-rose-400 ring-1 ring-rose-500/20",
  scheduled: "bg-amber-500/10 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400 ring-1 ring-amber-500/20",
  approved: "bg-emerald-500/10 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 ring-1 ring-emerald-500/20",
};

function getStatusStyle(status: string) {
  return statusStyles[status.toLowerCase()] || statusStyles.draft;
}

export default function RecentContentTable({ items }: RecentContentTableProps) {
  return (
    <div className="glass-card rounded-[2.5rem] overflow-hidden">
      <div className="flex items-center justify-between border-b border-brand-light-grey/50 px-8 py-6 dark:border-white/10">
        <h2 className="text-xl font-semibold tracking-tight text-brand-dark dark:text-brand-light font-heading">
          Recent Documents
        </h2>
        <Link href="/drafts">
          <button className="text-xs font-semibold text-brand-accent hover:text-brand-accent-light transition-colors px-4 py-2 rounded-xl hover:bg-brand-accent/5 focus-ring">
            View Directory
          </button>
        </Link>
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
            {items.map((content, index) => (
              <tr 
                key={content.requestId} 
                className={cn(
                  "group hover:bg-brand-accent/5 transition-colors duration-300",
                  index !== items.length - 1 && "border-b border-brand-light-grey/30 dark:border-white/5"
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
                        {platformIcons[p.toLowerCase()] || <Mail size={16} />}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className={cn(
                    "inline-flex items-center px-3 py-1 text-[11px] font-medium rounded-full",
                    getStatusStyle(content.status)
                  )}>
                    {content.status || "Draft"}
                  </span>
                </td>
                <td className="px-8 py-5 text-sm font-normal text-slate-500 dark:text-slate-400 font-body">
                  {content.generatedAt instanceof Date 
                    ? content.generatedAt.toLocaleDateString() 
                    : "Recently"}
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center justify-end gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Link href={`/edit?requestId=${content.requestId}`}>
                      <button className="p-2 rounded-xl text-slate-400 dark:text-slate-500 hover:bg-brand-accent/10 hover:text-brand-accent transition-colors focus-ring" title="Edit">
                        <Edit2 size={16} />
                      </button>
                    </Link>
                    {/* Add other actions like View or delete here if needed */}
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center text-slate-400 italic">
                  No recent documents found. Start generating content to see them here.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
