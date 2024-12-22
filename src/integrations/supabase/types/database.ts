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
      clients: ClientsTable;
      organizations: OrganizationsTable;
      permissions: PermissionsTable;
      profiles: ProfilesTable;
      role_permissions: RolePermissionsTable;
      team_members: TeamMembersTable;
      teams: TeamsTable;
    };
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
}