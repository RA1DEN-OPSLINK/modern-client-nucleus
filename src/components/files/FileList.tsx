import { FileCard } from "./FileCard";
import { FolderCard } from "./FolderCard";

interface FileListProps {
  folders: any[];
  files: any[];
  onFolderSelect: (folderId: string) => void;
  onFolderDelete: (folderId: string) => void;
  onFolderEdit: (folder: { id: string; name: string }) => void;
  onFileDownload: (file: any) => void;
  onFileDelete: (fileId: string) => void;
  isLoading: boolean;
}

export function FileList({
  folders,
  files,
  onFolderSelect,
  onFolderDelete,
  onFolderEdit,
  onFileDownload,
  onFileDelete,
  isLoading,
}: FileListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (!folders?.length && !files?.length) {
    return (
      <div className="text-center text-muted-foreground py-8">
        This folder is empty
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {folders?.map((folder) => (
        <FolderCard
          key={folder.id}
          folder={folder}
          onSelect={onFolderSelect}
          onDelete={onFolderDelete}
          onEdit={onFolderEdit}
        />
      ))}

      {files?.map((file) => (
        <FileCard
          key={file.id}
          file={file}
          onDownload={onFileDownload}
          onDelete={onFileDelete}
        />
      ))}
    </div>
  );
}