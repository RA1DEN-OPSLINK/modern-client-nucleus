import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Building2, AlertCircle, Search, Plus, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

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
          <TabsTrigger value="clients" className="flex items-center gap-2 transition-all duration-200 data-[state=active]:bg-blue-600">
            <Building2 className="h-4 w-4" />
            Clients
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2 transition-all duration-200 data-[state=active]:bg-blue-600">
            <User className="h-4 w-4" />
            Team Members
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clients">
          {isFormVisible && (
            <Card className="mb-6 transform transition-all duration-200 hover:shadow-lg">
              <CardHeader>
                <CardTitle>Add New Client</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleClientSubmit} className="space-y-4">
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
          )}

          <div className="grid gap-4">
            {filteredClients.map((client) => (
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
                      onClick={() => handleDelete(client.id, 'client')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="team">
          {isFormVisible && (
            <Card className="mb-6 transform transition-all duration-200 hover:shadow-lg">
              <CardHeader>
                <CardTitle>Add Team Member</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTeamSubmit} className="space-y-4">
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
          )}

          <div className="grid gap-4">
            {filteredTeamMembers.map((member) => (
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
                      onClick={() => handleDelete(member.id, 'team')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
