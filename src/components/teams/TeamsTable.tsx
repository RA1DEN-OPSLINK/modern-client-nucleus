import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, UserPlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface Team {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  team_members: Array<any>;
}

interface TeamsTableProps {
  teams: Team[] | undefined;
  isLoading: boolean;
  canManageTeams: boolean;
  canDeleteTeams: boolean;
}

export function TeamsTable({ 
  teams, 
  isLoading, 
  canManageTeams, 
  canDeleteTeams 
}: TeamsTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
    
    queryClient.invalidateQueries({ queryKey: ["teams"] });
  };

  if (isLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
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
  );
}