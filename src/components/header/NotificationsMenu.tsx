import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function NotificationsMenu() {
  const { session } = useSessionContext();

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["notifications-count"],
    queryFn: async () => {
      if (!session?.user?.id) return 0;

      const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", session.user.id)
        .eq("read", false);

      if (error) {
        console.error("Error fetching notifications:", error);
        throw error;
      }

      return count || 0;
    },
    enabled: !!session?.user?.id,
  });

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative hover:bg-accent"
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <Badge 
          variant="secondary" 
          className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
        >
          {unreadCount}
        </Badge>
      )}
    </Button>
  );
}