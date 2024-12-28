import { File, Download, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface FileCardProps {
  file: {
    id: string;
    name: string;
    size?: number;
    created_at: string;
    updated_at: string;
  };
  onDownload: (file: any) => void;
  onDelete: (fileId: string) => void;
}

export function FileCard({ file, onDownload, onDelete }: FileCardProps) {
  return (
    <div className="p-4 border rounded-lg relative group hover:shadow-md transition-all">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDownload(file)}
          className="h-8 w-8"
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(file.id)}
          className="h-8 w-8 text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <File className="h-6 w-6" />
        <span className="font-medium truncate">{file.name}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {file.size && (
          <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
        )}
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 px-2">
              <Clock className="h-3 w-3 mr-1" />
              {format(new Date(file.created_at), 'MMM d, yyyy')}
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <p className="text-sm">
                Created: {format(new Date(file.created_at), 'PPpp')}
              </p>
              <p className="text-sm">
                Last modified: {format(new Date(file.updated_at), 'PPpp')}
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  );
}