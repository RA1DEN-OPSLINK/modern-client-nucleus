export interface ProfilesTable {
  Row: {
    id: string;
    organization_id: string | null;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
    role: 'tenant' | 'manager' | 'team' | 'client';
    postal_code: string | null;
    phone: string | null;
    city: string | null;
    country: string | null;
    address: string | null;
  };
  Insert: {
    id: string;
    organization_id?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    avatar_url?: string | null;
    created_at?: string;
    updated_at?: string;
    role?: 'tenant' | 'manager' | 'team' | 'client';
    postal_code?: string | null;
    phone?: string | null;
    city?: string | null;
    country?: string | null;
    address?: string | null;
  };
  Update: {
    id?: string;
    organization_id?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    avatar_url?: string | null;
    created_at?: string;
    updated_at?: string;
    role?: 'tenant' | 'manager' | 'team' | 'client';
    postal_code?: string | null;
    phone?: string | null;
    city?: string | null;
    country?: string | null;
    address?: string | null;
  };
}