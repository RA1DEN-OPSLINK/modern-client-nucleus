import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatMessage } from "@/types/chat";

interface ChatMessageItemProps {
  message: ChatMessage;
  currentUserId: string;
}

export function ChatMessageItem({ message, currentUserId }: ChatMessageItemProps) {
  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    if (!firstName && !lastName) return "U";
    return `${(firstName?.[0] || "").toUpperCase()}${(
      lastName?.[0] || ""
    ).toUpperCase()}`;
  };

  return (
    <div
      className={`flex items-start space-x-2 mb-4 ${
        message.sender_id === currentUserId
          ? "flex-row-reverse space-x-reverse"
          : ""
      }`}
    >
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage
          src={message.sender?.avatar_url || undefined}
          alt={`${message.sender?.first_name} ${message.sender?.last_name}`}
        />
        <AvatarFallback>
          {getInitials(message.sender?.first_name, message.sender?.last_name)}
        </AvatarFallback>
      </Avatar>
      <div
        className={`flex flex-col ${
          message.sender_id === currentUserId ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`rounded-lg p-3 ${
            message.sender_id === currentUserId
              ? "bg-primary text-primary-foreground"
              : "bg-muted"
          }`}
        >
          <p className="text-sm">{message.content}</p>
          {message.attachment_path && (
            <div className="mt-2">
              <a
                href={`${
                  supabase.storage
                    .from("chat-attachments")
                    .getPublicUrl(message.attachment_path).data.publicUrl
                }`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs underline"
              >
                View attachment
              </a>
            </div>
          )}
        </div>
        <span className="text-xs text-muted-foreground mt-1">
          {format(new Date(message.created_at), "p")}
        </span>
      </div>
    </div>
  );
}