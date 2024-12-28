import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface TeamMember {
  id: string;
  profiles: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
}

interface TeamMemberListProps {
  teamMembers: TeamMember[];
  onRemoveMember: (memberId: string) => void;
  isLoading: boolean;
}

export function TeamMemberList({ teamMembers, onRemoveMember, isLoading }: TeamMemberListProps) {
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-2">
      {teamMembers?.map((member) => (
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
            onClick={() => onRemoveMember(member.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}