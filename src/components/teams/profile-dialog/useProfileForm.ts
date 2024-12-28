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
    address: "",
    teamIds: [],
    role: "team",
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
      address: "",
      teamIds: [],
      role: "team",
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
      // Create the profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .insert({
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          city: formData.city,
          postal_code: formData.postalCode,
          country: formData.country,
          organization_id: organizationId,
          role: formData.role,
          avatar_url: formData.avatarUrl,
          address: formData.address,
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // Add team member to selected teams if any teams were selected
      if (formData.teamIds.length > 0 && profile) {
        const teamMembers = formData.teamIds.map(teamId => ({
          team_id: teamId,
          profile_id: profile.id,
        }));

        const { error: teamMemberError } = await supabase
          .from("team_members")
          .insert(teamMembers);

        if (teamMemberError) throw teamMemberError;
      }

      toast({
        title: "Success",
        description: "Team member profile created successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
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