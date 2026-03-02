"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Start with a value derived from the DOM to avoid hydration mismatch.
  // Default theme is dark (no class on <html>). Light theme is html.light.
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document === "undefined") return "dark";
    return document.documentElement.classList.contains("light") ? "light" : "dark";
  });

  useEffect(() => {
    // Sync state with whatever the pre-hydration script set.
    const current = document.documentElement.classList.contains("light") ? "light" : "dark";
    setTheme(current);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const html = document.documentElement;
    // Dark is default (no class). Light uses html.light.
    if (newTheme === "light") html.classList.add("light");
    else html.classList.remove("light");
    localStorage.setItem("theme", newTheme);
  };

  const toggleTheme = () => {
    const newTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // During SSR, safely return default
    if (typeof window === "undefined") {
      return { theme: "dark" as Theme, toggleTheme: () => {} };
    }
    
    // In development, warn if provider is missing (helps catch setup errors)
    if (process.env.NODE_ENV === "development") {
      console.warn("useTheme must be used within a ThemeProvider. Using default theme.");
    }
    
    return { theme: "dark" as Theme, toggleTheme: () => {} };
  }
  return context;
}
