"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/config";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const tokenResult = await userCredential.user.getIdTokenResult(true);
      const role = tokenResult.claims?.role || "Content Manager";
      
      if (role === "Manager") {
        router.push("/manager");
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'code' in err) {
        const error = err as { code: string; message?: string };
        switch (error.code) {
           case 'auth/invalid-credential':
           case 'auth/user-not-found':
           case 'auth/wrong-password':
             setError("Invalid email or password. Please try again.");
             break;
           case 'auth/too-many-requests':
             setError("Too many failed attempts. Please try again later.");
             break;
           default:
             setError(error.message || "An error occurred");
         }
      } else {
         setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-center gap-3 rounded-2xl bg-rose-500/10 p-4 text-xs font-semibold text-rose-600 dark:text-rose-400 border border-rose-500/10 animate-shake">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div className="space-y-4 text-left">
        <div className="space-y-2">
          <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-brand-light-grey/70 font-heading">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-grey" size={18} />
            <input
              type="email"
              required
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-brand-light-grey bg-brand-light/50 py-4 pl-14 pr-6 text-sm font-medium text-brand-dark focus-ring dark:border-brand-dark/20 dark:bg-white/5 dark:text-brand-light transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-brand-light-grey/70 font-heading">
              Password
            </label>
            <button
               type="button"
               className="text-[10px] font-black uppercase tracking-widest text-brand-orange hover:opacity-80 transition-opacity"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-grey" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-brand-light-grey bg-brand-light/50 py-4 pl-14 pr-12 text-sm font-medium text-brand-dark focus-ring dark:border-brand-dark/20 dark:bg-white/5 dark:text-brand-light transition-all shadow-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-grey hover:text-brand-orange transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-brand-dark py-5 text-sm font-semibold text-white shadow-xl transition-all hover:-translate-y-1 hover:shadow-brand-dark/20 active:scale-[0.98] disabled:opacity-70 dark:bg-brand-accent focus-ring"
      >
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
        {isLoading ? (
          <Loader2 className="animate-spin text-white" size={20} strokeWidth={2.5} />
        ) : (
          <span className="font-heading tracking-wide">Secure Login</span>
        )}
      </button>

      <p className="text-center text-[11px] font-normal text-slate-500 dark:text-brand-light-grey/40 font-body leading-relaxed">
        Internal platform for authorized personnel. <br />
        <span className="text-brand-dark dark:text-brand-light font-semibold">Contact admin for access.</span>
      </p>
    </form>
  );
}
