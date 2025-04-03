
import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import StatCard from '@/components/StatCard';
import Chart from '@/components/Chart';
import { DataTable } from '@/components/DataTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMockData } from '@/hooks/useMockData';
import { formatDistanceToNow } from 'date-fns';
import { DollarSign, Users, ShoppingBag, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { stats, isLoading } = useMockData();

  // Sale table columns
  const columns = [
    {
      header: 'Product',
      accessorKey: 'productName' as const,
    },
    {
      header: 'Customer',
      accessorKey: 'customerName' as const,
    },
    {
      header: 'Date',
      accessorKey: 'date' as const,
      cell: (sale: { date: Date }) => (
        <span>{formatDistanceToNow(new Date(sale.date), { addSuffix: true })}</span>
      ),
    },
    {
      header: 'Amount',
      accessorKey: 'amount' as const,
      cell: (sale: { amount: number }) => (
        <span className="font-medium">
          ${sale.amount.toLocaleString()}
        </span>
      ),
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={isLoading ? "Loading..." : formatCurrency(stats?.totalRevenue || 0)}
            description="Last 30 days"
            icon={<DollarSign className="h-4 w-4" />}
            change={{ value: 12.5, type: "positive" }}
          />
          
          <StatCard
            title="Total Sales"
            value={isLoading ? "Loading..." : stats?.totalSales.toString() || "0"}
            description="Last 30 days"
            icon={<TrendingUp className="h-4 w-4" />}
            change={{ value: 8.2, type: "positive" }}
          />
          
          <StatCard
            title="Active Users"
            value={isLoading ? "Loading..." : stats?.totalUsers.toString() || "0"}
            description="Total registered users"
            icon={<Users className="h-4 w-4" />}
            change={{ value: 5.1, type: "positive" }}
          />
          
          <StatCard
            title="Products"
            value={isLoading ? "Loading..." : stats?.totalProducts.toString() || "0"}
            description="Total available products"
            icon={<ShoppingBag className="h-4 w-4" />}
            change={{ value: 2.3, type: "positive" }}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Chart
              title="Revenue Overview"
              data={stats?.salesByMonth || []}
              xKey="month"
              yKey="sales"
              type="area"
              color="hsl(var(--primary))"
              loading={isLoading}
            />
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>Best selling products this month</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between animate-pulse">
                        <div className="w-32 h-4 bg-muted rounded" />
                        <div className="w-16 h-4 bg-muted rounded" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {stats?.topProducts.map((product, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm font-medium truncate max-w-[180px]">
                          {product.name}
                        </span>
                        <span className="text-sm font-medium">
                          {formatCurrency(product.sales)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Sales */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>Latest transactions across your store</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              data={stats?.recentSales || []}
              columns={columns}
              loading={isLoading}
              pagination={false}
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;

