"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

export default function Toast({ message, type = "info", duration = 5000, onClose }: ToastProps) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  const icons = {
    success: <CheckCircle2 className="text-emerald-500" size={18} />,
    error: <XCircle className="text-rose-500" size={18} />,
    info: <Info className="text-brand-accent" size={18} />,
  };

  return (
    <div className={cn(
      "fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-3 rounded-2xl bg-white p-4 pr-12 shadow-2xl transition-all duration-300 dark:bg-brand-dark border border-brand-light-grey dark:border-brand-dark/20",
      isClosing ? "translate-y-20 opacity-0" : "translate-y-0 opacity-100 animate-fade-in-up"
    )}>
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 dark:bg-white/5">
        {icons[type]}
      </div>
      <p className="whitespace-nowrap text-sm font-medium text-brand-dark dark:text-brand-light font-body">
        {message}
      </p>
      <button 
        onClick={handleClose}
        className="absolute right-3 p-1 text-slate-400 hover:text-brand-dark dark:hover:text-brand-light transition-colors"
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}
