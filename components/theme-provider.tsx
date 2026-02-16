"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    resolvedTheme: "dark" | "light";
}

const ThemeContext = createContext<ThemeContextType>({
    theme: "system",
    setTheme: () => { },
    resolvedTheme: "dark",
});

export function useTheme() {
    return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("system");
    const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("dark");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem("theme") as Theme | null;
        if (stored) {
            setThemeState(stored);
        }
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const root = document.documentElement;
        let resolved: "dark" | "light";

        if (theme === "system") {
            resolved = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        } else {
            resolved = theme;
        }

        setResolvedTheme(resolved);

        if (resolved === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
    }, [theme, mounted]);

    // Listen for system theme changes
    useEffect(() => {
        if (theme !== "system") return;
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = (e: MediaQueryListEvent) => {
            const resolved = e.matches ? "dark" : "light";
            setResolvedTheme(resolved);
            if (resolved === "dark") {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        };
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, [theme]);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    // Prevent flash by not rendering until mounted
    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
