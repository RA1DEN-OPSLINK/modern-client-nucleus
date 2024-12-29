export interface NotificationTables {
  notifications: {
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
    Relationships: [
      {
        foreignKeyName: "notifications_user_id_fkey";
        columns: ["user_id"];
        isOneToOne: false;
        referencedRelation: "users";
        referencedColumns: ["id"];
      }
    ];
  };
}