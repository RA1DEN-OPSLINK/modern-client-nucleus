import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface TeamActionsProps {
  canManageTeams: boolean;
  onCreateTeam: () => void;
}

export function TeamActions({ canManageTeams, onCreateTeam }: TeamActionsProps) {
  if (!canManageTeams) return null;
  
  return (
    <Button onClick={onCreateTeam}>
      <Plus className="mr-2 h-4 w-4" /> Create Team
    </Button>
  );
}