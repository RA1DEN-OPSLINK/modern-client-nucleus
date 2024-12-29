import { Link } from "react-router-dom";
import { MessageSquare, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserMenu } from "./header/UserMenu";
import { NotificationsMenu } from "./header/NotificationsMenu";
import { ThemeToggle } from "./header/ThemeToggle";
import { CreateDialog } from "./CreateDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";

export function Header() {
  const { session } = useSessionContext();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const welcomeMessage = profile 
    ? `Welcome, ${profile.first_name || 'User'}`
    : "Welcome";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-full items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            {welcomeMessage}
          </span>
        </div>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-accent"
            asChild
          >
            <Link to="/chat">
              <MessageSquare className="h-5 w-5" />
              <Badge 
                variant="secondary" 
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
              >
                3
              </Badge>
            </Link>
          </Button>
          
          <NotificationsMenu />
          
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-accent"
            asChild
          >
            <Link to="/files">
              <Folder className="h-5 w-5" />
            </Link>
          </Button>
          
          <ThemeToggle />
          
          <CreateDialog />
          
          <div className="ml-2">
            <UserMenu />
          </div>
        </nav>
      </div>
    </header>
  );
}