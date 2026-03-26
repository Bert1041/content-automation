"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/components/common/AuthContext";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        if (pathname !== "/login") {
          router.push("/login");
        }
      } else {
        // Handle role-based redirection
        if (pathname.startsWith("/manager") && role !== "Manager") {
          router.push("/");
        } else if (pathname === "/" && role === "Manager") {
          router.push("/manager");
        }
      }
    }
  }, [user, role, loading, pathname, router]);

  if (loading) {
     return (
       <div className="flex min-h-screen items-center justify-center bg-brand-light dark:bg-background">
         <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
       </div>
     );
  }

  // If we aren't loading, and we don't have a user, and we're not on the login page
  // The useEffect will catch it and redirect, but we return null to prevent flash of content.
  if (!user && pathname !== "/login") {
     return null;
  }

  return <>{children}</>;
}
