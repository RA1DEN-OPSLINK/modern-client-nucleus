import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function NotificationsMenu() {
  return (
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
  );
}