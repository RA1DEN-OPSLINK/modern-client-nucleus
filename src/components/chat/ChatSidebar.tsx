import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ChatSidebarProps {
  currentUserId: string;
  organizationId: string;
  selectedUserId: string | null;
  onSelectUser: (userId: string) => void;
}

export function ChatSidebar({
  currentUserId,
  organizationId,
  selectedUserId,
  onSelectUser,
}: ChatSidebarProps) {
  const { data: users, isLoading } = useQuery({
    queryKey: ["chat-users", organizationId],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select(`
          id,
          first_name,
          last_name,
          avatar_url,
          user_status (
            status,
            last_active
          )
        `)
        .eq("organization_id", organizationId)
        .neq("id", currentUserId);

      if (error) throw error;
      return profiles;
    },
  });

  // Subscribe to status changes
  useQuery({
    queryKey: ["user-status-subscription"],
    queryFn: async () => {
      const channel = supabase
        .channel("user-status-changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "user_status",
          },
          (payload) => {
            console.log("Status changed:", payload);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    },
  });

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    if (!firstName && !lastName) return "U";
    return `${(firstName?.[0] || "").toUpperCase()}${(
      lastName?.[0] || ""
    ).toUpperCase()}`;
  };

  const getStatusColor = (status?: string | null) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "do_not_disturb":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading users...</div>;
  }

  return (
    <ScrollArea className="h-[calc(100vh-6rem)]">
      <div className="p-4 space-y-4">
        <h2 className="font-semibold">Team Members</h2>
        <div className="space-y-2">
          {users?.map((user) => (
            <Button
              key={user.id}
              variant="ghost"
              className={`w-full justify-start ${
                selectedUserId === user.id ? "bg-accent" : ""
              }`}
              onClick={() => onSelectUser(user.id)}
            >
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar_url || undefined} />
                    <AvatarFallback>
                      {getInitials(user.first_name, user.last_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-white ${getStatusColor(
                      user.user_status?.[0]?.status
                    )}`}
                  />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm">
                    {user.first_name} {user.last_name}
                  </span>
                  {user.user_status?.[0]?.status && (
                    <Badge variant="secondary" className="text-xs">
                      {user.user_status[0].status}
                    </Badge>
                  )}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}