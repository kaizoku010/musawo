
import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { DataTable } from '@/components/DataTable';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useMockData, User } from '@/hooks/useMockData';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Users = () => {
  const { users, isLoading } = useMockData();

  const columns = [
    {
      header: 'User',
      accessorKey: 'name' as const,
      cell: (user: User) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={`https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=random`} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status' as const,
      cell: (user: User) => (
        <Badge variant={user.status === 'active' ? 'default' : 'outline'}>
          {user.status === 'active' ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      header: 'Joined',
      accessorKey: 'joinDate' as const,
      cell: (user: User) => (
        <span>{format(new Date(user.joinDate), 'MMM d, yyyy')}</span>
      ),
    },
    {
      header: 'Orders',
      accessorKey: 'orders' as const,
    },
    {
      header: 'Spent',
      accessorKey: 'spent' as const,
      cell: (user: User) => (
        <span className="font-medium">${user.spent.toLocaleString()}</span>
      ),
    },
  ];

  return (
    <AdminLayout title="Users">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Users</h2>
          <p className="text-muted-foreground">Manage your users and customers</p>
        </div>

        <Card>
          <CardContent className="p-6">
    
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Users;
