"use client";

import { Edit2, Eye, Trash2, Github, Linkedin, Twitter, Mail } from "lucide-react";

const recentContent = [
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

const platformIcons: Record<string, any> = {
  linkedin: <Linkedin size={14} />,
  twitter: <Twitter size={14} />,
  email: <Mail size={14} />,
};

const statusStyles: Record<string, string> = {
  Published: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  "Pending Review": "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  Draft: "bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-gray-400",
  Rejected: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  Scheduled: "bg-brand-orange/10 text-brand-orange",
};

export default function RecentContentTable() {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-brand-light-grey bg-white shadow-xl shadow-brand-dark/5 dark:border-brand-dark/20 dark:bg-white/5">
      <div className="flex items-center justify-between border-b border-brand-light-grey px-8 py-6 dark:border-brand-dark/20">
        <h2 className="text-xl font-bold tracking-tight text-brand-dark dark:text-brand-light font-heading">
          Recent Content
        </h2>
        <button className="text-xs font-bold uppercase tracking-widest text-brand-orange hover:underline underline-offset-4">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-brand-light-grey dark:border-brand-dark/20 bg-brand-light-grey/20 dark:bg-white/5">
              <th className="px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] text-brand-grey font-heading">Title</th>
              <th className="px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] text-brand-grey font-heading">Platforms</th>
              <th className="px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] text-brand-grey font-heading">Status</th>
              <th className="px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] text-brand-grey font-heading">Last Updated</th>
              <th className="px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] text-brand-grey font-heading">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-light-grey dark:divide-brand-dark/20">
            {recentContent.map((content) => (
              <tr 
                key={content.id} 
                className="group hover:bg-brand-light-grey/30 dark:hover:bg-white/5 transition-colors"
              >
                <td className="px-8 py-5">
                  <p className="max-w-md font-bold text-brand-dark dark:text-brand-light line-clamp-1 font-body">
                    {content.title}
                  </p>
                </td>
                <td className="px-8 py-5">
                  <div className="flex gap-2">
                    {content.platforms.map((p) => (
                      <div 
                        key={p} 
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-light-grey/50 text-brand-grey dark:bg-white/10 dark:text-brand-light"
                        title={p}
                      >
                        {platformIcons[p]}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] ${statusStyles[content.status]}`}>
                    {content.status}
                  </span>
                </td>
                <td className="px-8 py-5 text-sm font-medium text-brand-grey font-body">
                  {content.lastUpdated}
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 transition-colors hover:bg-brand-orange/10 hover:text-brand-orange dark:text-brand-light" title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button className="p-2 transition-colors hover:bg-brand-orange/10 hover:text-brand-orange dark:text-brand-light" title="View">
                      <Eye size={16} />
                    </button>
                    <button className="p-2 transition-colors hover:bg-red-500/10 hover:text-red-500 dark:text-brand-light" title="Delete">
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
