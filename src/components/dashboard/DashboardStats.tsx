import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserCircle, UserPlus } from "lucide-react";

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

export function DashboardStats() {
  return (
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
  );
}