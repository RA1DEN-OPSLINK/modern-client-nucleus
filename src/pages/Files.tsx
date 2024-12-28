import { useFiles } from "@/hooks/useFiles";
import { FileList } from "@/components/files/FileList";
import { FolderBreadcrumb } from "@/components/files/FolderBreadcrumb";
import { CreateFolderDialog } from "@/components/files/CreateFolderDialog";
import { EditFolderDialog } from "@/components/files/EditFolderDialog";
import { FileActions } from "@/components/files/FileActions";
import { UploadingFiles } from "@/components/files/UploadingFiles";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Files() {
  const { toast } = useToast();
  const {
    currentFolderId,
    setCurrentFolderId,
    folderPath,
    setFolderPath,
    isCreateFolderOpen,
    setIsCreateFolderOpen,
    editingFolder,
    setEditingFolder,
    uploadingFiles,
    setUploadingFiles,
    profile,
    isLoadingProfile,
    folders,
    files,
    isLoadingFolders,
    isLoadingFiles,
    createFolder,
    editFolder,
    deleteFolder,
    deleteFile,
  } = useFiles();

  // Handle file download
  const handleFileDownload = async (file: any) => {
    try {
      const { data, error } = await supabase.storage
        .from("files")
        .download(file.storage_path);

      if (error) throw error;

      const blob = new Blob([data], { type: file.mime_type });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error downloading file",
        description: error.message,
      });
    }
  };

  // Update folder path when navigating
  const updateFolderPath = async (folder: any) => {
    const newPath = [{ id: null, name: "Files" }];
    let currentFolder = folder;

    while (currentFolder) {
      newPath.unshift({
        id: currentFolder.id,
        name: currentFolder.name,
      });
      currentFolder = currentFolder.parent;
    }

    setFolderPath(newPath);
  };

  // Handle folder navigation
  const handleFolderNavigation = async (folderId: string | null) => {
    setCurrentFolderId(folderId);
    if (!folderId) {
      setFolderPath([{ id: null, name: "Files" }]);
    } else {
      const { data } = await supabase
        .from("folders")
        .select("*, parent:parent_id(*)")
        .eq("id", folderId)
        .maybeSingle();
      
      if (data) {
        updateFolderPath(data);
      }
    }
  };

  // Loading states
  if (isLoadingProfile) {
    return <div className="p-8 text-center">Loading profile...</div>;
  }

  if (!profile?.organization_id) {
    return <div className="p-8 text-center">No organization found. Please contact support.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Files</h1>
          <FolderBreadcrumb 
            path={folderPath}
            onNavigate={handleFolderNavigation}
          />
        </div>
        <FileActions 
          organizationId={profile.organization_id}
          currentFolderId={currentFolderId}
          onCreateFolder={() => setIsCreateFolderOpen(true)}
          onUploadStart={setUploadingFiles}
          onUploadComplete={() => setUploadingFiles([])}
        />
      </div>

      <FileList
        folders={folders || []}
        files={files || []}
        onFolderSelect={handleFolderNavigation}
        onFolderDelete={(id) => deleteFolder.mutate(id)}
        onFolderEdit={setEditingFolder}
        onFileDownload={handleFileDownload}
        onFileDelete={(id) => deleteFile.mutate(id)}
        isLoading={isLoadingFolders || isLoadingFiles}
      />

      <CreateFolderDialog
        open={isCreateFolderOpen}
        onOpenChange={setIsCreateFolderOpen}
        onCreateFolder={(name) => createFolder.mutate(name)}
      />

      <EditFolderDialog
        open={!!editingFolder}
        onOpenChange={(open) => !open && setEditingFolder(null)}
        onEditFolder={(id, name) => editFolder.mutate({ id, name })}
        folder={editingFolder}
      />

      <UploadingFiles files={uploadingFiles} />
    </div>
  );
}