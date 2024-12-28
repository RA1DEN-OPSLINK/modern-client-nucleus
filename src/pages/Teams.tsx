import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { CreateTeamDialog } from "@/components/CreateTeamDialog";
import { TeamHeader } from "@/components/teams/TeamHeader";
import { TeamsTable } from "@/components/teams/TeamsTable";
import { useToast } from "@/components/ui/use-toast";

export default function Teams() {
  const { toast } = useToast();
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const { session } = useSessionContext();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    enabled: !!session?.user.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*, organizations(*)")
        .eq("id", session?.user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: teams, isLoading } = useQuery({
    queryKey: ["teams", profile?.organization_id],
    enabled: !!profile?.organization_id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teams")
        .select(`
          *,
          team_members (
            profiles (
              id,
              first_name,
              last_name,
              role
            )
          )
        `)
        .eq("organization_id", profile.organization_id);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching teams",
          description: error.message,
        });
        return [];
      }

      return data;
    },
  });

  const canManageTeams = profile?.role === "tenant" || profile?.role === "manager";
  const canDeleteTeams = profile?.role === "tenant";

  return (
    <div className="space-y-4">
      <TeamHeader
        canManageTeams={canManageTeams}
        onCreateTeam={() => setIsCreateTeamOpen(true)}
      />

      <TeamsTable
        teams={teams}
        isLoading={isLoading}
        canManageTeams={canManageTeams}
        canDeleteTeams={canDeleteTeams}
      />

      <CreateTeamDialog
        open={isCreateTeamOpen}
        onOpenChange={setIsCreateTeamOpen}
        organizationId={profile?.organization_id}
      />
    </div>
  );
}