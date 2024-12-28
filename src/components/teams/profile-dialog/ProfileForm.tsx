import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { ProfileFormData } from "./types";

interface ProfileFormProps {
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
  formData: ProfileFormData;
  setFormData: (data: Partial<ProfileFormData>) => void;
}

export function ProfileForm({
  isLoading,
  onSubmit,
  onCancel,
  formData,
  setFormData,
}: ProfileFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name *</Label>
        <Input
          id="firstName"
          value={formData.firstName}
          onChange={(e) => setFormData({ firstName: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name *</Label>
        <Input
          id="lastName"
          value={formData.lastName}
          onChange={(e) => setFormData({ lastName: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ phone: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          value={formData.city}
          onChange={(e) => setFormData({ city: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="postalCode">Postal Code</Label>
        <Input
          id="postalCode"
          value={formData.postalCode}
          onChange={(e) => setFormData({ postalCode: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Input
          id="country"
          value={formData.country}
          onChange={(e) => setFormData({ country: e.target.value })}
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Add Team Member'
          )}
        </Button>
      </div>
    </form>
  );
}