import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/components/common/AuthContext";
import { ThemeProvider } from "@/components/common/ThemeContext";
import { LayoutProvider } from "@/components/common/LayoutContext";
import ProtectedRoute from "@/components/common/ProtectedRoute";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-body',
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: '--font-heading',
});

export const metadata: Metadata = {
  title: "Fetemi | Content Automation Platform",
  description: "Next-generation content automation for LinkedIn, X, and Email.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(inter.variable, outfit.variable)}>
      <body suppressHydrationWarning className="antialiased min-h-screen">
        <AuthProvider>
          <ThemeProvider>
            <LayoutProvider>
              <ProtectedRoute>
                {children}
              </ProtectedRoute>
            </LayoutProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
