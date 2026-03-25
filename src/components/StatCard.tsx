import { LucideIcon } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: "default" | "orange" | "dark";
}

export default function StatCard({ title, value, icon: Icon, variant = "default" }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-[2rem] border border-brand-light-grey bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-dark/5 dark:border-brand-dark/20 dark:bg-white/5">
      {/* Decorative Background Element */}
      <div className={cn(
        "absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-5 blur-2xl transition-all group-hover:opacity-10",
        variant === "orange" ? "bg-brand-orange" : variant === "dark" ? "bg-brand-dark" : "bg-brand-orange"
      )} />
      
      <div className="flex items-start justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
              variant === "orange" ? "bg-brand-orange/10 text-brand-orange" : "bg-brand-light-grey/50 text-brand-grey dark:bg-white/10"
            )}>
              <Icon size={18} />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-grey opacity-70 font-heading">
              {title}
            </p>
          </div>
          <h3 className="text-4xl font-bold tracking-tighter text-brand-dark dark:text-brand-light font-heading">
            {value}
          </h3>
        </div>
      </div>
      
      {/* Bottom accent bar */}
      <div className={cn(
        "absolute bottom-0 left-0 h-1 w-0 transition-all duration-500 group-hover:w-full",
        variant === "orange" ? "bg-brand-orange" : "bg-brand-dark dark:bg-brand-light"
      )} />
    </div>
  );
}
