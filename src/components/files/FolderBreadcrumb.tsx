import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FolderPath {
  id: string | null;
  name: string;
}

interface FolderBreadcrumbProps {
  path: FolderPath[];
  onNavigate: (folderId: string | null) => void;
}

export function FolderBreadcrumb({ path, onNavigate }: FolderBreadcrumbProps) {
  return (
    <div className="flex items-center gap-1 text-sm text-muted-foreground">
      {path.map((folder, index) => (
        <div key={folder.id || 'root'} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
          <Button
            variant="link"
            className="p-0 h-auto font-normal"
            onClick={() => onNavigate(folder.id)}
          >
            {folder.name}
          </Button>
        </div>
      ))}
    </div>
  );
}