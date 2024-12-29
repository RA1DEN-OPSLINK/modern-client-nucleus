export interface FileTables {
  files: {
    Row: {
      id: string;
      name: string;
      folder_id: string | null;
      organization_id: string;
      storage_path: string;
      size: number | null;
      mime_type: string | null;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      name: string;
      folder_id?: string | null;
      organization_id: string;
      storage_path: string;
      size?: number | null;
      mime_type?: string | null;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      name?: string;
      folder_id?: string | null;
      organization_id?: string;
      storage_path?: string;
      size?: number | null;
      mime_type?: string | null;
      created_at?: string;
      updated_at?: string;
    };
  };
  folders: {
    Row: {
      id: string;
      name: string;
      parent_id: string | null;
      organization_id: string;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      name: string;
      parent_id?: string | null;
      organization_id: string;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      name?: string;
      parent_id?: string | null;
      organization_id?: string;
      created_at?: string;
      updated_at?: string;
    };
  };
}