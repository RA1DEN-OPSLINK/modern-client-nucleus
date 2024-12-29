import { AppProviders } from "@/components/providers/AppProviders";
import { AppRoutes } from "@/routes";
import { Toaster } from "@/components/ui/toaster";
import { LoadingSpinner } from "@/components/auth/LoadingSpinner";
import { useSessionInit } from "@/hooks/useSessionInit";
import { Suspense } from "react";

const App = () => {
  const { isLoading } = useSessionInit();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <AppProviders>
      <Suspense fallback={<LoadingSpinner />}>
        <AppRoutes />
      </Suspense>
      <Toaster />
    </AppProviders>
  );
};

export default App;