import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface ClientListProps {
  clients: any[];
  onDelete: (id: number) => void;
}

export const ClientList = ({ clients, onDelete }: ClientListProps) => {
  return (
    <div className="grid gap-4">
      {clients.map((client) => (
        <Card 
          key={client.id}
          className="transform transition-all duration-200 hover:shadow-lg hover:scale-[1.01]"
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="grid grid-cols-2 gap-2 flex-1">
                <p><strong>Company:</strong> {client.companyName}</p>
                <p><strong>Contact:</strong> {client.contactPerson}</p>
                <p><strong>Email:</strong> {client.email}</p>
                <p><strong>Phone:</strong> {client.phone}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                onClick={() => onDelete(client.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};