import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { Users, UserCheck, UserCircle, UserPlus } from "lucide-react";
import { UsersRolesTable } from "@/components/UsersRolesTable";

const Index = () => {
  const { session } = useSessionContext();

  const stats = [
    {
      title: "Total Clients",
      value: "0",
      icon: Users,
    },
    {
      title: "Active Clients",
      value: "0",
      icon: UserCheck,
    },
    {
      title: "Team Members",
      value: "1",
      icon: UserCircle,
    },
    {
      title: "Leads",
      value: "0",
      icon: UserPlus,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session?.user.email}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users & Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <UsersRolesTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;