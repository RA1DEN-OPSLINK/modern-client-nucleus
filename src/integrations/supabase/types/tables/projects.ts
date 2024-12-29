export interface ProjectTables {
  projects: {
    Row: {
      id: string;
      organization_id: string;
      name: string;
      description: string | null;
      status: string | null;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      organization_id: string;
      name: string;
      description?: string | null;
      status?: string | null;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      organization_id?: string;
      name?: string;
      description?: string | null;
      status?: string | null;
      created_at?: string;
      updated_at?: string;
    };
  };
}