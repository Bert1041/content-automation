import type { Metadata } from "next";
import { Outfit, Manrope } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/common/AuthContext";
import { ThemeProvider } from "@/components/common/ThemeContext";
import { LayoutProvider } from "@/components/common/LayoutContext";
import ProtectedRoute from "@/components/common/ProtectedRoute";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fetemi | Soft Dashboard",
  description: "Automate your content pipeline seamlessly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${manrope.variable}`} suppressHydrationWarning>
      <body className="antialiased min-h-screen" suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <LayoutProvider>
              <ProtectedRoute>
                {children}
              </ProtectedRoute>
            </LayoutProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
