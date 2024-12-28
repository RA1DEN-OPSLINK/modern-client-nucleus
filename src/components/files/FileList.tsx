import { FileCard } from "./FileCard";
import { FolderCard } from "./FolderCard";

interface FileListProps {
  folders: any[];
  files: any[];
  onFolderSelect: (folderId: string) => void;
  onFolderDelete: (folderId: string) => void;
  onFileDownload: (file: any) => void;
  onFileDelete: (fileId: string) => void;
  isLoading: boolean;
}

export function FileList({
  folders,
  files,
  onFolderSelect,
  onFolderDelete,
  onFileDownload,
  onFileDelete,
  isLoading,
}: FileListProps) {
  if (isLoading) {
    return <div className="text-center">Loading...</div>;
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