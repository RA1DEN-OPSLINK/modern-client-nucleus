import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { LoadingSpinner } from "./LoadingSpinner";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useSessionContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && session) {
      // Redirect to saved location or default to home
      const from = location.state?.from || '/';
      navigate(from);
    }
  }, [session, isLoading, navigate, location]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return !session ? children : null;
};