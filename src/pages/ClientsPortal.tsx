import { usePortalData } from "@/components/clients-portal/usePortalData";
import { PortalHeader } from "@/components/clients-portal/PortalHeader";
import { PortalTable } from "@/components/clients-portal/PortalTable";

export default function ClientsPortal() {
  const { data: portals, isLoading } = usePortalData();

  const handleCreatePortal = () => {
    // TODO: Implement portal creation
    console.log("Create portal clicked");
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <PortalHeader onCreatePortal={handleCreatePortal} />
      <PortalTable portals={portals} />
    </div>
  );
}