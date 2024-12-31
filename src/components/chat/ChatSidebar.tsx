import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatUserItem } from "./ChatUserItem";
import { ChatUser } from "@/types/chat";

interface ChatSidebarProps {
  currentUserId: string;
  organizationId: string | null;
  onSelectUser: (userId: string) => void;
  selectedUserId: string | null;
}

export function ChatSidebar({
  currentUserId,
  organizationId,
  onSelectUser,
  selectedUserId,
}: ChatSidebarProps) {
  const { data: users, isLoading } = useQuery({
    queryKey: ["chat-users", organizationId],
    queryFn: async () => {
      if (!organizationId) return [];

      const { data, error } = await supabase
        .from("profiles")
        .select(
          `
          id,
          first_name,
          last_name,
          avatar_url,
          user_status!profiles_id_fkey(
            status,
            last_active
          )
        `
        )
        .eq("organization_id", organizationId)
        .neq("id", currentUserId);

      if (error) throw error;
      return (data || []) as unknown as ChatUser[];
    },
    enabled: !!organizationId,
  });

  if (isLoading) {
    return <div className="p-4">Loading users...</div>;
  }

  if (!users?.length) {
    return <div className="p-4">No users found</div>;
  }

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="space-y-2 p-2">
        {users.map((user) => (
          <ChatUserItem
            key={user.id}
            user={user}
            isSelected={selectedUserId === user.id}
            onClick={() => onSelectUser(user.id)}
          />
        ))}
      </div>
    </ScrollArea>
  );
}