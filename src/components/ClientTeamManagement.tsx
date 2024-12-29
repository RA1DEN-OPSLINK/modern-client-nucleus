import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Building2, User, AlertCircle, Search, Plus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { ClientForm } from './client-team-management/forms/ClientForm';
import { TeamMemberForm } from './client-team-management/forms/TeamMemberForm';
import { ClientList } from './client-team-management/lists/ClientList';
import { TeamMemberList } from './client-team-management/lists/TeamMemberList';

const ClientTeamManagement = () => {
  const { toast } = useToast();
  const [clientForm, setClientForm] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: ''
  });

  const [teamMemberForm, setTeamMemberForm] = useState({
    name: '',
    role: '',
    email: '',
    department: ''
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientForm.companyName || !clientForm.email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
      });
      return;
    }
    setClients([...clients, { ...clientForm, id: Date.now() }]);
    setClientForm({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: ''
    });
    setIsFormVisible(false);
    setSuccessMessage("Client added successfully!");
    setErrorMessage('');
    toast({
      title: "Success",
      description: "Client added successfully!",
    });
  };

  const handleTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamMemberForm.name || !teamMemberForm.email || !teamMemberForm.role) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
      });
      return;
    }
    setTeamMembers([...teamMembers, { ...teamMemberForm, id: Date.now() }]);
    setTeamMemberForm({
      name: '',
      role: '',
      email: '',
      department: ''
    });
    setIsFormVisible(false);
    setSuccessMessage("Team member added successfully!");
    setErrorMessage('');
    toast({
      title: "Success",
      description: "Team member added successfully!",
    });
  };

  const handleDelete = (id: number, type: 'client' | 'team') => {
    if (type === 'client') {
      setClients(clients.filter(client => client.id !== id));
    } else {
      setTeamMembers(teamMembers.filter(member => member.id !== id));
    }
    setSuccessMessage(`${type === 'client' ? 'Client' : 'Team member'} deleted successfully!`);
    setErrorMessage('');
    toast({
      title: "Success",
      description: `${type === 'client' ? 'Client' : 'Team member'} deleted successfully!`,
    });
  };

  const filteredClients = clients.filter(client =>
    client.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTeamMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add New
        </Button>
      </div>

      <Tabs defaultValue="clients" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="clients" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Clients
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Team Members
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clients">
          {isFormVisible && (
            <ClientForm
              clientForm={clientForm}
              setClientForm={setClientForm}
              onSubmit={handleClientSubmit}
            />
          )}
          <ClientList
            clients={filteredClients}
            onDelete={(id) => handleDelete(id, 'client')}
          />
        </TabsContent>

        <TabsContent value="team">
          {isFormVisible && (
            <TeamMemberForm
              teamMemberForm={teamMemberForm}
              setTeamMemberForm={setTeamMemberForm}
              onSubmit={handleTeamSubmit}
            />
          )}
          <TeamMemberList
            teamMembers={filteredTeamMembers}
            onDelete={(id) => handleDelete(id, 'team')}
          />
        </TabsContent>
      </Tabs>

      {(successMessage || errorMessage) && (
        <Alert className={`mt-4 transform transition-all duration-200 ${
          successMessage ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        }`}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {successMessage || errorMessage}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ClientTeamManagement;