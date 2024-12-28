import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";

interface AddTeamMemberProps {
  email: string;
  onEmailChange: (email: string) => void;
  onAddMember: () => void;
}

export function AddTeamMember({ email, onEmailChange, onAddMember }: AddTeamMemberProps) {
  return (
    <div className="flex gap-2">
      <div className="flex-1">
        <Label htmlFor="email">Add Member by Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="Enter email address"
        />
      </div>
      <Button
        className="self-end"
        onClick={onAddMember}
        disabled={!email}
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Add
      </Button>
    </div>
  );
}