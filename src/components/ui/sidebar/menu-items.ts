import { IconProps } from "@/types/icon-props";
import { 
  Users, 
  MessageSquare, 
  Folder, 
  Map, 
  Settings, 
  Calendar,
  Building2,
  Home,
  User,
  Globe,
  UserCircle,
  Plus,
  FileText,
  Briefcase,
  CheckSquare
} from "lucide-react";

export type MenuSection = {
  label: string;
  items: MenuItem[];
};

export type MenuItem = {
  title: string;
  path: string;
  icon: React.ComponentType<IconProps>;
  roles: Array<'tenant' | 'manager' | 'team'>;
};

export const menuSections: MenuSection[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        path: "/",
        icon: Home,
        roles: ['tenant', 'manager', 'team']
      }
    ]
  },
  {
    label: "Create",
    items: [
      {
        title: "Create Project",
        path: "/create/project",
        icon: FileText,
        roles: ['tenant', 'manager', 'team']
      },
      {
        title: "Create Job",
        path: "/create/job",
        icon: Briefcase,
        roles: ['tenant', 'manager', 'team']
      },
      {
        title: "Create Task",
        path: "/create/task",
        icon: CheckSquare,
        roles: ['tenant', 'manager', 'team']
      }
    ]
  },
  {
    label: "Workspace",
    items: [
      {
        title: "Teams",
        path: "/teams",
        icon: Users,
        roles: ['tenant', 'manager', 'team']
      },
      {
        title: "My Profile",
        path: "/profile",
        icon: User,
        roles: ['tenant', 'manager', 'team']
      },
      {
        title: "Files",
        path: "/files",
        icon: Folder,
        roles: ['tenant', 'manager', 'team']
      }
    ]
  },
  {
    label: "Clients",
    items: [
      {
        title: "Clients",
        path: "/clients",
        icon: UserCircle,
        roles: ['tenant', 'manager', 'team']
      },
      {
        title: "Clients Portal",
        path: "/clients-portal",
        icon: Globe,
        roles: ['tenant', 'manager', 'team']
      }
    ]
  },
  {
    label: "Tools",
    items: [
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
      }
    ]
  },
  {
    label: "Management",
    items: [
      {
        title: "Settings",
        path: "/settings",
        icon: Settings,
        roles: ['tenant', 'manager', 'team']
      }
    ]
  }
];