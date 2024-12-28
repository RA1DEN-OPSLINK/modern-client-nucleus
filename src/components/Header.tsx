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
      <div className="container flex h-14 max-w-full items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {/* Left side empty now */}
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