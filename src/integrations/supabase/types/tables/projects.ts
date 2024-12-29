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
  jobs: {
    Row: {
      id: string;
      organization_id: string;
      project_id: string | null;
      title: string;
      description: string | null;
      status: string | null;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      organization_id: string;
      project_id?: string | null;
      title: string;
      description?: string | null;
      status?: string | null;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      organization_id?: string;
      project_id?: string | null;
      title?: string;
      description?: string | null;
      status?: string | null;
      created_at?: string;
      updated_at?: string;
    };
  };
  tasks: {
    Row: {
      id: string;
      organization_id: string;
      job_id: string | null;
      title: string;
      description: string | null;
      status: string | null;
      due_date: string | null;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      organization_id: string;
      job_id?: string | null;
      title: string;
      description?: string | null;
      status?: string | null;
      due_date?: string | null;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      organization_id?: string;
      job_id?: string | null;
      title?: string;
      description?: string | null;
      status?: string | null;
      due_date?: string | null;
      created_at?: string;
      updated_at?: string;
    };
  };
}