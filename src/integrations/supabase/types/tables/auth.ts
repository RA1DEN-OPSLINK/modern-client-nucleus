export interface AuthTables {
  users: {
    Row: {
      id: string;
      email?: string;
      created_at?: string;
    };
  };
}