import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AddTeamMember } from "./AddTeamMember";
import { TeamMemberList } from "./TeamMemberList";

interface TeamMember {
  id: string;
  profiles: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
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
          <AddTeamMember
            email={email}
            onEmailChange={setEmail}
            onAddMember={handleAddMember}
          />

          <TeamMemberList
            teamMembers={teamMembers || []}
            onRemoveMember={handleRemoveMember}
            isLoading={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}