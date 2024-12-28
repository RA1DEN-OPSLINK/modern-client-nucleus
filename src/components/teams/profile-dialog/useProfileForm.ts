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
    email: "", // Add email field
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
      email: "",
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

    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "First name, last name, and email are required",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Generate a temporary password
      const temporaryPassword = Math.random().toString(36).slice(-8);

      // Send welcome email with temporary password
      const { error: emailError } = await supabase.functions.invoke('send-welcome-email', {
        body: {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          temporaryPassword,
        },
      });

      if (emailError) throw emailError;

      // Create the profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: crypto.randomUUID(),
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
      if (!profileData) throw new Error('Failed to create profile');

      // Add team member to selected teams if any teams were selected
      if (formData.teamIds.length > 0) {
        const teamMembers = formData.teamIds.map(teamId => ({
          team_id: teamId,
          profile_id: profileData.id,
        }));

        const { error: teamMemberError } = await supabase
          .from("team_members")
          .insert(teamMembers);

        if (teamMemberError) throw teamMemberError;
      }

      toast({
        title: "Success",
        description: "Team member profile created successfully. An email has been sent with login instructions.",
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