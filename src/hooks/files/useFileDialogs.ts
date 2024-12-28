import { useState } from "react";

export const useFileDialogs = () => {
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<{ id: string; name: string } | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);

  return {
    isCreateFolderOpen,
    setIsCreateFolderOpen,
    editingFolder,
    setEditingFolder,
    uploadingFiles,
    setUploadingFiles,
  };
};