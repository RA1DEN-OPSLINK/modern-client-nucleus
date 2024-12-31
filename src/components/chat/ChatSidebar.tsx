import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  const { data: users, isLoading } = useQuery<ChatUser[]>({
    queryKey: ["chat-users", organizationId],
    queryFn: async () => {
      if (!organizationId) return [];

      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id,
          first_name,
          last_name,
          avatar_url,
          user_status:user_status!left(*)
        `)
        .eq("organization_id", organizationId)
        .neq("id", currentUserId);

      if (error) throw error;
      return (data || []) as ChatUser[];
    },
    enabled: !!organizationId,
  });

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    if (!firstName && !lastName) return "U";
    return `${(firstName?.[0] || "").toUpperCase()}${(
      lastName?.[0] || ""
    ).toUpperCase()}`;
  };

  const getUserStatus = (user: ChatUser) => {
    const status = user.user_status?.[0]?.status || "offline";
    return status;
  };

  if (isLoading) {
    return <div className="p-4">Loading users...</div>;
  }

  if (!users?.length) {
    return <div className="p-4">No users found</div>;
  }

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="space-y-2 p-2">
        {users.map((user) => {
          const status = getUserStatus(user);
          return (
            <button
              key={user.id}
              onClick={() => onSelectUser(user.id)}
              className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                selectedUserId === user.id
                  ? "bg-primary/10"
                  : "hover:bg-muted"
              }`}
            >
              <div className="relative">
                <Avatar>
                  <AvatarImage
                    src={user.avatar_url || undefined}
                    alt={`${user.first_name} ${user.last_name}`}
                  />
                  <AvatarFallback>
                    {getInitials(user.first_name, user.last_name)}
                  </AvatarFallback>
                </Avatar>
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${
                    status === "online"
                      ? "bg-green-500"
                      : status === "away"
                      ? "bg-yellow-500"
                      : "bg-gray-500"
                  }`}
                />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium">
                  {user.first_name} {user.last_name}
                </div>
                <div className="text-xs text-muted-foreground capitalize">
                  {status}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );
}