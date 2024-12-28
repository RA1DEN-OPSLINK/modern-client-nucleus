import { useFiles } from "@/hooks/useFiles";
import { Button } from "@/components/ui/button";
import { FolderPlus } from "lucide-react";
import { CreateFolderDialog } from "@/components/files/CreateFolderDialog";
import { FileList } from "@/components/files/FileList";
import { FolderBreadcrumb } from "@/components/files/FolderBreadcrumb";
import { FileUpload } from "@/components/files/FileUpload";
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
    uploadingFiles,
    setUploadingFiles,
    profile,
    isLoadingProfile,
    folders,
    files,
    isLoadingFolders,
    isLoadingFiles,
    createFolder,
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
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setIsCreateFolderOpen(true)}
            disabled={!profile?.organization_id}
          >
            <FolderPlus className="mr-2 h-4 w-4" />
            New Folder
          </Button>
          <FileUpload
            currentFolderId={currentFolderId}
            organizationId={profile.organization_id}
            onUploadStart={setUploadingFiles}
            onUploadComplete={() => setUploadingFiles([])}
          />
        </div>
      </div>

      <FileList
        folders={folders || []}
        files={files || []}
        onFolderSelect={handleFolderNavigation}
        onFolderDelete={(id) => deleteFolder.mutate(id)}
        onFileDownload={handleFileDownload}
        onFileDelete={(id) => deleteFile.mutate(id)}
        isLoading={isLoadingFolders || isLoadingFiles}
      />

      <CreateFolderDialog
        open={isCreateFolderOpen}
        onOpenChange={setIsCreateFolderOpen}
        onCreateFolder={(name) => createFolder.mutate(name)}
      />

      {uploadingFiles.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-background border rounded-lg p-4 shadow-lg">
          <h3 className="font-semibold mb-2">Uploading files...</h3>
          {uploadingFiles.map((file) => (
            <div key={file.name} className="text-sm">
              {file.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}