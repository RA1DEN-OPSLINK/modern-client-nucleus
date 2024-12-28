import { TeamActions } from "./TeamActions";

interface TeamHeaderProps {
  canManageTeams: boolean;
  onCreateTeam: () => void;
}

export function TeamHeader({ canManageTeams, onCreateTeam }: TeamHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
        <p className="text-muted-foreground">
          Manage your organization's teams
        </p>
      </div>
      <TeamActions 
        canManageTeams={canManageTeams} 
        onCreateTeam={onCreateTeam}
      />
    </div>
  );
}