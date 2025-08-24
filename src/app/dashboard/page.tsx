"use client";
import { useEffect, useState } from 'react';
import DashboardStats from '@/components/DashboardStats';
import StatisticsChart from '@/components/StatisticsChart';

export default function DashboardPage() {
  const [stats, setStats] = useState({ total: 0, lent: 0, available: 0, overdue: 0 });
  const [chartData, setChartData] = useState({ labels: ['Jan', 'Feb', 'Mar'], values: [0, 0, 0] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data.books);
        setChartData(data.data.chartData);
      } else {
        console.error('Failed to fetch dashboard data:', data.error);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-full overflow-x-hidden p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

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
