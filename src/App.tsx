import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AppLayout } from "./layouts/AppLayout";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import Teams from "./pages/Teams";
import Clients from "./pages/Clients";
import Tenant from "./pages/Tenant";
import Profile from "./pages/Profile";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const supabase = createClient(
  "https://qucizswoafsydzcmtxdh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1Y2l6c3dvYWZzeWR6Y210eGRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4NDA1NTksImV4cCI6MjA1MDQxNjU1OX0.bHYUA0NDkRY6jLb9h6mNXyMfwOyuuSPf566Q1Afwxcs"
);

// Session handler component
const SessionHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        // Clear query cache on sign out
        queryClient.clear();
        navigate('/auth');
      } else if (event === 'SIGNED_IN') {
        navigate('/');
      }
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SessionContextProvider supabaseClient={supabase}>
      <ThemeProvider defaultTheme="system" storageKey="app-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SessionHandler />
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<AppLayout><Index /></AppLayout>} />
              <Route path="/teams" element={<AppLayout><Teams /></AppLayout>} />
              <Route path="/clients" element={<AppLayout><Clients /></AppLayout>} />
              <Route path="/tenant" element={<AppLayout><Tenant /></AppLayout>} />
              <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </SessionContextProvider>
  </QueryClientProvider>
);

export default App;