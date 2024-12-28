import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ClientAddressProps {
  address: string;
  city: string;
  postalCode: string;
  country: string;
  setAddress: (value: string) => void;
  setCity: (value: string) => void;
  setPostalCode: (value: string) => void;
  setCountry: (value: string) => void;
}

export function ClientAddress({
  address,
  city,
  postalCode,
  country,
  setAddress,
  setCity,
  setPostalCode,
  setCountry,
}: ClientAddressProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2 space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="postalCode">Postal/Zip Code</Label>
        <Input
          id="postalCode"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
        />
      </div>
      <div className="col-span-2 space-y-2">
        <Label htmlFor="country">Country</Label>
        <Input
          id="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
      </div>
    </div>
  );
}