import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2, UserPlus } from "lucide-react";
import { ProfilesTable } from "@/integrations/supabase/types/tables";

interface TeamMember {
  id: string;
  profiles: ProfilesTable['Row'];
}

interface ManageTeamMembersDialogProps {
  teamId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ManageTeamMembersDialog({
  teamId,
  open,
  onOpenChange,
}: ManageTeamMembersDialogProps) {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ["team-members", teamId],
    enabled: !!teamId && open,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select(`
          id,
          profiles (
            id,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq("team_id", teamId);

      if (error) throw error;
      return data as TeamMember[];
    },
  });

  const handleAddMember = async () => {
    try {
      // First, find the profile by email
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email)
        .single();

      if (profileError || !profile) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "User not found",
        });
        return;
      }

      // Add the team member
      const { error } = await supabase
        .from("team_members")
        .insert({
          team_id: teamId,
          profile_id: profile.id,
        });

      if (error) throw error;

      toast({
        title: "Team member added successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["team-members", teamId] });
      setEmail("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error adding team member",
        description: error.message,
      });
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", memberId);

      if (error) throw error;

      toast({
        title: "Team member removed successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["team-members", teamId] });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error removing team member",
        description: error.message,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Team Members</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="email">Add Member by Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
              />
            </div>
            <Button
              className="self-end"
              onClick={handleAddMember}
              disabled={!email}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          <div className="space-y-2">
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              teamMembers?.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-2 rounded-lg border"
                >
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={member.profiles.avatar_url || undefined} />
                      <AvatarFallback>
                        {member.profiles.first_name?.[0]}
                        {member.profiles.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {member.profiles.first_name} {member.profiles.last_name}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}