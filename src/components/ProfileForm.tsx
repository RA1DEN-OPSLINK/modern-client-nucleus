import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Form } from "@/components/ui/form";
import { ProfilesTable } from "@/integrations/supabase/types/tables";
import { Loader2 } from "lucide-react";
import { AvatarUpload } from "./profile/AvatarUpload";
import { ProfileFields } from "./profile/ProfileFields";

const profileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  display_name: z.string().optional(),
  avatar_url: z.string().nullable(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  profile: ProfilesTable["Row"];
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
      display_name: profile.display_name || "",
      avatar_url: profile.avatar_url || null,
      phone: profile.phone || "",
      address: profile.address || "",
      city: profile.city || "",
      state: profile.state || "",
      postal_code: profile.postal_code || "",
      country: profile.country || "",
    },
  });

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      const { error } = await supabase
        .from("profiles")
        .update(values)
        .eq("id", profile.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      });
      console.error("Error updating profile:", error);
    },
  });

  function onSubmit(values: ProfileFormValues) {
    updateProfile(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <AvatarUpload
          profileId={profile.id}
          avatarUrl={form.getValues('avatar_url')}
          firstName={form.getValues('first_name')}
          lastName={form.getValues('last_name')}
          setValue={form.setValue}
          onUploadComplete={(url) => updateProfile({ ...form.getValues(), avatar_url: url })}
        />

        <ProfileFields control={form.control} />

        <div className="flex items-center space-x-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
          {isPending && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
        </div>
      </form>
    </Form>
  );
}