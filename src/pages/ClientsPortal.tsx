import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function ClientsPortal() {
  const { toast } = useToast();

  const { data: portals, isLoading } = useQuery({
    queryKey: ["clients-portal"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients_portal")
        .select("*");

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching clients portal",
          description: error.message,
        });
        return [];
      }

      return data;
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Clients Portal</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Portal
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {portals?.map((portal) => (
            <TableRow key={portal.id}>
              <TableCell className="font-medium">{portal.name}</TableCell>
              <TableCell>{portal.description}</TableCell>
              <TableCell>
                <Badge variant={portal.status === "active" ? "default" : "secondary"}>
                  {portal.status}
                </Badge>
              </TableCell>
              <TableCell>{new Date(portal.created_at).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}