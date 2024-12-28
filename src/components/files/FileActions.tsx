import { Button } from "@/components/ui/button";
import { FolderPlus } from "lucide-react";
import { FileUpload } from "./FileUpload";

interface FileActionsProps {
  organizationId: string;
  currentFolderId: string | null;
  onCreateFolder: () => void;
  onUploadStart: (files: File[]) => void;
  onUploadComplete: () => void;
}

export function FileActions({
  organizationId,
  currentFolderId,
  onCreateFolder,
  onUploadStart,
  onUploadComplete,
}: FileActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button onClick={onCreateFolder}>
        <FolderPlus className="mr-2 h-4 w-4" />
        New Folder
      </Button>
      <FileUpload
        currentFolderId={currentFolderId}
        organizationId={organizationId}
        onUploadStart={onUploadStart}
        onUploadComplete={onUploadComplete}
      />
    </div>
  );
}