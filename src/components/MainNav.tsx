import { Link, useLocation } from "react-router-dom";
import { BarChart3, Users, Building2, UserCircle, ChevronRight } from "lucide-react";
import { 
  SidebarMenu, 
  SidebarMenuButton,
  SidebarTrigger,
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

  const isTenant = profile?.role === "tenant";
  const canManageTeams = profile?.role === "tenant" || profile?.role === "manager";
  const canManageClients = profile?.role === "tenant" || profile?.role === "manager";

  return (
    <SidebarMenu>
      <Link to="/">
        <SidebarMenuButton 
          isActive={isActive("/")} 
          tooltip={isCollapsed ? "Dashboard" : undefined}
        >
          <BarChart3 className="h-4 w-4" />
          <span>Dashboard</span>
        </SidebarMenuButton>
      </Link>

      {isTenant && (
        <Link to="/tenant">
          <SidebarMenuButton 
            isActive={isActive("/tenant")} 
            tooltip={isCollapsed ? "Organization" : undefined}
          >
            <Building2 className="h-4 w-4" />
            <span>Organization</span>
          </SidebarMenuButton>
        </Link>
      )}

      {canManageClients && (
        <Link to="/clients">
          <SidebarMenuButton 
            isActive={isActive("/clients")} 
            tooltip={isCollapsed ? "Clients" : undefined}
          >
            <Users className="h-4 w-4" />
            <span>Clients</span>
          </SidebarMenuButton>
        </Link>
      )}

      {canManageTeams && (
        <Link to="/teams">
          <SidebarMenuButton 
            isActive={isActive("/teams")} 
            tooltip={isCollapsed ? "Teams" : undefined}
          >
            <UserCircle className="h-4 w-4" />
            <span>Teams</span>
          </SidebarMenuButton>
        </Link>
      )}
    </SidebarMenu>
  );
};