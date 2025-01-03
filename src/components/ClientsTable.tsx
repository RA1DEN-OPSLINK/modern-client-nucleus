import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

interface ClientsTableProps {
  organizationId?: string;
}

export function ClientsTable({ organizationId }: ClientsTableProps) {
  const { toast } = useToast();

  const { data: clients, isLoading, refetch } = useQuery({
    queryKey: ["clients", organizationId],
    enabled: !!organizationId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("organization_id", organizationId);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching clients",
          description: error.message,
        });
        return [];
      }

      return data;
    },
  });

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("clients")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error deleting client",
        description: error.message,
      });
      return;
    }

    toast({
      title: "Client deleted successfully",
    });
    refetch();
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>City</TableHead>
          <TableHead>Postal Code</TableHead>
          <TableHead>Country</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients?.map((client) => (
          <TableRow key={client.id}>
            <TableCell className="font-medium">{client.name}</TableCell>
            <TableCell>{client.email}</TableCell>
            <TableCell>{client.phone}</TableCell>
            <TableCell>{client.address}</TableCell>
            <TableCell>{client.city}</TableCell>
            <TableCell>{client.postal_code}</TableCell>
            <TableCell>{client.country}</TableCell>
            <TableCell>
              <div className="text-sm">
                <p className="font-medium">{client.company_name}</p>
                <p className="text-muted-foreground">{client.company_address}</p>
                <p className="text-muted-foreground">
                  {client.company_city}, {client.company_postal_code}
                </p>
                <p className="text-muted-foreground">{client.company_country}</p>
                <p>{client.company_phone}</p>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={client.status === "active" ? "default" : "secondary"}>
                {client.status}
              </Badge>
            </TableCell>
            <TableCell>{new Date(client.created_at).toLocaleDateString()}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDelete(client.id)}
                >
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