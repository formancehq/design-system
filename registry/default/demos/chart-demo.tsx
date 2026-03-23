'use client';

import { Bar, BarChart, XAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type TChartConfig,
} from '@/registry/default/ui/chart';

const chartData = [
  { month: 'Jan', value: 186 },
  { month: 'Feb', value: 305 },
  { month: 'Mar', value: 237 },
  { month: 'Apr', value: 73 },
  { month: 'May', value: 209 },
  { month: 'Jun', value: 214 },
];

const chartConfig: TChartConfig = {
  value: { label: 'Transactions', color: 'var(--color-primary)' },
};

export default function ChartDemo() {
  return (
    <div className="w-full max-w-sm">
      <ChartContainer config={chartConfig} className="h-48 w-full">
        <BarChart data={chartData}>
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="value" fill="var(--color-value)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
