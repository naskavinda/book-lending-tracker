"use client";
import DashboardStats from '@/components/DashboardStats';
import StatisticsChart from '@/components/StatisticsChart';

// Sample data for demonstration
const stats = { total: 10, lent: 3, available: 7, overdue: 1 };
const chartData = { labels: ['Jan', 'Feb', 'Mar'], values: [2, 5, 3] };

export default function DashboardPage() {
  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <DashboardStats stats={stats} />
      <div className="mb-8 w-full">
        <StatisticsChart data={chartData} />
      </div>
    </div>
  );
}
