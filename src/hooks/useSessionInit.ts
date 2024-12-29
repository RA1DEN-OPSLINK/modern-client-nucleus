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
          throw error;
        }
        if (!session) {
          console.log("No active session found");
          setIsLoading(false);
          return;
        }
        
        console.log("Session initialized successfully");
        
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          if (profileError.code === 'PGRST116') {
            console.log("Profile not found for user:", session.user.id);
            toast({
              variant: "destructive",
              title: "Profile Error",
              description: "Your user profile could not be found. Please contact support.",
            });
          } else {
            throw profileError;
          }
        }

        if (!profile) {
          console.warn("No profile found for user:", session.user.id);
          toast({
            variant: "destructive",
            title: "Profile Error",
            description: "Your user profile could not be found. Please contact support.",
          });
        }
      } catch (error) {
        console.error("Session initialization failed:", error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "There was a problem with your session. Please try logging in again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        
        if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing session');
          localStorage.clear();
          setIsLoading(false);
        } else if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in, session established');
          setIsLoading(true);
          try {
            const { data: profile, error: profileError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();

            if (profileError) {
              console.error("Error fetching profile:", profileError);
              throw profileError;
            }

            if (!profile) {
              console.warn("No profile found for user:", session.user.id);
              toast({
                variant: "destructive",
                title: "Profile Error",
                description: "Your user profile could not be found. Please contact support.",
              });
            }
          } catch (error) {
            console.error("Error verifying user profile:", error);
            toast({
              variant: "destructive",
              title: "Authentication Error",
              description: "There was a problem verifying your profile. Please try logging in again.",
            });
          } finally {
            setIsLoading(false);
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  return { isLoading };
};