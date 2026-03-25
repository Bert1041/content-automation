"use client";

import { useState } from "react";
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
  LinkedinIcon
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const mockDrafts = [
  {
    id: 1,
    title: "How Startups Can Use AI for Marketing",
    platforms: ["linkedin", "twitter", "email"],
    status: "Approved",
    createdAt: "Mar 20, 2026",
    lastUpdated: "2h ago",
  },
  {
    id: 2,
    title: "The Future of Content Automation in 2026",
    platforms: ["linkedin", "email"],
    status: "Pending Review",
    createdAt: "Mar 21, 2026",
    lastUpdated: "5h ago",
  },
  {
    id: 3,
    title: "10 SEO Tips for SaaS Platforms",
    platforms: ["twitter"],
    status: "Draft",
    createdAt: "Mar 18, 2026",
    lastUpdated: "1d ago",
  },
  {
    id: 4,
    title: "Why Minimalist Design Wins in SaaS",
    platforms: ["linkedin", "twitter"],
    status: "Rejected",
    createdAt: "Mar 15, 2026",
    lastUpdated: "2d ago",
  },
  {
    id: 5,
    title: "Building Scalable AI Workflows with n8n",
    platforms: ["email"],
    status: "Draft",
    createdAt: "Mar 10, 2026",
    lastUpdated: "3d ago",
  },
  {
    id: 6,
    title: "Growth Hacking for Early Stage Founders",
    platforms: ["linkedin"],
    status: "Approved",
    createdAt: "Mar 12, 2026",
    lastUpdated: "4d ago",
  },
];

const platformIcons: Record<string, any> = {
  linkedin: <Linkedin size={14} />,
  twitter: <Twitter size={14} />,
  email: <Mail size={14} />,
};

const statusStyles: Record<string, string> = {
  Approved: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-200 dark:border-green-500/20",
  "Pending Review": "bg-brand-orange/10 text-brand-orange border-brand-orange/20",
  Rejected: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20",
  Draft: "bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-gray-400 border-gray-200 dark:border-white/10",
};

