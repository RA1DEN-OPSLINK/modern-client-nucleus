import { Button } from "@/components/ui/button";
import { Edit, Trash2, UserPlus } from "lucide-react";

interface TeamTableActionsProps {
  onManageMembers: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function TeamTableActions({ onManageMembers, onEdit, onDelete }: TeamTableActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={onManageMembers}
      >
        <UserPlus className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onEdit}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}