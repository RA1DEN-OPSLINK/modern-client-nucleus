import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function Forms() {
  const { toast } = useToast();

  const { data: forms, isLoading } = useQuery({
    queryKey: ["forms"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("forms")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching forms",
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
        <h1 className="text-3xl font-bold tracking-tight">Forms</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Form
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {forms?.map((form) => (
            <TableRow key={form.id}>
              <TableCell className="font-medium">{form.title}</TableCell>
              <TableCell>{form.form_type}</TableCell>
              <TableCell>{form.status}</TableCell>
              <TableCell>{new Date(form.created_at).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}