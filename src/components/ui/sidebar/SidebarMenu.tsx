import { Link, useLocation } from 'react-router-dom';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useQuery } from '@tanstack/react-query';
import { menuItems } from './menu-items';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

export const SidebarMenu = () => {
  const location = useLocation();
  const { session } = useSessionContext();
  
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const userRole = profile?.role || 'team';

  return (
    <nav className="mt-4 px-2">
      {menuItems
        .filter(item => item.roles.includes(userRole as any))
        .map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-4 py-3 text-sidebar-foreground rounded-md",
                "transition-all duration-200 ease-in-out",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                "group relative overflow-hidden",
                isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              )}
            >
              {/* Hover effect background */}
              <div className="absolute inset-0 bg-sidebar-accent/0 transition-colors duration-200 group-hover:bg-sidebar-accent/10" />
              
              {/* Active indicator */}
              <div className={cn(
                "absolute left-0 top-0 bottom-0 w-1 bg-primary transform transition-transform duration-200",
                isActive ? "translate-x-0" : "-translate-x-full"
              )} />
              
              {/* Icon */}
              <span className="relative inline-flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                <Icon className="h-5 w-5" />
              </span>
              
              {/* Text */}
              <span className="relative ml-3 text-sm font-medium transition-transform duration-200 group-hover:translate-x-1">
                {item.title}
              </span>
            </Link>
          );
        })}
    </nav>
  );
};