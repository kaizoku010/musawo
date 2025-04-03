
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  BarChartBig,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SidebarProps {
  className?: string;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  title: string;
  href: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon, title, href, active = false, collapsed = false, onClick }: SidebarItemProps) => (
  <Link to={href} onClick={onClick}>
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-x-2 my-1",
        active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
      )}
    >
      {icon}
      {!collapsed && <span>{title}</span>}
    </Button>
  </Link>
);

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigationItems = [
    {
      icon: <LayoutDashboard size={20} />,
      title: 'Dashboard',
      href: '/dashboard',
    },
    {
      icon: <ShoppingBag size={20} />,
      title: 'Products',
      href: '/products',
    },
    {
      icon: <Users size={20} />,
      title: 'Users',
      href: '/users',
    },
    {
      icon: <BarChartBig size={20} />,
      title: 'Analytics',
      href: '/analytics',
    },
    {
      icon: <Settings size={20} />,
      title: 'Settings',
      href: '/settings',
    },
  ];

  return (
    <aside
      className={cn(
        "relative h-screen bg-sidebar flex flex-col border-r transition-all duration-300 ease-in-out",
        collapsed ? "w-[80px]" : "w-[250px]",
        className
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          {!collapsed && (
            <div className="font-semibold text-xl text-sidebar-foreground">Admin Panel</div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-3 top-16 rounded-full h-6 w-6 bg-sidebar-primary text-sidebar-primary-foreground border border-sidebar-border shadow-md"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
          </Button>
        </div>

        <div className="p-3 flex-1 overflow-y-auto">
          <nav className="space-y-1">
            {navigationItems.map((item) => (
              <SidebarItem
                key={item.href}
                icon={item.icon}
                title={item.title}
                href={item.href}
                active={location.pathname === item.href}
                collapsed={collapsed}
              />
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-sidebar-border">
          <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-between")}>
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-sidebar-foreground">{user?.name}</span>
                  <span className="text-xs text-sidebar-foreground/60">{user?.email}</span>
                </div>
              )}
            </div>
            {!collapsed && (
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut size={18} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
