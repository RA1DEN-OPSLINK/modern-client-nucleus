import { StrictMode, useEffect } from "react";
import { AppProviders } from "@/components/providers/AppProviders";
import { AppRoutes } from "@/routes";
import { supabase } from "@/integrations/supabase/client";

const App = () => {
  useEffect(() => {
    // Initialize session on app load
    const initSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error initializing session:", error);
      }
      if (!session) {
        console.log("No active session found");
      }
    };

    initSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        if (event === 'SIGNED_OUT') {
          // Clear any session-related state or cached data
          console.log('User signed out, clearing session');
        } else if (event === 'SIGNED_IN') {
          console.log('User signed in, session established');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <StrictMode>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </StrictMode>
  );
};

export default App;