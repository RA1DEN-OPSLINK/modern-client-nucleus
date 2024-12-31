export interface ChatMessage {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  attachment_path?: string;
  attachment_type?: string;
  sender?: {
    first_name?: string | null;
    last_name?: string | null;
    avatar_url?: string | null;
  };
}

export interface UserStatus {
  status: 'online' | 'offline' | 'away' | 'do_not_disturb';
  last_active: string;
}

export interface ChatUser {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  user_status?: UserStatus[];
}