export default function DraftsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [platformFilter, setPlatformFilter] = useState("All");

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-grey transition-colors group-focus-within:text-brand-orange" size={18} />
          <input 
            type="text"
            placeholder="Search drafts by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-brand-light-grey bg-white py-3 pl-12 pr-4 text-sm text-brand-dark transition-all focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/5 dark:border-brand-dark/20 dark:bg-white/5 dark:text-brand-light"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <div className="relative">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none rounded-xl border border-brand-light-grey bg-white py-2 pl-4 pr-10 text-xs font-bold uppercase tracking-widest text-brand-dark transition-all hover:bg-brand-light-grey focus:border-brand-orange dark:border-brand-dark/20 dark:bg-white/5 dark:text-brand-light dark:hover:bg-white/10"
            >
              <option>All Statuses</option>
              <option>Draft</option>
              <option>Pending Review</option>
              <option>Rejected</option>
              <option>Approved</option>
            </select>
            <Filter size={14} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-brand-grey" />
          </div>

          {/* Platform Filter */}
          <div className="relative">
            <select 
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="appearance-none rounded-xl border border-brand-light-grey bg-white py-2 pl-4 pr-10 text-xs font-bold uppercase tracking-widest text-brand-dark transition-all hover:bg-brand-light-grey focus:border-brand-orange dark:border-brand-dark/20 dark:bg-white/5 dark:text-brand-light dark:hover:bg-white/10"
            >
              <option>All Platforms</option>
              <option>LinkedIn</option>
              <option>Twitter</option>
              <option>Email</option>
            </select>
            <Filter size={14} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-brand-grey" />
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden rounded-[2.5rem] border border-brand-light-grey bg-white shadow-xl shadow-brand-dark/5 dark:border-brand-dark/20 dark:bg-white/5 lg:block overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-brand-light-grey dark:border-brand-dark/20 bg-brand-light-grey/20 dark:bg-white/5">
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-[0.15em] text-brand-grey font-heading">Title</th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-[0.15em] text-brand-grey font-heading">Platforms</th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-[0.15em] text-brand-grey font-heading">Status</th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-[0.15em] text-brand-grey font-heading">Created Date</th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-[0.15em] text-brand-grey font-heading">Last Updated</th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-[0.15em] text-brand-grey font-heading">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-light-grey dark:divide-brand-dark/20">
            {mockDrafts.map((draft) => (
              <tr key={draft.id} className="group hover:bg-brand-light-grey/30 dark:hover:bg-white/5 transition-colors">
                <td className="px-8 py-5 max-w-sm">
                  <p className="font-bold text-brand-dark dark:text-brand-light line-clamp-1 font-body">
                    {draft.title}
                  </p>
                </td>
                <td className="px-8 py-5">
                  <div className="flex gap-2">
                    {draft.platforms.map((p) => (
                      <div key={p} className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-light-grey/50 text-brand-grey dark:bg-white/10 dark:text-brand-light">
                        {platformIcons[p]}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className={cn(
                    "inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] shadow-sm",
                    statusStyles[draft.status]
                  )}>
                    {draft.status}
                  </span>
                </td>
                <td className="px-8 py-5 text-sm font-medium text-brand-grey font-body">
                  {draft.createdAt}
                </td>
                <td className="px-8 py-5 text-sm font-medium text-brand-grey font-body">
                  {draft.lastUpdated}
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-1 opacity-100 group-hover:opacity-100 lg:opacity-0 transition-opacity">
                    <button className="rounded-lg p-2 transition-colors hover:bg-brand-orange/10 hover:text-brand-orange dark:text-brand-light" title="View">
                      <Eye size={16} />
                    </button>
                    <button className="rounded-lg p-2 transition-colors hover:bg-brand-orange/10 hover:text-brand-orange dark:text-brand-light" title="Edit">
                      <Edit2 size={16} />
                    </button>
                    {draft.status === "Draft" && (
                      <button className="rounded-lg p-2 transition-colors hover:bg-brand-orange/10 text-brand-orange" title="Send for Review">
                        <Send size={16} />
                      </button>
                    )}
                    <button className="rounded-lg p-2 transition-colors hover:bg-red-500/10 hover:text-red-500 dark:text-brand-light" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Cards View */}
      <div className="grid gap-4 lg:hidden">
        {mockDrafts.map((draft) => (
          <div key={draft.id} className="rounded-3xl border border-brand-light-grey bg-white p-6 dark:border-brand-dark/20 dark:bg-white/5 shadow-lg shadow-brand-dark/5">
            <div className="mb-4 flex items-start justify-between">
              <span className={cn(
                "rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em]",
                statusStyles[draft.status]
              )}>
                {draft.status}
              </span>
              <button className="text-brand-grey">
                <MoreVertical size={20} />
              </button>
            </div>
            <h3 className="mb-4 text-lg font-bold text-brand-dark dark:text-brand-light font-heading leading-tight">
              {draft.title}
            </h3>
            <div className="flex items-center justify-between border-t border-brand-light-grey pt-4 dark:border-brand-dark/20">
              <div className="flex gap-2">
                {draft.platforms.map((p) => (
                  <div key={p} className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-light-grey/50 text-brand-grey dark:bg-white/10">
                    {platformIcons[p]}
                  </div>
                ))}
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-brand-grey opacity-60">Created</p>
                <p className="text-xs font-bold text-brand-dark dark:text-brand-light">{draft.createdAt}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Placeholder */}
      <div className="flex items-center justify-between px-6 py-4">
        <p className="text-xs font-bold text-brand-grey font-heading uppercase tracking-widest">
          Showing 1 - 6 of 24 Drafts
        </p>
        <div className="flex items-center gap-2">
          <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-light-grey bg-white text-brand-dark transition-all hover:bg-brand-light-grey disabled:opacity-30 dark:border-brand-dark/20 dark:bg-white/5 dark:text-brand-light" disabled>
            <ChevronLeft size={20} />
          </button>
          {[1, 2, 3, 4].map((page) => (
            <button 
              key={page}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold transition-all",
                page === 1 
                  ? "bg-brand-dark text-white dark:bg-brand-orange" 
                  : "border border-brand-light-grey bg-white text-brand-dark hover:bg-brand-light-grey dark:border-brand-dark/20 dark:bg-white/5 dark:text-brand-light"
              )}
            >
              {page}
            </button>
          ))}
          <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-light-grey bg-white text-brand-dark transition-all hover:bg-brand-light-grey dark:border-brand-dark/20 dark:bg-white/5 dark:text-brand-light">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
