import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function UsersRolesTable() {
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // Modified query to avoid ambiguous relationships
      const { data, error } = await supabase
        .from("profiles")
        .select("*, organization:organization_id(name)")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: roleDefinitions, isLoading: rolesLoading } = useQuery({
    queryKey: ["role-definitions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("role_definitions")
        .select("*");
      
      if (error) throw error;
      return data;
    },
  });

  if (usersLoading || rolesLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Role Description</TableHead>
          <TableHead>Joined</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users?.map((user) => {
          const roleDefinition = roleDefinitions?.find(
            (role) => role.role === user.role
          );
          
          return (
            <TableRow key={user.id}>
              <TableCell>
                {user.first_name} {user.last_name}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>{roleDefinition?.description}</TableCell>
              <TableCell>
                {new Date(user.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}