"use client";

import { cn, parseDraftContent } from "@/lib/utils";
import { Linkedin, Twitter, Mail, Heart, MessageCircle, Share2, Repeat2, BarChart3, MoreHorizontal, User, Send } from "lucide-react";

interface PlatformPreviewProps {
  content: string;
  platform: string;
}

export function PlatformPreview({ content, platform }: PlatformPreviewProps) {
  const isLinkedIn = platform.toLowerCase().includes("linkedin");
  const isTwitter = platform.toLowerCase().includes("twitter") || platform.toLowerCase().includes("x");
  const isEmail = platform.toLowerCase().includes("email");

  const text = parseDraftContent(content, platform);

  if (isLinkedIn) {
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex items-center gap-3 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-slate-100 dark:bg-slate-800">
            <User size={24} className="text-slate-400" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">Content Strategist</div>
            <div className="text-[10px] text-slate-600 dark:text-slate-300">1st • Digital Marketing Specialist</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Just now • 🌐</div>
          </div>
        </div>
        <div className="px-4 pb-4">
           <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-slate-800 dark:text-slate-200">
             {text}
           </p>
        </div>
        <div className="border-t border-slate-100 p-2 dark:border-slate-800">
          <div className="flex items-center justify-around">
            <button className="flex items-center gap-2 rounded-md p-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5">
              <span className="text-lg">👍</span> Like
            </button>
            <button className="flex items-center gap-2 rounded-md p-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5">
              <MessageCircle size={16} /> Comment
            </button>
            <button className="flex items-center gap-2 rounded-md p-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5">
              <Share2 size={16} /> Share
            </button>
            <button className="flex items-center gap-2 rounded-md p-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5">
              <Send size={16} /> Send
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isTwitter) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex gap-3">
          <div className="h-10 w-10 shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <div className="h-6 w-6 rounded-full bg-slate-300 dark:bg-slate-700" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-slate-900 dark:text-white">Author Name</span>
                <span className="text-sm text-slate-600 dark:text-slate-300">@author • now</span>
              </div>
              <MoreHorizontal size={14} className="text-slate-500 dark:text-slate-400" />
            </div>
            <p className="whitespace-pre-wrap text-[14px] leading-relaxed text-slate-800 dark:text-slate-200">
              {text.split(' ').map((word, i) => (
                word.startsWith('#') || word.startsWith('@') ? 
                <span key={i} className="text-brand-orange hover:underline cursor-pointer">{word} </span> : 
                word + ' '
              ))}
            </p>
            <div className="mt-4 flex max-w-sm items-center justify-between text-slate-700 dark:text-slate-300">
               <MessageCircle size={16} className="hover:text-blue-500 transition-colors" />
               <Repeat2 size={16} className="hover:text-emerald-500 transition-colors" />
               <Heart size={16} className="hover:text-rose-500 transition-colors" />
               <BarChart3 size={16} className="hover:text-amber-500 transition-colors" />
               <Share2 size={16} className="hover:text-blue-500 transition-colors" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isEmail) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
        <div className="bg-slate-100 p-4 border-b border-slate-200 dark:bg-white/10 dark:border-slate-800">
           <div className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">Newsletter Subject Line</div>
           <div className="mt-1 text-sm font-bold text-slate-900 dark:text-white">Weekly Insights: Creating Magic with CSS & SVG</div>
        </div>
        <div className="p-8">
           <div className="mx-auto max-w-md space-y-6">
              <div className="h-12 w-full bg-slate-100 dark:bg-white/10 rounded-lg flex items-center justify-center">
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">Newsletter Header</span>
              </div>
              <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-slate-700 dark:text-slate-300 font-serif">
                {text}
              </p>
              <div className="h-10 w-40 bg-brand-orange rounded-full flex items-center justify-center shadow-lg shadow-brand-orange/20">
                 <span className="text-[10px] font-black uppercase tracking-widest text-white">Read Full Case Study</span>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="prose prose-sm max-w-none dark:prose-invert">
      <p className="text-lg leading-relaxed text-slate-800 dark:text-slate-200 font-body">
        {text}
      </p>
    </div>
  );
}
