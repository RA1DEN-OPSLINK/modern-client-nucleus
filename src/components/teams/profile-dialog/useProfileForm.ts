import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProfileFormData } from "./types";

export function useProfileForm(organizationId: string | undefined, onOpenChange: (open: boolean) => void) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
      // First create an auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}@example.com`,
        password: "temporary-password-123", // You should implement a secure password generation
        email_confirm: true,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Failed to create user");

      // Then create the profile
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: authData.user.id,
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

      if (profileError) throw profileError;

      toast({
        title: "Success",
        description: "Team member profile created successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      console.error("Error creating profile:", error);
      toast({
        variant: "destructive",
        title: "Error creating profile",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    updateFormData,
    handleSubmit,
    isLoading,
  };
}