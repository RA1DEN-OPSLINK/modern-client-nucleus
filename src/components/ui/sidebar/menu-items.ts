import { IconProps } from "@/types/icon-props";
import { Users, MessageSquare, Folder, Map, Settings, Calendar, Building2 } from "lucide-react";

export type MenuItem = {
  title: string;
  path: string;
  icon: React.ComponentType<IconProps>;
  roles: Array<'tenant' | 'manager' | 'team'>;
};

export const menuItems: MenuItem[] = [
  {
    title: "Teams",
    path: "/teams",
    icon: Users,
    roles: ['tenant', 'manager', 'team']
  },
  {
    title: "Chat",
    path: "/chat",
    icon: MessageSquare,
    roles: ['tenant', 'manager', 'team']
  },
  {
    title: "Files",
    path: "/files",
    icon: Folder,
    roles: ['tenant', 'manager', 'team']
  },
  {
    title: "Calendar",
    path: "/calendar",
    icon: Calendar,
    roles: ['tenant', 'manager', 'team']
  },
  {
    title: "Map",
    path: "/map",
    icon: Map,
    roles: ['tenant', 'manager', 'team']
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
    roles: ['tenant', 'manager', 'team']
  }
];