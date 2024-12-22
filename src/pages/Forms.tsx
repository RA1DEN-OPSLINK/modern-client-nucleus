import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Forms() {
  const { toast } = useToast();
  const { session, isLoading: isSessionLoading } = useSessionContext();
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    if (!isSessionLoading && !session) {
      navigate('/auth');
    }
  }, [session, isSessionLoading, navigate]);

  const { data: forms, isLoading: isFormsLoading } = useQuery({
    queryKey: ["forms"],
    queryFn: async () => {
      if (!session?.user) return [];

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
    enabled: !!session?.user, // Only run query if user is authenticated
  });

  if (isSessionLoading || isFormsLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect in useEffect
  }

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