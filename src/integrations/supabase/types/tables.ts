export interface ClientsTable {
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
}

export interface OrganizationsTable {
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
}

export interface PermissionsTable {
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
}

export interface ProfilesTable {
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
    id?: string;
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
}

export interface RolePermissionsTable {
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
}

export interface TeamMembersTable {
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
}

export interface TeamsTable {
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
}

export interface NotificationsTable {
  Row: {
    id: string;
    user_id: string;
    title: string;
    message: string;
    read: boolean | null;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    user_id: string;
    title: string;
    message: string;
    read?: boolean | null;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    user_id?: string;
    title?: string;
    message?: string;
    read?: boolean | null;
    created_at?: string;
    updated_at?: string;
  };
}