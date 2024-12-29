import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ClientsPortalData } from "./types";

export function usePortalData() {
  const { toast } = useToast();

  return useQuery({
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

      return data as ClientsPortalData[];
    },
  });
}