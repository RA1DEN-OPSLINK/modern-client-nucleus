import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PortalHeaderProps {
  onCreatePortal: () => void;
}

export function PortalHeader({ onCreatePortal }: PortalHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold tracking-tight">Clients Portal</h1>
      <Button onClick={onCreatePortal}>
        <Plus className="mr-2 h-4 w-4" /> Create Portal
      </Button>
    </div>
  );
}