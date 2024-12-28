export interface ProfileFormData {
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  postalCode: string;
  country: string;
  avatarUrl: string | null;
}

export interface CreateProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId?: string;
}