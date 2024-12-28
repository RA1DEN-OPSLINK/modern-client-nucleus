import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { CreateTeamDialog } from "@/components/CreateTeamDialog";
import { CreateProfileDialog } from "@/components/teams/CreateProfileDialog";
import { TeamHeader } from "@/components/teams/TeamHeader";
import { TeamsTable } from "@/components/teams/TeamsTable";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export default function Teams() {
  const { toast } = useToast();
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [isCreateProfileOpen, setIsCreateProfileOpen] = useState(false);
  const { session } = useSessionContext();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    enabled: !!session?.user.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*, organizations(*)")
        .eq("id", session?.user.id)
        .single();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching profile",
          description: error.message,
        });
        return null;
      }
      return data;
    },
  });

  const canManageTeams = profile?.role === "tenant" || profile?.role === "manager";

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <TeamHeader
        canManageTeams={canManageTeams}
        onCreateTeam={() => setIsCreateTeamOpen(true)}
      />

      <div className="flex justify-end">
        <Button onClick={() => setIsCreateProfileOpen(true)}>
          Add Team Member
        </Button>
      </div>

      <TeamsTable organizationId={profile?.organization_id} />

      <CreateTeamDialog
        open={isCreateTeamOpen}
        onOpenChange={setIsCreateTeamOpen}
        organizationId={profile?.organization_id}
      />

      <CreateProfileDialog
        open={isCreateProfileOpen}
        onOpenChange={setIsCreateProfileOpen}
        organizationId={profile?.organization_id}
      />
    </div>
  );
}