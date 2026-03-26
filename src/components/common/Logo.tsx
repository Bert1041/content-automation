"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "large" | "compact";
  className?: string;
}

export default function Logo({ variant = "compact", className }: LogoProps) {
  const isLarge = variant === "large";

  return (
    <div className={cn("flex items-center gap-4 px-2", isLarge && "flex-col gap-0", className)}>
      <div 
        className={cn(
          "flex items-center justify-center transition-transform hover:scale-105 duration-500 shadow-2xl overflow-hidden",
          isLarge 
            ? "h-20 w-20 rounded-[2rem] bg-brand-dark dark:bg-brand-orange ring-8 ring-brand-orange/5 dark:ring-white/5 mx-auto mb-6" 
            : "h-10 w-10 rounded-[1rem] bg-brand-dark dark:bg-brand-orange text-white shadow-md shadow-brand-dark/10"
        )}
      >
        <Sparkles 
          className="text-white" 
          size={isLarge ? 40 : 20} 
          strokeWidth={1.5} 
        />
      </div>
      {!isLarge && (
        <span className="text-xl font-semibold tracking-tight text-brand-dark dark:text-brand-light font-heading uppercase">
          FETEMI
        </span>
      )}
      {isLarge && (
        <div className="text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-brand-dark dark:text-brand-light font-heading uppercase">
            FETEMI
          </h1>
          <p className="text-[11px] font-semibold text-brand-orange uppercase tracking-[0.2em] opacity-90">
            Content Automation OS
          </p>
        </div>
      )}
    </div>
  );
}
