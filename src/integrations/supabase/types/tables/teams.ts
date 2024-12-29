export interface TeamTables {
  teams: {
    Row: {
      id: string;
      organization_id: string;
      name: string;
      description: string | null;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      organization_id: string;
      name: string;
      description?: string | null;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      organization_id?: string;
      name?: string;
      description?: string | null;
      created_at?: string;
      updated_at?: string;
    };
  };
  team_members: {
    Row: {
      id: string;
      team_id: string;
      profile_id: string;
      created_at: string;
    };
    Insert: {
      id?: string;
      team_id: string;
      profile_id: string;
      created_at?: string;
    };
    Update: {
      id?: string;
      team_id?: string;
      profile_id?: string;
      created_at?: string;
    };
  };
}