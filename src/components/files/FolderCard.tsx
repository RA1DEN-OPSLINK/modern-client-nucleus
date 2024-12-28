import { Folder, Trash2, Clock, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface FolderCardProps {
  folder: {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
  };
  onSelect: (folderId: string) => void;
  onDelete: (folderId: string) => void;
  onEdit: (folder: { id: string; name: string }) => void;
}

export function FolderCard({ folder, onSelect, onDelete, onEdit }: FolderCardProps) {
  return (
    <div className="p-4 border rounded-lg hover:bg-accent cursor-pointer relative group hover:shadow-md transition-all">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(folder);
          }}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(folder.id);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div
        className="flex items-center gap-2 mb-2"
        onClick={() => onSelect(folder.id)}
      >
        <Folder className="h-6 w-6" />
        <span className="font-medium">{folder.name}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 px-2">
              <Clock className="h-3 w-3 mr-1" />
              {format(new Date(folder.created_at), 'MMM d, yyyy')}
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <p className="text-sm">
                Created: {format(new Date(folder.created_at), 'PPpp')}
              </p>
              <p className="text-sm">
                Last modified: {format(new Date(folder.updated_at), 'PPpp')}
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  );
}