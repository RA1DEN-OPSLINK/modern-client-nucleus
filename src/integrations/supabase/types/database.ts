import type { AuthTables } from './tables/auth';
import type { CalendarTables } from './tables/calendar';
import type { ClientTables } from './tables/clients';
import type { FileTables } from './tables/files';
import type { NotificationTables } from './tables/notifications';
import type { OrganizationTables } from './tables/organizations';
import type { ProfileTables } from './tables/profiles';
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
    Tables: ClientTables &
           CalendarTables &
           FileTables &
           NotificationTables &
           OrganizationTables &
           ProfileTables &
           ProjectTables &
           TeamTables;
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

export type Tables<
  T extends keyof Database['public']['Tables'],
> = Database['public']['Tables'][T]['Row'];

export type TablesInsert<
  T extends keyof Database['public']['Tables'],
> = Database['public']['Tables'][T]['Insert'];

export type TablesUpdate<
  T extends keyof Database['public']['Tables'],
> = Database['public']['Tables'][T]['Update'];

export type Enums<
  T extends keyof Database['public']['Enums'],
> = Database['public']['Enums'][T];