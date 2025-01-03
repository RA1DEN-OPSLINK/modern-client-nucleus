export interface ClientsTable {
  Row: {
    id: string;
    organization_id: string;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    status: string | null;
    created_at: string;
    updated_at: string;
    city: string | null;
    postal_code: string | null;
    country: string | null;
    company_name: string | null;
    company_phone: string | null;
    company_address: string | null;
    company_city: string | null;
    company_postal_code: string | null;
    company_country: string | null;
    billing_address: string | null;
    billing_city: string | null;
    billing_postal_code: string | null;
    billing_country: string | null;
    billing_phone: string | null;
  };
  Insert: {
    id?: string;
    organization_id: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    status?: string | null;
    created_at?: string;
    updated_at?: string;
    city?: string | null;
    postal_code?: string | null;
    country?: string | null;
    company_name?: string | null;
    company_phone?: string | null;
    company_address?: string | null;
    company_city?: string | null;
    company_postal_code?: string | null;
    company_country?: string | null;
    billing_address?: string | null;
    billing_city?: string | null;
    billing_postal_code?: string | null;
    billing_country?: string | null;
    billing_phone?: string | null;
  };
  Update: {
    id?: string;
    organization_id?: string;
    name?: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    status?: string | null;
    created_at?: string;
    updated_at?: string;
    city?: string | null;
    postal_code?: string | null;
    country?: string | null;
    company_name?: string | null;
    company_phone?: string | null;
    company_address?: string | null;
    company_city?: string | null;
    company_postal_code?: string | null;
    company_country?: string | null;
    billing_address?: string | null;
    billing_city?: string | null;
    billing_postal_code?: string | null;
    billing_country?: string | null;
    billing_phone?: string | null;
  };
}