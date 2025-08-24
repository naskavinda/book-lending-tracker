"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, BookOpenIcon, UsersIcon, ArrowRightOnRectangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const navItems = [
  { name: 'Dashboard', href: '/', icon: HomeIcon, badge: null },
  { name: 'Books', href: '/books', icon: BookOpenIcon, badge: '12' },
  { name: 'Friends', href: '/friends', icon: UsersIcon, badge: '5' },
  { name: 'Lend', href: '/lend', icon: ArrowRightOnRectangleIcon, badge: '3' },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        h-screen w-64 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 
        border-r border-slate-200 dark:border-slate-800 flex flex-col z-40 backdrop-blur-xl
        fixed left-0 top-0 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <BookOpenIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg lg:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BookTracker
              </span>
            </div>
            {/* Close button for mobile */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="lg:hidden"
            >
              <XMarkIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <Separator className="mx-4" />
        <nav className="flex-1 px-3 lg:px-4 py-4">
          <ul className="space-y-1">
            {navItems.map(item => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => onClose?.()}>
                  <span className={`group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer relative overflow-hidden ${
                    pathname === item.href 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 scale-[1.02]' 
                      : 'text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:shadow-md hover:scale-[1.01]'
                  }`}>
                    <div className="flex items-center gap-3">
                      <item.icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${pathname === item.href ? 'text-white' : ''}`} />
                      <span className="font-medium text-sm lg:text-base">{item.name}</span>
                    </div>
                    {item.badge && (
                      <Badge variant={pathname === item.href ? "secondary" : "outline"} className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4">
          <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
            v1.0.0
          </div>
        </div>
      </aside>
    </>
  );
}
