import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface TeamMemberListProps {
  teamMembers: any[];
  onDelete: (id: number) => void;
}

export const TeamMemberList = ({ teamMembers, onDelete }: TeamMemberListProps) => {
  return (
    <div className="grid gap-4">
      {teamMembers.map((member) => (
        <Card 
          key={member.id}
          className="transform transition-all duration-200 hover:shadow-lg hover:scale-[1.01]"
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="grid grid-cols-2 gap-2 flex-1">
                <p><strong>Name:</strong> {member.name}</p>
                <p><strong>Role:</strong> {member.role}</p>
                <p><strong>Email:</strong> {member.email}</p>
                <p><strong>Department:</strong> {member.department}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                onClick={() => onDelete(member.id)}
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