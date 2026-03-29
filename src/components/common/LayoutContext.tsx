"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface LayoutContextType {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (value: boolean) => void;
  toggleSidebar: () => void;
  isMobile: boolean;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load state from local storage and handle resize
  useEffect(() => {
    setMounted(true);
    
    // Initial check
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();

    // Listen for resize
    window.addEventListener("resize", checkMobile);

    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved) {
      setSidebarCollapsed(saved === "true");
    }

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const newState = !prev;
      localStorage.setItem("sidebar-collapsed", String(newState));
      return newState;
    });
  };

  // Prevent hydration mismatch by rendering a consistent initial state
  if (!mounted) {
    return (
      <LayoutContext.Provider value={{ sidebarCollapsed: false, setSidebarCollapsed, toggleSidebar, isMobile: false }}>
        <div className="opacity-0">
          {children}
        </div>
      </LayoutContext.Provider>
    );
  }

  return (
    <LayoutContext.Provider value={{ sidebarCollapsed, setSidebarCollapsed, toggleSidebar, isMobile }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
}
