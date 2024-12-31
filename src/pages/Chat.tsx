import { useEffect, useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatInput } from "@/components/chat/ChatInput";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Chat = () => {
  const { session } = useSessionContext();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

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

  // Update user status when component mounts
  useEffect(() => {
    if (!session?.user?.id) return;

    const updateStatus = async () => {
      await supabase
        .from("user_status")
        .upsert({ 
          user_id: session.user.id,
          status: "online",
          last_active: new Date().toISOString()
        })
        .select();
    };

    updateStatus();

    // Set up presence channel
    const channel = supabase.channel("online-users");
    
    channel
      .on("presence", { event: "sync" }, () => {
        console.log("Presence sync:", channel.presenceState());
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        console.log("User joined:", key, newPresences);
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        console.log("User left:", key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            user_id: session.user.id,
            online_at: new Date().toISOString(),
          });
        }
      });

    // Cleanup
    return () => {
      channel.unsubscribe();
      if (session?.user?.id) {
        supabase
          .from("user_status")
          .upsert({ 
            user_id: session.user.id,
            status: "offline",
            last_active: new Date().toISOString()
          })
          .select();
      }
    };
  }, [session?.user?.id]);

  if (!session) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Please sign in to access the chat.
        </AlertDescription>
      </Alert>
    );
  }

  if (!profile) {
    return (
      <div className="p-4">
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4 p-4">
      <Card className="w-64 flex-shrink-0">
        <ChatSidebar
          currentUserId={session.user.id}
          organizationId={profile.organization_id}
          onSelectUser={setSelectedUserId}
          selectedUserId={selectedUserId}
        />
      </Card>
      
      <Card className="flex-1 flex flex-col">
        {selectedUserId ? (
          <>
            <ChatMessages
              currentUserId={session.user.id}
              selectedUserId={selectedUserId}
              organizationId={profile.organization_id}
            />
            <ChatInput
              currentUserId={session.user.id}
              selectedUserId={selectedUserId}
              organizationId={profile.organization_id}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a user to start chatting
          </div>
        )}
      </Card>
    </div>
  );
};

export default Chat;