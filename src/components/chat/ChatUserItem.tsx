import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatUser } from "@/types/chat";

interface ChatUserItemProps {
  user: ChatUser;
  isSelected: boolean;
  onClick: () => void;
}

export function ChatUserItem({ user, isSelected, onClick }: ChatUserItemProps) {
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

  const status = getUserStatus(user);

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-colors ${
        isSelected ? "bg-primary/10" : "hover:bg-muted"
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
        <div className="text-xs text-muted-foreground capitalize">{status}</div>
      </div>
    </button>
  );
}