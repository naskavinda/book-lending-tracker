"use client";
import { Card, CardContent } from '@/components/ui/card';
import { BookOpenIcon, CheckCircleIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function DashboardStats({ stats }: { stats: { total: number, lent: number, available: number, overdue: number } }) {
  const statItems = [
    {
      title: 'Total Books',
      value: stats.total,
      icon: BookOpenIcon,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Lent Out',
      value: stats.lent,
      icon: ClockIcon,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50 dark:bg-amber-950/20',
      textColor: 'text-amber-600 dark:text-amber-400'
    },
    {
      title: 'Available',
      value: stats.available,
      icon: CheckCircleIcon,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
      textColor: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Overdue',
      value: stats.overdue,
      icon: ExclamationTriangleIcon,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950/20',
      textColor: 'text-red-600 dark:text-red-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 w-full">
      {statItems.map((item) => (
        <Card key={item.title} className={`${item.bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer group`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${item.textColor} mb-1`}>{item.title}</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 group-hover:scale-110 transition-transform duration-200">
                  {item.value}
                </p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color} shadow-lg group-hover:rotate-12 transition-transform duration-300`}>
                <item.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
