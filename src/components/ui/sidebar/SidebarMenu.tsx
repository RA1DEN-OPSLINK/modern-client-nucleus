import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useQuery } from '@tanstack/react-query';
import { Icons } from './icons';
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
    <nav className="mt-4">
      {menuItems
        .filter(item => item.roles.includes(userRole))
        .map(item => {
          const Icon = Icons[item.icon];
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-4 py-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
                location.pathname === item.path && "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
            >
              <span className="inline-flex items-center justify-center">
                <Icon />
              </span>
              <span className="ml-3 text-sm font-medium">{item.title}</span>
            </Link>
          );
        })}
    </nav>
  );
};