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
    createFolder,
    editFolder,
    deleteFolder,
    deleteFile,
    
    // Navigation handlers
    handleFolderNavigation,
  };
};