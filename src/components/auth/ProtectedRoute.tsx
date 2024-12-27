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
      // Redirect to auth page while saving the intended destination
      navigate('/auth', { state: { from: location.pathname } });
    }
  }, [session, isLoading, navigate, location]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return session ? children : null;
};