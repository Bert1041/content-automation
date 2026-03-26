import LoginForm from "@/components/common/LoginForm";
import Logo from "@/components/common/Logo";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-brand-light p-6 dark:bg-background">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden -z-10 opacity-20 dark:opacity-40">
        <div className="absolute -left-[10%] -top-[10%] h-[60%] w-[60%] rounded-full bg-brand-orange/30 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[60%] w-[60%] rounded-full bg-brand-dark/20 blur-[120px] dark:bg-brand-orange/10" />
      </div>

      <div className="w-full max-w-md space-y-12 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {/* Logo Section */}
        <Logo variant="large" />

        {/* Login Card */}
        <div className="rounded-[2.5rem] border border-white/40 bg-white/60 p-10 shadow-2xl backdrop-blur-2xl dark:border-white/5 dark:bg-brand-dark/40 ring-1 ring-black/[0.02] dark:ring-white/[0.02]">
           <div className="mb-10 text-center">
              <h2 className="text-2xl font-semibold tracking-tight text-brand-dark dark:text-brand-light font-heading">
                Welcome Back
              </h2>
              <p className="mt-2 text-sm font-normal text-brand-grey dark:text-slate-400 font-body opacity-80">
                Enter your credentials to access your pipeline.
              </p>
           </div>

           <LoginForm />
        </div>

        {/* Footer Meta */}
        <p className="text-[10px] font-bold text-brand-grey dark:text-slate-500 uppercase tracking-widest opacity-50">
          © 2026 Fetemi AI. All rights reserved.
        </p>
      </div>
    </main>
  );
}
