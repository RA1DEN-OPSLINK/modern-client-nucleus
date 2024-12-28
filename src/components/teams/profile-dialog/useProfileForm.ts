import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProfileFormData } from "./types";

export function useProfileForm(organizationId: string | undefined, onOpenChange: (open: boolean) => void) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const profileId = crypto.randomUUID();

  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    phone: "",
    city: "",
    postalCode: "",
    country: "",
    avatarUrl: null,
  });

  const updateFormData = (newData: Partial<ProfileFormData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
      city: "",
      postalCode: "",
      country: "",
      avatarUrl: null,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizationId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Organization ID is required",
      });
      return;
    }

    if (!formData.firstName || !formData.lastName) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "First name and last name are required",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .insert({
          id: profileId,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          city: formData.city,
          postal_code: formData.postalCode,
          country: formData.country,
          organization_id: organizationId,
          role: "team",
          avatar_url: formData.avatarUrl
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Team member profile created successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating profile",
        description: error.message,
      });
      console.error("Error creating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    updateFormData,
    handleSubmit,
    isLoading,
    profileId
  };
}