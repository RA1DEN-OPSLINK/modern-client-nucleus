import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessageItem } from "./ChatMessageItem";
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
        .select(
          `
          *,
          sender:profiles!messages_sender_id_fkey(
            first_name,
            last_name,
            avatar_url
          )
        `
        )
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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [data]);

  if (isLoading) {
    return <div className="p-4">Loading messages...</div>;
  }

  return (
    <ScrollArea ref={scrollRef} className="flex-1 p-4">
      <div className="space-y-4">
        {data?.pages.map((page, i) => (
          <div key={i}>
            {page.map((message) => (
              <ChatMessageItem
                key={message.id}
                message={message}
                currentUserId={currentUserId}
              />
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