"use client";
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Routes that should not show navigation
  const authRoutes = ['/login', '/register'];
  const isAuthRoute = authRoutes.includes(pathname);

  if (isAuthRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen max-w-full overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 lg:ml-64 min-w-0 w-full">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-3 sm:p-4 md:p-6 lg:p-8 w-full max-w-full overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
