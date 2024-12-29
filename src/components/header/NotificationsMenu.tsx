import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";

export function NotificationsMenu() {
  const { session } = useSessionContext();

  const { data: notificationCount = 0 } = useQuery({
    queryKey: ["notifications", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return 0;
      
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id)
        .eq('read', false);

      if (error) {
        console.error("Error fetching notifications:", error);
        return 0;
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
      {notificationCount > 0 && (
        <Badge 
          variant="secondary" 
          className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
        >
          {notificationCount}
        </Badge>
      )}
    </Button>
  );
}