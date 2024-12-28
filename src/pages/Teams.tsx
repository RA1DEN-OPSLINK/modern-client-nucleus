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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function Teams() {
  const { toast } = useToast();
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [isCreateProfileOpen, setIsCreateProfileOpen] = useState(false);
  const { session } = useSessionContext();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["profile"],
    enabled: !!session?.user.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*, organizations(*)")
        .eq("id", session?.user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
      
      if (!data) {
        throw new Error("Profile not found");
      }

      return data;
    },
  });

  const canManageTeams = profile?.role === "tenant" || profile?.role === "manager";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertDescription>
            There was an error loading your profile. Please try refreshing the page or contact support if the problem persists.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!profile?.organization_id) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertDescription>
            Your account is not associated with an organization. Please contact support for assistance.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

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

      <TeamsTable organizationId={profile.organization_id} />

      <CreateTeamDialog
        open={isCreateTeamOpen}
        onOpenChange={setIsCreateTeamOpen}
        organizationId={profile.organization_id}
      />

      <CreateProfileDialog
        open={isCreateProfileOpen}
        onOpenChange={setIsCreateProfileOpen}
        organizationId={profile.organization_id}
      />
    </div>
  );
}