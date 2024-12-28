import { Link, useLocation } from 'react-router-dom';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useQuery } from '@tanstack/react-query';
import { menuSections } from './menu-items';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu as Menu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';

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
    <div className="flex flex-col gap-6 px-2">
      {menuSections.map((section, index) => {
        const filteredItems = section.items.filter(item => 
          item.roles.includes(userRole as any)
        );

        if (filteredItems.length === 0) return null;

        return (
          <SidebarGroup key={index}>
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground">
              {section.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <Menu>
                {filteredItems.map(item => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                      >
                        <Link to={item.path}>
                          <Icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </Menu>
            </SidebarGroupContent>
          </SidebarGroup>
        );
      })}
    </div>
  );
};