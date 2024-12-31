import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AuthGuard } from "@/components/auth/AuthGuard";

// Pages
import Auth from "@/pages/Auth";
import Index from "@/pages/Index";
import Teams from "@/pages/Teams";
import Clients from "@/pages/Clients";
import ClientsPortal from "@/pages/ClientsPortal";
import Tenant from "@/pages/Tenant";
import Profile from "@/pages/Profile";
import Files from "@/pages/Files";
import Map from "@/pages/Map";
import Settings from "@/pages/Settings";
import Calendar from "@/pages/Calendar";
import Chat from "@/pages/Chat";

export const AppRoutes = () => (
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
      path="/clients-portal"
      element={
        <ProtectedRoute>
          <AppLayout>
            <ClientsPortal />
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
      path="/calendar"
      element={
        <ProtectedRoute>
          <AppLayout>
            <Calendar />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/chat"
      element={
        <ProtectedRoute>
          <AppLayout>
            <Chat />
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