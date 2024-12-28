import { useFileQueries } from "./files/useFileQueries";
import { useFileMutations } from "./files/useFileMutations";
import { useFileNavigation } from "./files/useFileNavigation";
import { useFileDialogs } from "./files/useFileDialogs";

export const useFiles = () => {
  const {
    currentFolderId,
    setCurrentFolderId,
    folderPath,
    setFolderPath,
    handleFolderNavigation,
  } = useFileNavigation();

  const {
    profile,
    isLoadingProfile,
    currentFolder,
    folders,
    files,
    isLoadingFolders,
    isLoadingFiles,
  } = useFileQueries(currentFolderId);

  const {
    createFolder,
    editFolder,
    deleteFolder,
    deleteFile,
  } = useFileMutations();

  const {
    isCreateFolderOpen,
    setIsCreateFolderOpen,
    editingFolder,
    setEditingFolder,
    uploadingFiles,
    setUploadingFiles,
  } = useFileDialogs();

  return {
    // Navigation state
    currentFolderId,
    setCurrentFolderId,
    folderPath,
    setFolderPath,
    
    // Dialog state
    isCreateFolderOpen,
    setIsCreateFolderOpen,
    editingFolder,
    setEditingFolder,
    uploadingFiles,
    setUploadingFiles,
    
    // Data and loading states
    profile,
    isLoadingProfile,
    currentFolder,
    folders,
    files,
    isLoadingFolders,
    isLoadingFiles,
    
    // Mutations
    createFolder: (name: string) => {
      if (!profile?.organization_id) return;
      createFolder.mutate({ 
        name, 
        organizationId: profile.organization_id,
        parentId: currentFolderId 
      });
    },
    editFolder: (id: string, name: string) => {
      if (!profile?.organization_id) return;
      editFolder.mutate({ id, name, organizationId: profile.organization_id });
    },
    deleteFolder: deleteFolder.mutate,
    deleteFile: deleteFile.mutate,
    
    // Navigation handlers
    handleFolderNavigation,
  };
};