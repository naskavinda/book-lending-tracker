"use client";
import { useTheme } from './ThemeProvider';
import { SunIcon, MoonIcon, BellIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useState, useEffect } from 'react';

export default function TopBar() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h1 className="font-bold text-xl bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
          Book Lending Tracker
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <BellIcon className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 hover:bg-red-500">
            2
          </Badge>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
        >
          {mounted && theme === 'dark' ? 
            <SunIcon className="h-5 w-5 text-amber-500 transition-transform hover:rotate-12" /> : 
            <MoonIcon className="h-5 w-5 text-slate-700 transition-transform hover:-rotate-12" />
          }
        </Button>
        <Avatar className="h-8 w-8 ring-2 ring-slate-200 dark:ring-slate-700">
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-medium">
            U
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
