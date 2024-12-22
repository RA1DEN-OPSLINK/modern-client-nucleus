import { useQuery } from "@tanstack/react-query";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { ProfileForm } from "@/components/ProfileForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfilesTable } from "@/integrations/supabase/types/tables";

const Profile = () => {
  const { session } = useSessionContext();
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user.id)
        .single();

      if (error) throw error;
      
      // Ensure the role is of the correct type
      if (!isValidRole(data.role)) {
        throw new Error("Invalid role type received from database");
      }
      
      return data as ProfilesTable["Row"];
    },
    enabled: !!session?.user.id,
  });

  // Type guard to ensure role is valid
  const isValidRole = (role: string): role is ProfilesTable["Row"]["role"] => {
    return ["tenant", "manager", "team", "client"].includes(role);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {profile && <ProfileForm profile={profile} />}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;