"use client";
import DashboardStats from '@/components/DashboardStats';
import StatisticsChart from '@/components/StatisticsChart';

// Sample data for demonstration
const stats = { total: 10, lent: 3, available: 7, overdue: 1 };
const chartData = { labels: ['Jan', 'Feb', 'Mar'], values: [2, 5, 3] };

export default function DashboardPage() {
  return (
    <div className="w-full max-w-full overflow-x-hidden p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
        Dashboard
      </h1>
      <DashboardStats stats={stats} />
      <div className="mb-6 sm:mb-8 w-full">
        <StatisticsChart data={chartData} />
      </div>
    </div>
  );
}
