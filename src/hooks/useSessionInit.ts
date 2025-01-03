import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useSessionInit = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error initializing session:", error);
          toast({
            variant: "destructive",
            title: "Session Error",
            description: "There was a problem loading your session. Please try again.",
          });
          setIsLoading(false);
          return;
        }

        if (!session) {
          console.log("No active session");
          setIsLoading(false);
          return;
        }

        // Only fetch profile if we have a session
        const { error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error("Error fetching profile:", profileError);
          toast({
            variant: "destructive",
            title: "Profile Error",
            description: "There was a problem loading your profile.",
          });
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Session initialization failed:", error);
        setIsLoading(false);
      }
    };

    // Initialize session
    initSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (event === 'SIGNED_OUT') {
          setIsLoading(false);
          return;
        }

        if (event === 'SIGNED_IN' && session) {
          await initSession();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  return { isLoading };
};