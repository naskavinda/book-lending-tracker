"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, BookOpenIcon, UsersIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, badge: null },
  { name: 'Books', href: '/books', icon: BookOpenIcon, badge: '12' },
  { name: 'Friends', href: '/friends', icon: UsersIcon, badge: '5' },
  { name: 'Lend', href: '/lend', icon: ArrowRightOnRectangleIcon, badge: '3' },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="h-screen w-64 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 border-r border-slate-200 dark:border-slate-800 fixed left-0 top-0 flex flex-col z-20 backdrop-blur-xl">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <BookOpenIcon className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            BookTracker
          </span>
        </div>
      </div>
      <Separator className="mx-4" />
      <nav className="flex-1 px-4 py-4">
        <ul className="space-y-1">
          {navItems.map(item => (
            <li key={item.href}>
              <Link href={item.href}>
                <span className={`group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer relative overflow-hidden ${
                  pathname === item.href 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 scale-[1.02]' 
                    : 'text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:shadow-md hover:scale-[1.01]'
                }`}>
                  <div className="flex items-center gap-3">
                    <item.icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${pathname === item.href ? 'text-white' : ''}`} />
                    <span className="font-medium">{item.name}</span>
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
  );
}
