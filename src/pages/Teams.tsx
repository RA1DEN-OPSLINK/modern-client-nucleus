import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, UserPlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { CreateTeamDialog } from "@/components/CreateTeamDialog";
import { useSessionContext } from "@supabase/auth-helpers-react";

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

  const handleDeleteTeam = async (teamId: string) => {
    const { error } = await supabase
      .from("teams")
      .delete()
      .eq("id", teamId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error deleting team",
        description: error.message,
      });
      return;
    }

    toast({
      title: "Team deleted successfully",
    });
  };

  const canManageTeams = profile?.role === "tenant" || profile?.role === "manager";
  const canDeleteTeams = profile?.role === "tenant";

  if (isLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
          <p className="text-muted-foreground">
            Manage your organization's teams
          </p>
        </div>
        {canManageTeams && (
          <Button onClick={() => setIsCreateTeamOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create Team
          </Button>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Members</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams?.map((team) => (
            <TableRow key={team.id}>
              <TableCell className="font-medium">{team.name}</TableCell>
              <TableCell>{team.description}</TableCell>
              <TableCell>{team.team_members?.length || 0}</TableCell>
              <TableCell>{new Date(team.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {canManageTeams && (
                    <>
                      <Button variant="ghost" size="icon">
                        <UserPlus className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  {canDeleteTeams && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteTeam(team.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CreateTeamDialog
        open={isCreateTeamOpen}
        onOpenChange={setIsCreateTeamOpen}
        organizationId={profile?.organization_id}
      />
    </div>
  );
}