import { StrictMode, useEffect } from "react";
import { AppProviders } from "@/components/providers/AppProviders";
import { AppRoutes } from "@/routes";
import { supabase } from "@/integrations/supabase/client";

const App = () => {
  useEffect(() => {
    // Check and refresh session on app load
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error checking session:", error);
      }
    };

    checkSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          // Handle sign out if needed
          console.log('User signed out');
        } else if (event === 'SIGNED_IN') {
          // Handle sign in if needed
          console.log('User signed in');
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