"use client";
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Routes that should not show navigation
  const authRoutes = ['/login', '/register'];
  const isAuthRoute = authRoutes.includes(pathname);

  if (isAuthRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen max-w-full overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 ml-64 min-w-0 w-full">
        <TopBar />
        <main className="p-4 md:p-8 w-full max-w-full overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
