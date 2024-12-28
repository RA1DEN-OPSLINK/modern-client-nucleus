import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { LoadingSpinner } from "./LoadingSpinner";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useSessionContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !session) {
      // Save the current location to redirect back after login
      navigate('/auth', { state: { from: location.pathname } });
    }
  }, [session, isLoading, navigate, location]);

  // Show loading state while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Only render children if we have a session
  return session ? children : null;
};