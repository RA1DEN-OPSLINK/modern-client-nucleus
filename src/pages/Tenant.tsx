import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Users, Building2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { TeamsTable } from "@/components/TeamsTable";
import { ClientsTable } from "@/components/ClientsTable";
import { CreateTeamDialog } from "@/components/CreateTeamDialog";
import { CreateClientDialog } from "@/components/CreateClientDialog";
import { useState } from "react";

export default function Tenant() {
  const { toast } = useToast();
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [isCreateClientOpen, setIsCreateClientOpen] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("*, organizations(*)")
        .eq("id", user.id)
        .single();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching profile",
          description: error.message,
        });
        return null;
      }

      return data;
    },
  });

  const { data: stats } = useQuery({
    queryKey: ["tenant-stats", profile?.organization_id],
    enabled: !!profile?.organization_id,
    queryFn: async () => {
      const [teamsResult, clientsResult] = await Promise.all([
        supabase
          .from("teams")
          .select("id", { count: "exact" })
          .eq("organization_id", profile?.organization_id),
        supabase
          .from("clients")
          .select("id", { count: "exact" })
          .eq("organization_id", profile?.organization_id),
      ]);

      return {
        teams: teamsResult.count || 0,
        clients: clientsResult.count || 0,
      };
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {profile?.organizations?.name || "Organization"}
        </h1>
        <p className="text-muted-foreground">
          Manage your organization's teams and clients
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Teams
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.teams || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Clients
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.clients || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="teams" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
          </TabsList>
          <div className="space-x-2">
            <Button
              onClick={() => setIsCreateTeamOpen(true)}
              className="hidden data-[state=active]:block [&[data-state=active]]:block"
              data-state={isCreateTeamOpen ? "active" : undefined}
            >
              <Plus className="mr-2 h-4 w-4" /> Create Team
            </Button>
            <Button
              onClick={() => setIsCreateClientOpen(true)}
              className="hidden data-[state=active]:block [&[data-state=active]]:block"
              data-state={isCreateClientOpen ? "active" : undefined}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Client
            </Button>
          </div>
        </div>

        <TabsContent value="teams" className="space-y-4">
          <TeamsTable organizationId={profile?.organization_id} />
        </TabsContent>
        <TabsContent value="clients" className="space-y-4">
          <ClientsTable organizationId={profile?.organization_id} />
        </TabsContent>
      </Tabs>

      <CreateTeamDialog
        open={isCreateTeamOpen}
        onOpenChange={setIsCreateTeamOpen}
        organizationId={profile?.organization_id}
      />
      <CreateClientDialog
        open={isCreateClientOpen}
        onOpenChange={setIsCreateClientOpen}
        organizationId={profile?.organization_id}
      />
    </div>
  );
}