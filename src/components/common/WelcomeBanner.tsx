"use client";

import { useAuth } from "@/components/common/AuthContext";

export default function WelcomeBanner({ subtitle }: { subtitle: string }) {
  const { user } = useAuth();
  const firstName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || "there";

  return (
    <div className="flex flex-col gap-3 animate-fade-in-up">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 dark:bg-brand-dark/50 backdrop-blur-md border border-white/20 text-xs font-medium tracking-wide text-brand-accent shadow-sm w-fit">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-accent"></span>
        </span>
        Systems Operational
      </div>
      <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight font-heading text-brand-dark dark:text-brand-light">
        Welcome back, <span className="text-brand-accent">{firstName}</span>!
      </h2>
      <p className="text-sm text-slate-600 dark:text-brand-light-grey font-body max-w-lg leading-relaxed opacity-90">
        {subtitle}
      </p>
    </div>
  );
}
