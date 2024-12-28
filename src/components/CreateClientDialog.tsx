import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ClientBasicInfo } from "./clients/ClientBasicInfo";
import { ClientAddress } from "./clients/ClientAddress";
import { CompanyInfo } from "./clients/CompanyInfo";
import { ClientAvatar } from "./clients/ClientAvatar";
import { BillingAddress } from "./clients/BillingAddress";
import { useCreateClient } from "@/hooks/useCreateClient";

interface CreateClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
}

export function CreateClientDialog({ open, onOpenChange, organizationId }: CreateClientDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyCity, setCompanyCity] = useState("");
  const [companyPostalCode, setCompanyPostalCode] = useState("");
  const [companyCountry, setCompanyCountry] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [separateBilling, setSeparateBilling] = useState(false);
  const [billingAddress, setBillingAddress] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingPostalCode, setBillingPostalCode] = useState("");
  const [billingCountry, setBillingCountry] = useState("");
  const [billingPhone, setBillingPhone] = useState("");

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setCity("");
    setPostalCode("");
    setCountry("");
    setCompanyName("");
    setCompanyPhone("");
    setCompanyAddress("");
    setCompanyCity("");
    setCompanyPostalCode("");
    setCompanyCountry("");
    setAvatarUrl(null);
    setSeparateBilling(false);
    setBillingAddress("");
    setBillingCity("");
    setBillingPostalCode("");
    setBillingCountry("");
    setBillingPhone("");
  };

  const { createClient, isLoading } = useCreateClient(organizationId, () => {
    resetForm();
    onOpenChange(false);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createClient({
      name,
      email,
      phone,
      address,
      city,
      postalCode,
      country,
      companyName,
      companyPhone,
      companyAddress,
      companyCity,
      companyPostalCode,
      companyCountry,
      avatarUrl,
      separateBilling,
      billingAddress,
      billingCity,
      billingPostalCode,
      billingCountry,
      billingPhone,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <ClientAvatar 
            clientId={crypto.randomUUID()}
            name={name}
            onUploadComplete={setAvatarUrl}
          />
          
          <div className="space-y-6">
            <ClientBasicInfo
              name={name}
              email={email}
              phone={phone}
              setName={setName}
              setEmail={setEmail}
              setPhone={setPhone}
            />

            <ClientAddress
              address={address}
              city={city}
              postalCode={postalCode}
              country={country}
              setAddress={setAddress}
              setCity={setCity}
              setPostalCode={setPostalCode}
              setCountry={setCountry}
            />

            <CompanyInfo
              companyName={companyName}
              companyPhone={companyPhone}
              companyAddress={companyAddress}
              companyCity={companyCity}
              companyPostalCode={companyPostalCode}
              companyCountry={companyCountry}
              setCompanyName={setCompanyName}
              setCompanyPhone={setCompanyPhone}
              setCompanyAddress={setCompanyAddress}
              setCompanyCity={setCompanyCity}
              setCompanyPostalCode={setCompanyPostalCode}
              setCompanyCountry={setCompanyCountry}
            />

            <BillingAddress
              separateBilling={separateBilling}
              setSeparateBilling={setSeparateBilling}
              billingAddress={billingAddress}
              billingCity={billingCity}
              billingPostalCode={billingPostalCode}
              billingCountry={billingCountry}
              billingPhone={billingPhone}
              setBillingAddress={setBillingAddress}
              setBillingCity={setBillingCity}
              setBillingPostalCode={setBillingPostalCode}
              setBillingCountry={setBillingCountry}
              setBillingPhone={setBillingPhone}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding Client..." : "Add Client"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}