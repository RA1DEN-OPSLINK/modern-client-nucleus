import { Link, useLocation } from "react-router-dom";
import { BarChart3, Users, MapPin, FileText, UserCircle } from "lucide-react";
import { SidebarMenu, SidebarMenuButton } from "@/components/ui/sidebar";

export const MainNav = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <SidebarMenu>
      <Link to="/">
        <SidebarMenuButton isActive={isActive("/")} tooltip="Dashboard">
          <BarChart3 />
          <span>Dashboard</span>
        </SidebarMenuButton>
      </Link>
      <Link to="/clients">
        <SidebarMenuButton isActive={isActive("/clients")} tooltip="Clients">
          <Users />
          <span>Clients</span>
        </SidebarMenuButton>
      </Link>
      <Link to="/teams">
        <SidebarMenuButton isActive={isActive("/teams")} tooltip="Teams">
          <UserCircle />
          <span>Teams</span>
        </SidebarMenuButton>
      </Link>
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