"use client";
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface SidebarCounts {
  books: number;
  friends: number;
  activeLendings: number;
}

interface SidebarContextType {
  counts: SidebarCounts;
  refreshCounts: () => Promise<void>;
  updateBookCount: (delta: number) => void;
  updateFriendCount: (delta: number) => void;
  updateLendingCount: (delta: number) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [counts, setCounts] = useState<SidebarCounts>({
    books: 0,
    friends: 0,
    activeLendings: 0
  });

  const refreshCounts = useCallback(async () => {
    try {
      const [booksRes, friendsRes, lendingsRes] = await Promise.all([
        fetch('/api/books'),
        fetch('/api/friends'),
        fetch('/api/lendings')
      ]);

      const [booksData, friendsData, lendingsData] = await Promise.all([
        booksRes.json(),
        friendsRes.json(),
        lendingsRes.json()
      ]);

      setCounts({
        books: booksData.success ? booksData.data.length : 0,
        friends: friendsData.success ? friendsData.data.length : 0,
        activeLendings: lendingsData.success 
          ? lendingsData.data.filter((l: { status: string }) => l.status === 'active').length 
          : 0
      });
    } catch (error) {
      console.error('Error fetching sidebar counts:', error);
    }
  }, []);

  const updateBookCount = useCallback((delta: number) => {
    setCounts(prev => ({
      ...prev,
      books: Math.max(0, prev.books + delta)
    }));
  }, []);

  const updateFriendCount = useCallback((delta: number) => {
    setCounts(prev => ({
      ...prev,
      friends: Math.max(0, prev.friends + delta)
    }));
  }, []);

  const updateLendingCount = useCallback((delta: number) => {
    setCounts(prev => ({
      ...prev,
      activeLendings: Math.max(0, prev.activeLendings + delta)
    }));
  }, []);

  return (
    <SidebarContext.Provider value={{
      counts,
      refreshCounts,
      updateBookCount,
      updateFriendCount,
      updateLendingCount
    }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
