import { StrictMode } from "react";
import { AppProviders } from "@/components/providers/AppProviders";
import { AppRoutes } from "@/routes";

const App = () => (
  <StrictMode>
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  </StrictMode>
);

export default App;