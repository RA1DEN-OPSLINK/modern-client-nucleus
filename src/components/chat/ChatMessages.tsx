import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { ChatMessage } from "@/types/chat";

interface ChatMessagesProps {
  currentUserId: string;
  selectedUserId: string;
  organizationId: string;
}

export function ChatMessages({
  currentUserId,
  selectedUserId,
  organizationId,
}: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["chat-messages", selectedUserId],
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      const startRange = pageParam * 50;
      const endRange = startRange + 49;

      const { data: messages, error } = await supabase
        .from("messages")
        .select(`
          *,
          sender:profiles(
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq("organization_id", organizationId)
        .or(`sender_id.eq.${currentUserId},sender_id.eq.${selectedUserId}`)
        .order("created_at", { ascending: false })
        .range(startRange, endRange);

      if (error) throw error;
      return messages as unknown as ChatMessage[];
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 50 ? allPages.length : undefined;
    },
  });

  // Subscribe to new messages
  useEffect(() => {
    const channel = supabase
      .channel("chat-messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `organization_id=eq.${organizationId}`,
        },
        (payload) => {
          console.log("New message:", payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [organizationId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [data]);

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    if (!firstName && !lastName) return "U";
    return `${(firstName?.[0] || "").toUpperCase()}${(
      lastName?.[0] || ""
    ).toUpperCase()}`;
  };

  if (isLoading) {
    return <div className="p-4">Loading messages...</div>;
  }

  return (
    <ScrollArea ref={scrollRef} className="flex-1 p-4">
      <div className="space-y-4">
        {data?.pages.map((page, i) => (
          <div key={i}>
            {page.map((message) => (
              <div
                key={message.id}
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
                    {getInitials(
                      message.sender?.first_name,
                      message.sender?.last_name
                    )}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`flex flex-col ${
                    message.sender_id === currentUserId
                      ? "items-end"
                      : "items-start"
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
                          href={`${supabase.storage
                            .from("chat-attachments")
                            .getPublicUrl(message.attachment_path).data.publicUrl}`}
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
            ))}
          </div>
        ))}
        {hasNextPage && (
          <button onClick={() => fetchNextPage()}>Load more messages</button>
        )}
      </div>
    </ScrollArea>
  );
}