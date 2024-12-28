import { File, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileCardProps {
  file: {
    id: string;
    name: string;
    size?: number;
  };
  onDownload: (file: any) => void;
  onDelete: (fileId: string) => void;
}

export function FileCard({ file, onDownload, onDelete }: FileCardProps) {
  return (
    <div className="p-4 border rounded-lg relative group">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDownload(file)}
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(file.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <File className="h-6 w-6" />
        <span>{file.name}</span>
      </div>
      {file.size && (
        <div className="text-sm text-muted-foreground mt-1">
          {(file.size / 1024 / 1024).toFixed(2)} MB
        </div>
      )}
    </div>
  );
}