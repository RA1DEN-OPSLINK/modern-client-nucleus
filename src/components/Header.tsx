import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { Bell, MessageSquare, Moon, Sun, Folder } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export function Header() {
  const { setTheme } = useTheme();

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
          </nav>
        </div>
      </div>
    </header>
  );
}