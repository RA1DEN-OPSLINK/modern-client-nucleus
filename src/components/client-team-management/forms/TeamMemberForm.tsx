import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TeamMemberFormProps {
  teamMemberForm: {
    name: string;
    role: string;
    email: string;
    department: string;
  };
  setTeamMemberForm: (form: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const TeamMemberForm = ({ teamMemberForm, setTeamMemberForm, onSubmit }: TeamMemberFormProps) => {
  return (
    <Card className="mb-6 transform transition-all duration-200 hover:shadow-lg">
      <CardHeader>
        <CardTitle>Add Team Member</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={teamMemberForm.name}
                onChange={(e) => setTeamMemberForm({...teamMemberForm, name: e.target.value})}
                placeholder="Enter name"
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Input
                id="role"
                value={teamMemberForm.role}
                onChange={(e) => setTeamMemberForm({...teamMemberForm, role: e.target.value})}
                placeholder="Enter role"
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teamEmail">Email *</Label>
              <Input
                id="teamEmail"
                type="email"
                value={teamMemberForm.email}
                onChange={(e) => setTeamMemberForm({...teamMemberForm, email: e.target.value})}
                placeholder="Enter email"
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={teamMemberForm.department}
                onChange={(e) => setTeamMemberForm({...teamMemberForm, department: e.target.value})}
                placeholder="Enter department"
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 transition-colors">
            Add Team Member
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};