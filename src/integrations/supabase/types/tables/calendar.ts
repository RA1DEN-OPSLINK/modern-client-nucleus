export interface CalendarTables {
  calendar_events: {
    Row: {
      id: string;
      organization_id: string;
      title: string;
      description: string | null;
      start_time: string;
      end_time: string;
      all_day: boolean | null;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      organization_id: string;
      title: string;
      description?: string | null;
      start_time: string;
      end_time: string;
      all_day?: boolean | null;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      organization_id?: string;
      title?: string;
      description?: string | null;
      start_time?: string;
      end_time?: string;
      all_day?: boolean | null;
      created_at?: string;
      updated_at?: string;
    };
  };
}