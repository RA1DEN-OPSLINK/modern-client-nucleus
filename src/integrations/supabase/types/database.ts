import type { AuthTables } from './tables/auth';
import type { CalendarTables } from './tables/calendar';
import type { NotificationTables } from './tables/notifications';

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
      clients: {
        Row: {
          address: string | null;
          created_at: string;
          email: string | null;
          id: string;
          name: string;
          organization_id: string;
          phone: string | null;
          status: string | null;
          updated_at: string;
        };
        Insert: {
          address?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          name: string;
          organization_id: string;
          phone?: string | null;
          status?: string | null;
          updated_at?: string;
        };
        Update: {
          address?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          name?: string;
          organization_id?: string;
          phone?: string | null;
          status?: string | null;
          updated_at?: string;
        };
      };
      organizations: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          updated_at?: string;
        };
      };
      permissions: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
        };
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          first_name: string | null;
          id: string;
          last_name: string | null;
          organization_id: string | null;
          role: 'tenant' | 'manager' | 'team' | 'client';
          updated_at: string;
          postal_code: string | null;
          phone: string | null;
          city: string | null;
          country: string | null;
          address: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          first_name?: string | null;
          id: string;
          last_name?: string | null;
          organization_id?: string | null;
          role?: 'tenant' | 'manager' | 'team' | 'client';
          updated_at?: string;
          postal_code?: string | null;
          phone?: string | null;
          city?: string | null;
          country?: string | null;
          address?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          first_name?: string | null;
          id: string;
          last_name?: string | null;
          organization_id?: string | null;
          role?: 'tenant' | 'manager' | 'team' | 'client';
          updated_at?: string;
          postal_code?: string | null;
          phone?: string | null;
          city?: string | null;
          country?: string | null;
          address?: string | null;
        };
      };
      role_permissions: {
        Row: {
          created_at: string;
          permission_id: string;
          role: string;
        };
        Insert: {
          created_at?: string;
          permission_id: string;
          role: string;
        };
        Update: {
          created_at?: string;
          permission_id?: string;
          role?: string;
        };
      };
      team_members: {
        Row: {
          created_at: string;
          id: string;
          profile_id: string;
          team_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          profile_id: string;
          team_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          profile_id?: string;
          team_id?: string;
        };
      };
      teams: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          name: string;
          organization_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name: string;
          organization_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
          organization_id?: string;
          updated_at?: string;
        };
      };
    } & NotificationTables & CalendarTables;
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  auth: AuthTables;
}
