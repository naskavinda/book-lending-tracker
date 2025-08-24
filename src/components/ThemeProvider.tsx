"use client";
import { useEffect, useState, createContext, useContext } from 'react';

const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('theme');
    if (stored) {
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme, mounted]);

  function toggleTheme() {
    setTheme(t => {
      const next = t === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', next);
      return next;
    });
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
