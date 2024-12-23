import { useQuery } from "@tanstack/react-query";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { ProfileForm } from "@/components/ProfileForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfilesTable } from "@/integrations/supabase/types/tables";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const { session } = useSessionContext();
  
  const { data: profile, isLoading, error, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!session?.user?.id) {
        throw new Error("No user session found");
      }

      console.log("Fetching profile for user:", session.user.id);
      
      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      if (fetchError) {
        console.error("Profile fetch error:", fetchError);
        throw fetchError;
      }

      if (!data) {
        console.error("No profile found for user");
        throw new Error("Profile not found");
      }
      
      // Ensure the role is of the correct type
      if (!isValidRole(data.role)) {
        throw new Error("Invalid role type received from database");
      }
      
      return data as ProfilesTable["Row"];
    },
    enabled: !!session?.user?.id,
    retry: 1
  });

  // Type guard to ensure role is valid
  const isValidRole = (role: string): role is ProfilesTable["Row"]["role"] => {
    return ["tenant", "manager", "team", "client"].includes(role);
  };

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>Failed to load profile. Please try again.</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()}
            className="ml-4"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="container max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
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