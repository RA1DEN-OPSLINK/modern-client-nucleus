import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useCreateClient(organizationId: string | undefined, onSuccess: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createClient = async (data: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    companyName: string;
    companyPhone: string;
    companyAddress: string;
    companyCity: string;
    companyPostalCode: string;
    companyCountry: string;
    avatarUrl: string | null;
    separateBilling: boolean;
    billingAddress: string;
    billingCity: string;
    billingPostalCode: string;
    billingCountry: string;
    billingPhone: string;
  }) => {
    if (!organizationId) {
      toast({
        variant: "destructive",
        title: "Error creating client",
        description: "Organization ID is required",
      });
      return false;
    }

    if (!data.name) {
      toast({
        variant: "destructive",
        title: "Error creating client",
        description: "Client name is required",
      });
      return false;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("clients")
        .insert({
          organization_id: organizationId,
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          postal_code: data.postalCode,
          country: data.country,
          company_name: data.companyName,
          company_phone: data.companyPhone,
          company_address: data.companyAddress,
          company_city: data.companyCity,
          company_postal_code: data.companyPostalCode,
          company_country: data.companyCountry,
          status: "lead",
          avatar_url: data.avatarUrl,
          billing_address: data.separateBilling ? data.billingAddress : data.address,
          billing_city: data.separateBilling ? data.billingCity : data.city,
          billing_postal_code: data.separateBilling ? data.billingPostalCode : data.postalCode,
          billing_country: data.separateBilling ? data.billingCountry : data.country,
          billing_phone: data.separateBilling ? data.billingPhone : data.phone,
        });

      if (error) throw error;

      toast({
        title: "Client created successfully",
      });

      // Invalidate and refetch clients data
      await queryClient.invalidateQueries({ queryKey: ["clients"] });
      
      onSuccess();
      return true;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating client",
        description: error.message,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createClient,
    isLoading,
  };
}