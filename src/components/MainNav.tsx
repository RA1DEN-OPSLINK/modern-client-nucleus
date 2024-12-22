import { Link, useLocation } from "react-router-dom";
import { BarChart3, Users, MapPin, FileText, UserCircle } from "lucide-react";
import { SidebarMenu, SidebarMenuButton } from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProfilesTable } from "@/integrations/supabase/types/tables";

export const MainNav = () => {
  const location = useLocation();

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

  const canManageTeams = profile?.role === "tenant" || profile?.role === "manager";
  const canManageClients = profile?.role === "tenant" || profile?.role === "manager";

  return (
    <SidebarMenu>
      <Link to="/">
        <SidebarMenuButton isActive={isActive("/")} tooltip="Dashboard">
          <BarChart3 />
          <span>Dashboard</span>
        </SidebarMenuButton>
      </Link>
      {canManageClients && (
        <Link to="/clients">
          <SidebarMenuButton isActive={isActive("/clients")} tooltip="Clients">
            <Users />
            <span>Clients</span>
          </SidebarMenuButton>
        </Link>
      )}
      {canManageTeams && (
        <Link to="/teams">
          <SidebarMenuButton isActive={isActive("/teams")} tooltip="Teams">
            <UserCircle />
            <span>Teams</span>
          </SidebarMenuButton>
        </Link>
      )}
      <Link to="/maps">
        <SidebarMenuButton isActive={isActive("/maps")} tooltip="Maps">
          <MapPin />
          <span>Maps</span>
        </SidebarMenuButton>
      </Link>
      <Link to="/reports">
        <SidebarMenuButton isActive={isActive("/reports")} tooltip="Reports">
          <FileText />
          <span>Reports</span>
        </SidebarMenuButton>
      </Link>
    </SidebarMenu>
  );
};