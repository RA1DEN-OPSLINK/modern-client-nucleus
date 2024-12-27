import { Link } from "react-router-dom";
import { MessageSquare, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserMenu } from "./header/UserMenu";
import { NotificationsMenu } from "./header/NotificationsMenu";
import { ThemeToggle } from "./header/ThemeToggle";
import { CreateDialog } from "./CreateDialog";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-end">
        <nav className="flex items-center space-x-4">
          <CreateDialog />
          
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
          <UserMenu />
        </nav>
      </div>
    </header>
  );
}