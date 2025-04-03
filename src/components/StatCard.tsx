
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  change?: {
    value: number;
    type: 'positive' | 'negative';
  };
  className?: string;
}

const StatCard = ({ title, value, description, icon, change, className }: StatCardProps) => {
  return (
    <Card className={cn("overflow-hidden hover-lift", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || change) && (
          <div className="flex items-center justify-between mt-2">
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
            {change && (
              <div
                className={cn(
                  "text-xs font-medium",
                  change.type === "positive" ? "text-green-500" : "text-red-500"
                )}
              >
                {change.type === "positive" ? "+" : ""}
                {change.value}%
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
