import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProfileForm } from "./profile-dialog/ProfileForm";
import { useProfileForm } from "./profile-dialog/useProfileForm";
import { CreateProfileDialogProps } from "./profile-dialog/types";

export function CreateProfileDialog({ open, onOpenChange, organizationId }: CreateProfileDialogProps) {
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