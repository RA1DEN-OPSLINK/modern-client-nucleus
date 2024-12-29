export interface OrganizationTables {
  organizations: {
    Row: {
      id: string;
      name: string;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      name: string;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      name?: string;
      created_at?: string;
      updated_at?: string;
    };
  };
}