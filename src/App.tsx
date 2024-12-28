import { useEffect } from "react";
import { AppProviders } from "@/components/providers/AppProviders";
import { AppRoutes } from "@/routes";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const App = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Initialize session on app load
    const initSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error initializing session:", error);
          throw error;
        }
        if (!session) {
          console.log("No active session found");
        } else {
          console.log("Session initialized successfully");
        }
      } catch (error) {
        console.error("Session initialization failed:", error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "There was a problem with your session. Please try logging in again.",
        });
      }
    };

    initSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        
        if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing session');
          // Clear any session-related state or cached data
          localStorage.removeItem('app-auth');
        } else if (event === 'SIGNED_IN') {
          console.log('User signed in, session established');
          try {
            // Verify the user has a profile
            const { data: profile, error: profileError } = await supabase
              .from("profiles")
              .select("role")
              .eq("id", session?.user?.id)
              .maybeSingle();

            if (profileError) {
              console.error("Error fetching profile:", profileError);
              throw profileError;
            }

            if (!profile) {
              console.warn("No profile found for user:", session?.user?.id);
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
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
};

export default App;