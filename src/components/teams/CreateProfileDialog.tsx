import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProfileForm } from "./profile-dialog/ProfileForm";
import { useProfileForm } from "./profile-dialog/useProfileForm";
import { CreateProfileDialogProps } from "./profile-dialog/types";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export function CreateProfileDialog({ open, onOpenChange, organizationId }: CreateProfileDialogProps) {
  const { toast } = useToast();

  useEffect(() => {
    if (open && !organizationId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Organization ID is required to create a team member",
      });
      onOpenChange(false);
    }
  }, [open, organizationId, onOpenChange, toast]);

  if (!organizationId) {
    return null;
  }

  const {
    formData,
    updateFormData,
    handleSubmit,
    isLoading,
    profileId
  } = useProfileForm(organizationId, onOpenChange);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Team Member</DialogTitle>
        </DialogHeader>
        <ProfileForm
          isLoading={isLoading}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          formData={formData}
          setFormData={updateFormData}
          profileId={profileId}
        />
      </DialogContent>
    </Dialog>
  );
}