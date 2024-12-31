import { useSessionContext } from "@supabase/auth-helpers-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UsersRolesTable } from "@/components/UsersRolesTable";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { session, isLoading: isSessionLoading } = useSessionContext();

  if (isSessionLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-[300px]" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[100px]" />
          ))}
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <p className="text-muted-foreground">Please sign in to view the dashboard</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader userEmail={session.user.email} />
      <DashboardStats />
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