"use client";
import { useTheme } from './ThemeProvider';
import { useAuth } from '@/contexts/AuthContext';
import { SunIcon, MoonIcon, BellIcon, Bars3Icon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useState, useEffect } from 'react';

interface TopBarProps {
  onMenuClick?: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getUserInitials = () => {
    if (!user?.username) return 'U';
    return user.username.substring(0, 2).toUpperCase();
  };

  return (
    <header className="flex items-center justify-between px-3 sm:px-4 lg:px-6 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-10">
      <div className="flex items-center gap-2 lg:gap-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Bars3Icon className="h-5 w-5" />
        </Button>
        <h1 className="font-bold text-lg sm:text-xl bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
          <span className="hidden sm:inline">Book Lending Tracker</span>
          <span className="sm:hidden">BookTracker</span>
        </h1>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-slate-100 dark:hover:bg-slate-800 hidden sm:flex"
        >
          <BellIcon className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 p-0 text-xs bg-red-500 hover:bg-red-500">
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
            <SunIcon className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 transition-transform hover:rotate-12" /> : 
            <MoonIcon className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700 transition-transform hover:-rotate-12" />
          }
        </Button>
        {user && (
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-sm text-slate-600 dark:text-slate-400">
              {user.username}
            </span>
            <Avatar className="h-7 w-7 sm:h-8 sm:w-8 ring-2 ring-slate-200 dark:ring-slate-700">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs sm:text-sm font-medium">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
              title="Logout"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700 dark:text-slate-300" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
