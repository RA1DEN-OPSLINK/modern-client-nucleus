import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, UserPlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface TeamsTableProps {
  organizationId?: string;
}

export function TeamsTable({ organizationId }: TeamsTableProps) {
  const { toast } = useToast();

  const { data: teams, isLoading } = useQuery({
    queryKey: ["teams", organizationId],
    enabled: !!organizationId,
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
        .eq("organization_id", organizationId);

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

  if (isLoading) return <div>Loading...</div>;

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
                <Button variant="ghost" size="icon">
                  <UserPlus className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}