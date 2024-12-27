import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { Bell, MessageSquare, Moon, Sun, Folder, User, LogOut, Settings, ChevronDown } from "lucide-react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function Header() {
  const { setTheme } = useTheme();
  const { session } = useSessionContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
      });
    }
  };

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    if (!firstName && !lastName) return 'U';
    return `${(firstName?.[0] || '').toUpperCase()}${(lastName?.[0] || '').toUpperCase()}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <span className="hidden font-bold sm:inline-block text-xl">App</span>
        </Link>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search component placeholder */}
          </div>
          <nav className="flex items-center space-x-4">
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
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  3
                </Badge>
              </Link>
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-accent"
            >
              <Bell className="h-5 w-5" />
              <Badge 
                variant="secondary" 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                2
              </Badge>
            </Button>
            
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
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="hover:bg-accent"
                >
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem 
                  onClick={() => setTheme("light")}
                  className="cursor-pointer"
                >
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setTheme("dark")}
                  className="cursor-pointer"
                >
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setTheme("system")}
                  className="cursor-pointer"
                >
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {session && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-8 flex items-center space-x-2 hover:bg-accent rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={profile?.avatar_url || undefined} 
                        alt={profile?.first_name || 'User'} 
                      />
                      <AvatarFallback>
                        {getInitials(profile?.first_name, profile?.last_name)}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {profile?.first_name} {profile?.last_name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer flex items-center"
                    onClick={() => navigate('/profile')}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer flex items-center"
                    onClick={() => navigate('/settings')}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer flex items-center text-red-600 focus:text-red-600"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}