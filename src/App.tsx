import { StrictMode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { AppLayout } from "./layouts/AppLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AuthGuard } from "./components/auth/AuthGuard";

// Pages
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import Teams from "./pages/Teams";
import Clients from "./pages/Clients";
import Tenant from "./pages/Tenant";
import Profile from "./pages/Profile";
import Forms from "./pages/Forms";
import Files from "./pages/Files";
import Map from "./pages/Map";
import Settings from "./pages/Settings";

// Initialize QueryClient with configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Initialize Supabase client
const supabase = createClient(
  "https://qucizswoafsydzcmtxdh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1Y2l6c3dvYWZzeWR6Y210eGRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4NDA1NTksImV4cCI6MjA1MDQxNjU1OX0.bHYUA0NDkRY6jLb9h6mNXyMfwOyuuSPf566Q1Afwxcs"
);

const AppRoutes = () => (
  <Routes>
    {/* Public route */}
    <Route 
      path="/auth" 
      element={
        <AuthGuard>
          <Auth />
        </AuthGuard>
      } 
    />

    {/* Protected routes */}
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <AppLayout>
            <Index />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/teams"
      element={
        <ProtectedRoute>
          <AppLayout>
            <Teams />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/clients"
      element={
        <ProtectedRoute>
          <AppLayout>
            <Clients />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/tenant"
      element={
        <ProtectedRoute>
          <AppLayout>
            <Tenant />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <AppLayout>
            <Profile />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/forms"
      element={
        <ProtectedRoute>
          <AppLayout>
            <Forms />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/files"
      element={
        <ProtectedRoute>
          <AppLayout>
            <Files />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/map"
      element={
        <ProtectedRoute>
          <AppLayout>
            <Map />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/settings"
      element={
        <ProtectedRoute>
          <AppLayout>
            <Settings />
          </AppLayout>
        </ProtectedRoute>
      }
    />

    {/* Catch all route */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

const App = () => (
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <BrowserRouter>
          <ThemeProvider defaultTheme="system" storageKey="app-theme">
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <AppRoutes />
            </TooltipProvider>
          </ThemeProvider>
        </BrowserRouter>
      </SessionContextProvider>
    </QueryClientProvider>
  </StrictMode>
);

export default App;