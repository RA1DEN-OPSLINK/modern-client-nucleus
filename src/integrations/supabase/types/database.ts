import type { AuthTables } from './tables/auth';
import type { CalendarTables } from './tables/calendar';
import type { ClientsTable } from './tables/clients';
import type { NotificationTables } from './tables/notifications';
import type { OrganizationTables } from './tables/organizations';
import type { ProfilesTable } from './tables/profiles';
import type { ProjectTables } from './tables/projects';
import type { TeamTables } from './tables/teams';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      notifications: NotificationTables['notifications']['Row'];
      clients: ClientsTable['Row'];
      profiles: ProfilesTable['Row'];
      calendar_events: CalendarTables['calendar_events']['Row'];
      organizations: OrganizationTables['organizations']['Row'];
      projects: ProjectTables['projects']['Row'];
      teams: TeamTables['teams']['Row'];
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_user_org_id: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      is_manager_or_tenant: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_tenant: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      user_role: "tenant" | "manager" | "team" | "client";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  auth: AuthTables;
}