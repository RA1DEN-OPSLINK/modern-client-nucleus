export interface ProfileFormData {
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  postalCode: string;
  country: string;
  avatarUrl: string | null;
  address: string;
  teamIds: string[];
  role: 'team' | 'manager';
}

export interface CreateProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId?: string;
}

export interface TeamOption {
  id: string;
  name: string;
}