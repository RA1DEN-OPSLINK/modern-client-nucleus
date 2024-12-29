import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ClientFormProps {
  clientForm: {
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    address: string;
  };
  setClientForm: (form: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ClientForm = ({ clientForm, setClientForm, onSubmit }: ClientFormProps) => {
  return (
    <Card className="mb-6 transform transition-all duration-200 hover:shadow-lg">
      <CardHeader>
        <CardTitle>Add New Client</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                value={clientForm.companyName}
                onChange={(e) => setClientForm({...clientForm, companyName: e.target.value})}
                placeholder="Enter company name"
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input
                id="contactPerson"
                value={clientForm.contactPerson}
                onChange={(e) => setClientForm({...clientForm, contactPerson: e.target.value})}
                placeholder="Enter contact person"
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientEmail">Email *</Label>
              <Input
                id="clientEmail"
                type="email"
                value={clientForm.email}
                onChange={(e) => setClientForm({...clientForm, email: e.target.value})}
                placeholder="Enter email"
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={clientForm.phone}
                onChange={(e) => setClientForm({...clientForm, phone: e.target.value})}
                placeholder="Enter phone number"
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={clientForm.address}
              onChange={(e) => setClientForm({...clientForm, address: e.target.value})}
              placeholder="Enter address"
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 transition-colors">
            Add Client
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};