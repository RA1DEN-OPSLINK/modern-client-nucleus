import { AppProviders } from "@/components/providers/AppProviders";
import { AppRoutes } from "@/routes";
import { Toaster } from "@/components/ui/toaster";
import { LoadingSpinner } from "@/components/auth/LoadingSpinner";
import { useSessionInit } from "@/hooks/useSessionInit";

const App = () => {
  const { isLoading } = useSessionInit();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
      <Toaster />
    </>
  );
};

export default App;