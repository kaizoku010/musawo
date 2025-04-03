
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, LineChart, Line } from 'recharts';
import { cn } from '@/lib/utils';

type ChartType = 'area' | 'bar' | 'line';

interface ChartProps {
  title: string;
  data: any[];
  type?: ChartType;
  xKey: string;
  yKey: string;
  color?: string;
  className?: string;
  height?: number;
  loading?: boolean;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass p-2 rounded-lg border border-border shadow-sm">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-primary font-semibold">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }

  return null;
};

const Chart: React.FC<ChartProps> = ({
  title,
  data,
  type = 'area',
  xKey,
  yKey,
  color = 'var(--color-primary)',
  className,
  height = 350,
  loading = false,
}) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-[350px] animate-pulse">
            <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={height}>
            {type === 'area' ? (
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                <XAxis 
                  dataKey={xKey} 
                  tick={{ fill: "var(--muted-foreground)" }}
                  axisLine={{ stroke: "var(--border)" }}
                />
                <YAxis 
                  tick={{ fill: "var(--muted-foreground)" }}
                  axisLine={{ stroke: "var(--border)" }}
                  tickFormatter={(value) => `$${value/1000}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey={yKey}
                  stroke={color}
                  fillOpacity={1}
                  fill="url(#colorGradient)"
                />
              </AreaChart>
            ) : type === 'bar' ? (
              <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                <XAxis 
                  dataKey={xKey} 
                  tick={{ fill: "var(--muted-foreground)" }}
                  axisLine={{ stroke: "var(--border)" }}
                />
                <YAxis 
                  tick={{ fill: "var(--muted-foreground)" }}
                  axisLine={{ stroke: "var(--border)" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey={yKey} fill={color} radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                <XAxis 
                  dataKey={xKey} 
                  tick={{ fill: "var(--muted-foreground)" }}
                  axisLine={{ stroke: "var(--border)" }}
                />
                <YAxis 
                  tick={{ fill: "var(--muted-foreground)" }}
                  axisLine={{ stroke: "var(--border)" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey={yKey} stroke={color} strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default Chart;
