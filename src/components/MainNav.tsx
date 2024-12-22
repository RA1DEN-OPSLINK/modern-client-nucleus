import { Link, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  Users, 
  Building2, 
  UserCircle,
} from "lucide-react";
import { 
  SidebarMenu, 
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar
} from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProfilesTable } from "@/integrations/supabase/types/tables";

export const MainNav = () => {
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data as ProfilesTable["Row"];
    },
  });

  const isActive = (path: string) => location.pathname === path;

  // Define navigation items based on roles
  const getNavigationItems = () => {
    const items = [
      // Dashboard is available to all roles
      {
        path: "/",
        label: "Dashboard",
        icon: BarChart3,
        visible: true,
      },
    ];

    // Organization management for tenant only
    if (profile?.role === "tenant") {
      items.push({
        path: "/tenant",
        label: "Organization",
        icon: Building2,
        visible: true,
      });
    }

    // Teams management for tenant and manager
    if (profile?.role === "tenant" || profile?.role === "manager") {
      items.push({
        path: "/teams",
        label: "Teams",
        icon: UserCircle,
        visible: true,
      });
    }

    // Clients management for tenant and manager
    if (profile?.role === "tenant" || profile?.role === "manager") {
      items.push({
        path: "/clients",
        label: "Clients",
        icon: Users,
        visible: true,
      });
    }

    return items;
  };

  const navigationItems = getNavigationItems();

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Overview</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {navigationItems.map((item) => (
              item.visible && (
                <SidebarMenuItem key={item.path}>
                  <Link to={item.path}>
                    <SidebarMenuButton 
                      isActive={isActive(item.path)} 
                      tooltip={isCollapsed ? item.label : undefined}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              )
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
};