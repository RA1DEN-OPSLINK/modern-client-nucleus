import { Folder, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FolderCardProps {
  folder: {
    id: string;
    name: string;
  };
  onSelect: (folderId: string) => void;
  onDelete: (folderId: string) => void;
}

export function FolderCard({ folder, onSelect, onDelete }: FolderCardProps) {
  return (
    <div className="p-4 border rounded-lg hover:bg-accent cursor-pointer relative group">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(folder.id);
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      <div
        className="flex items-center gap-2"
        onClick={() => onSelect(folder.id)}
      >
        <Folder className="h-6 w-6" />
        <span>{folder.name}</span>
      </div>
    </div>
  );
}