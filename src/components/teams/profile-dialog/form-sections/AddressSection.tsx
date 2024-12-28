import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProfileFormData } from "../types";

interface AddressSectionProps {
  formData: ProfileFormData;
  setFormData: (data: Partial<ProfileFormData>) => void;
}

export function AddressSection({ formData, setFormData }: AddressSectionProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Address Information</h3>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address">Street Address</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ address: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={formData.country}
            onChange={(e) => setFormData({ country: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}