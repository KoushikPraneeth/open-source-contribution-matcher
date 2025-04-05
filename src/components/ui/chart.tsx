
import React from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  ArcElement, 
  RadialLinearScale,
  Title, 
  Tooltip, 
  Legend,
  Filler,
  ScriptableContext,
  ChartData,
  ChartOptions
} from 'react-chartjs-2';

// Register ChartJS components
import {
  Chart as ChartJSChart,
  registerables
} from 'chart.js';

ChartJSChart.register(...registerables);

type ChartProps = {
  data: any;
  height?: number;
  width?: number;
  options?: any;
}

export function BarChart({ data, height = 400, width, options = {} }: ChartProps) {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return (
    <div style={{ height, width: width || '100%' }}>
      <ChartJSChart type="bar" data={data} options={mergedOptions} />
    </div>
  );
}

export function LineChart({ data, height = 400, width, options = {} }: ChartProps) {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return (
    <div style={{ height, width: width || '100%' }}>
      <ChartJSChart type="line" data={data} options={mergedOptions} />
    </div>
  );
}

export function PieChart({ data, height = 400, width, options = {} }: ChartProps) {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return (
    <div style={{ height, width: width || '100%' }}>
      <ChartJSChart type="pie" data={data} options={mergedOptions} />
    </div>
  );
}

export function DoughnutChart({ data, height = 400, width, options = {} }: ChartProps) {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return (
    <div style={{ height, width: width || '100%' }}>
      <ChartJSChart type="doughnut" data={data} options={mergedOptions} />
    </div>
  );
}

export function AreaChart({ data, height = 400, width, options = {} }: ChartProps) {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return (
    <div style={{ height, width: width || '100%' }}>
      <ChartJSChart 
        type="line" 
        data={{
          ...data,
          datasets: data.datasets.map((dataset: any) => ({
            ...dataset,
            fill: dataset.fill !== undefined ? dataset.fill : true,
            tension: dataset.tension !== undefined ? dataset.tension : 0.4,
          }))
        }} 
        options={mergedOptions} 
      />
    </div>
  );
}

export function RadarChart({ data, height = 400, width, options = {} }: ChartProps) {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      r: {
        beginAtZero: true,
      },
    },
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return (
    <div style={{ height, width: width || '100%' }}>
      <ChartJSChart type="radar" data={data} options={mergedOptions} />
    </div>
  );
}
