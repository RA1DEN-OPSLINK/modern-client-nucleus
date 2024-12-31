export interface ChatMessage {
  id: string;
  sender_id: string;
  organization_id: string;
  content: string;
  attachment_path: string | null;
  attachment_type: string | null;
  created_at: string;
  updated_at: string;
  sender?: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
}

export interface UserStatus {
  status: string | null;
  last_active: string;
}

export interface ChatUser {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  user_status: UserStatus[];
}