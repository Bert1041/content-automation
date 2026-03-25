import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fetemi | Content Automation Platform",
  description: "Automate your content pipeline with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
