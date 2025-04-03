
import React from 'react';
import { Bell, HelpCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface NavbarProps {
  title?: string;
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ title = 'Dashboard', className }) => {
  return (
    <div className={cn("flex items-center justify-between h-16 px-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}>
      <h1 className="text-xl font-semibold">{title}</h1>
      
      <div className="flex items-center space-x-4">
        <div className="relative w-64 hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-10 bg-background"
          />
        </div>
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
            3
          </span>
        </Button>
        
        <Button variant="ghost" size="icon">
          <HelpCircle size={20} />
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
