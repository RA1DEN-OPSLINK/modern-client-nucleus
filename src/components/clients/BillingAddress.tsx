import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface BillingAddressProps {
  separateBilling: boolean;
  setSeparateBilling: (value: boolean) => void;
  billingAddress: string;
  billingCity: string;
  billingPostalCode: string;
  billingCountry: string;
  billingPhone: string;
  setBillingAddress: (value: string) => void;
  setBillingCity: (value: string) => void;
  setBillingPostalCode: (value: string) => void;
  setBillingCountry: (value: string) => void;
  setBillingPhone: (value: string) => void;
}

export function BillingAddress({
  separateBilling,
  setSeparateBilling,
  billingAddress,
  billingCity,
  billingPostalCode,
  billingCountry,
  billingPhone,
  setBillingAddress,
  setBillingCity,
  setBillingPostalCode,
  setBillingCountry,
  setBillingPhone,
}: BillingAddressProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="billing-info"
          checked={separateBilling}
          onCheckedChange={setSeparateBilling}
        />
        <Label htmlFor="billing-info">Use different billing address</Label>
      </div>

      {separateBilling && (
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-2">
            <Label htmlFor="billingAddress">Billing Address</Label>
            <Input
              id="billingAddress"
              value={billingAddress}
              onChange={(e) => setBillingAddress(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="billingCity">Billing City</Label>
            <Input
              id="billingCity"
              value={billingCity}
              onChange={(e) => setBillingCity(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="billingPostalCode">Billing Postal Code</Label>
            <Input
              id="billingPostalCode"
              value={billingPostalCode}
              onChange={(e) => setBillingPostalCode(e.target.value)}
            />
          </div>
          <div className="col-span-2 space-y-2">
            <Label htmlFor="billingCountry">Billing Country</Label>
            <Input
              id="billingCountry"
              value={billingCountry}
              onChange={(e) => setBillingCountry(e.target.value)}
            />
          </div>
          <div className="col-span-2 space-y-2">
            <Label htmlFor="billingPhone">Billing Phone</Label>
            <Input
              id="billingPhone"
              type="tel"
              value={billingPhone}
              onChange={(e) => setBillingPhone(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}