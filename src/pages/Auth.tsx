import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { motion } from "framer-motion";
import { LoadingSpinner } from "@/components/auth/LoadingSpinner";
import { AuthBackground } from "@/components/auth/AuthBackground";
import { ThemeToggle } from "@/components/auth/ThemeToggle";
import { AuthForm } from "@/components/auth/AuthForm";

const Auth = () => {
  const { session, isLoading } = useSessionContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && session) {
      const from = location.state?.from || '/';
      navigate(from, { replace: true });
    }
  }, [session, isLoading, navigate, location]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (session) {
    return null;
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background/50 p-4">
      <AuthBackground />
      <ThemeToggle />
      
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 }
        }}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md space-y-8"
      >
        <div className="space-y-2 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold tracking-tight">Welcome back</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to your account to continue
            </p>
          </motion.div>
        </div>

        <AuthForm />
      </motion.div>
    </div>
  );
};

export default Auth;