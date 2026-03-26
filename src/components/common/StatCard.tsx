import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: "default" | "orange" | "dark";
}

export default function StatCard({ title, value, icon: Icon, variant = "default" }: StatCardProps) {
  return (
    <div className={cn(
      "group relative overflow-hidden rounded-[2.5rem] p-6 transition-all duration-500 glass-card-hover focus-ring",
      variant === "default" ? "glass-card" : 
      variant === "orange" ? "bg-gradient-to-br from-brand-orange to-brand-orange-light border-none text-white shadow-xl shadow-brand-orange/20" :
      "bg-gradient-to-br from-brand-dark to-[#1e293b] dark:from-brand-dark dark:to-brand-dark border-none text-brand-light shadow-xl shadow-brand-dark/20"
    )}
    tabIndex={0}
    role="status"
    aria-label={`${title}: ${value}`}
    >
      {/* Background soft glow bubble */}
      <div className={cn(
        "absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-20 blur-3xl transition-transform duration-700 group-hover:scale-150",
        variant === "orange" ? "bg-white" : variant === "dark" ? "bg-brand-accent-light" : "bg-brand-orange-light"
      )} />
      
      <div className="relative z-10 flex flex-col h-full justify-between space-y-6">
        <div className="flex items-center justify-between">
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110",
            variant === "orange" ? "bg-white/20 text-white backdrop-blur-md" : "bg-brand-accent/10 text-brand-accent dark:bg-brand-accent/20 dark:text-brand-accent-light"
          )}>
            <Icon size={20} strokeWidth={2} />
          </div>
          <div className={cn(
            "h-1.5 w-1.5 rounded-full transition-all duration-500",
            variant === "orange" ? "bg-white/50 group-hover:bg-white" : "bg-brand-accent-light/50 group-hover:bg-brand-accent"
          )} />
        </div>
        
        <div>
          <h3 className={cn(
            "mb-1 text-3xl lg:text-3xl font-semibold tracking-tight font-heading",
            variant === "default" ? "text-brand-dark dark:text-brand-light" : "text-white"
          )}>
            {value}
          </h3>
          <p className={cn(
            "text-xs font-normal tracking-wide font-body",
            variant === "default" ? "text-slate-500 dark:text-brand-light-grey opacity-90" : "text-white opacity-80"
          )}>
            {title}
          </p>
        </div>
      </div>
    </div>
  );
}
