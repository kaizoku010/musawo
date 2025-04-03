
import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import Chart from '@/components/Chart';
import StatCard from '@/components/StatCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMockData } from '@/hooks/useMockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChartBig, LineChart, PieChart, TrendingUp } from 'lucide-react';

const Analytics = () => {
  const { stats, isLoading } = useMockData();
  const [timeRange, setTimeRange] = useState('monthly');

  // Generate mock category distribution data
  const categoryData = [
    { name: 'Electronics', value: 38 },
    { name: 'Clothing', value: 24 },
    { name: 'Home', value: 18 },
    { name: 'Books', value: 12 },
    { name: 'Sports', value: 8 },
  ];

  // Generate mock conversion data
  const conversionData = [
    { name: 'Visitors', value: 12500 },
    { name: 'Product Views', value: 8700 },
    { name: 'Add to Cart', value: 4200 },
    { name: 'Purchases', value: 2100 },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <AdminLayout title="Analytics">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Analytics</h2>
            <p className="text-muted-foreground">Detailed analytics and insights</p>
          </div>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Revenue Growth"
            value={isLoading ? "Loading..." : "+24.5%"}
            description="vs. previous period"
            icon={<TrendingUp className="h-4 w-4" />}
            change={{ value: 24.5, type: "positive" }}
          />
          
          <StatCard
            title="Average Order Value"
            value={isLoading ? "Loading..." : "$128.50"}
            description="per transaction"
            icon={<BarChartBig className="h-4 w-4" />}
            change={{ value: 3.2, type: "positive" }}
          />
          
          <StatCard
            title="Conversion Rate"
            value={isLoading ? "Loading..." : "5.2%"}
            description="visitors to customers"
            icon={<LineChart className="h-4 w-4" />}
            change={{ value: 0.8, type: "positive" }}
          />
          
          <StatCard
            title="Customer Retention"
            value={isLoading ? "Loading..." : "82%"}
            description="returning customers"
            icon={<PieChart className="h-4 w-4" />}
            change={{ value: 1.5, type: "positive" }}
          />
        </div>

        {/* Revenue Over Time */}
        <Chart
          title="Revenue Over Time"
          data={stats?.salesByMonth || []}
          xKey="month"
          yKey="sales"
          type="area"
          color="hsl(var(--primary))"
          loading={isLoading}
        />

        {/* Category & Funnel Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
              <CardDescription>Distribution of sales across product categories</CardDescription>
            </CardHeader>
            <CardContent>
              <Chart
                title=""
                data={categoryData}
                xKey="name"
                yKey="value"
                type="bar"
                color="hsl(var(--primary))"
                loading={isLoading}
                height={300}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>Customer journey from visitor to purchase</CardDescription>
            </CardHeader>
            <CardContent>
              <Chart
                title=""
                data={conversionData}
                xKey="name"
                yKey="value"
                type="bar"
                color="hsl(210, 100%, 70%)"
                loading={isLoading}
                height={300}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
