import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CompanyInfoProps {
  companyName: string;
  companyPhone: string;
  companyAddress: string;
  companyCity: string;
  companyPostalCode: string;
  companyCountry: string;
  setCompanyName: (value: string) => void;
  setCompanyPhone: (value: string) => void;
  setCompanyAddress: (value: string) => void;
  setCompanyCity: (value: string) => void;
  setCompanyPostalCode: (value: string) => void;
  setCompanyCountry: (value: string) => void;
}

export function CompanyInfo({
  companyName,
  companyPhone,
  companyAddress,
  companyCity,
  companyPostalCode,
  companyCountry,
  setCompanyName,
  setCompanyPhone,
  setCompanyAddress,
  setCompanyCity,
  setCompanyPostalCode,
  setCompanyCountry,
}: CompanyInfoProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2 space-y-2">
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="companyPhone">Company Phone</Label>
        <Input
          id="companyPhone"
          type="tel"
          value={companyPhone}
          onChange={(e) => setCompanyPhone(e.target.value)}
        />
      </div>
      <div className="col-span-2 space-y-2">
        <Label htmlFor="companyAddress">Company Address</Label>
        <Input
          id="companyAddress"
          value={companyAddress}
          onChange={(e) => setCompanyAddress(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="companyCity">Company City</Label>
        <Input
          id="companyCity"
          value={companyCity}
          onChange={(e) => setCompanyCity(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="companyPostalCode">Company Postal/Zip Code</Label>
        <Input
          id="companyPostalCode"
          value={companyPostalCode}
          onChange={(e) => setCompanyPostalCode(e.target.value)}
        />
      </div>
      <div className="col-span-2 space-y-2">
        <Label htmlFor="companyCountry">Company Country</Label>
        <Input
          id="companyCountry"
          value={companyCountry}
          onChange={(e) => setCompanyCountry(e.target.value)}
        />
      </div>
    </div>
  );
}