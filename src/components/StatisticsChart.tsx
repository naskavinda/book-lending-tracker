"use client";
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function StatisticsChart({ data }: { data: { labels: string[], values: number[] } }) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Lending Stats',
        data: data.values,
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Lending Statistics' },
    },
  };
  return (
    <div className="w-full max-w-full overflow-hidden">
      <Bar data={chartData} options={options} />
    </div>
  );
}
