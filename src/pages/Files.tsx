import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { FolderPlus, ArrowLeft, Upload } from "lucide-react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { CreateFolderDialog } from "@/components/files/CreateFolderDialog";
import { FileList } from "@/components/files/FileList";
import { FolderBreadcrumb } from "@/components/files/FolderBreadcrumb";

export default function Files() {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folderPath, setFolderPath] = useState([{ id: null, name: "Files" }]);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { session } = useSessionContext();

  // Get user's organization_id
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", session?.user.id)
        .single();

      if (error) throw error;
      if (!data?.organization_id) throw new Error("No organization found");
      return data;
    },
  });

  // Fetch current folder details
  const { data: currentFolder } = useQuery({
    queryKey: ["folder", currentFolderId],
    enabled: !!currentFolderId && !!profile?.organization_id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("folders")
        .select("*, parent:parent_id(*)")
        .eq("id", currentFolderId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Update folder path when current folder changes
  const updateFolderPath = useCallback(async (folder: any) => {
    if (!folder) {
      setFolderPath([{ id: null, name: "Files" }]);
      return;
    }

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
  }, []);

  // Fetch folders
  const { data: folders, isLoading: isLoadingFolders } = useQuery({
    queryKey: ["folders", currentFolderId, profile?.organization_id],
    enabled: !!profile?.organization_id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("folders")
        .select("*")
        .eq("organization_id", profile.organization_id)
        .eq("parent_id", currentFolderId);

      if (error) throw error;
      return data;
    },
  });

  // Fetch files
  const { data: files, isLoading: isLoadingFiles } = useQuery({
    queryKey: ["files", currentFolderId, profile?.organization_id],
    enabled: !!profile?.organization_id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("files")
        .select("*")
        .eq("organization_id", profile.organization_id)
        .eq("folder_id", currentFolderId);

      if (error) throw error;
      return data;
    },
  });

  const createFolder = useMutation({
    mutationFn: async (name: string) => {
      if (!profile?.organization_id) {
        throw new Error("No organization found");
      }

      const { data, error } = await supabase.from("folders").insert({
        name,
        parent_id: currentFolderId,
        organization_id: profile.organization_id,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      setIsCreateFolderOpen(false);
      toast({
        title: "Folder created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error creating folder",
        description: error.message,
      });
    },
  });

  // Delete folder mutation
  const deleteFolder = useMutation({
    mutationFn: async (folderId: string) => {
      const { error } = await supabase
        .from("folders")
        .delete()
        .eq("id", folderId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      toast({
        title: "Folder deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error deleting folder",
        description: error.message,
      });
    },
  });

  // Delete file mutation
  const deleteFile = useMutation({
    mutationFn: async (fileId: string) => {
      const { error } = await supabase
        .from("files")
        .delete()
        .eq("id", fileId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      toast({
        title: "File deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error deleting file",
        description: error.message,
      });
    },
  });

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !profile?.organization_id) {
      toast({
        variant: "destructive",
        title: "Error uploading file",
        description: "No organization found or no files selected",
      });
      return;
    }

    setUploadingFiles(Array.from(files));

    for (const file of files) {
      try {
        // Upload file to storage
        const { data: storageData, error: storageError } = await supabase.storage
          .from("files")
          .upload(`${profile.organization_id}/${file.name}`, file);

        if (storageError) throw storageError;

        // Create file record in database
        const { error: dbError } = await supabase.from("files").insert({
          name: file.name,
          folder_id: currentFolderId,
          organization_id: profile.organization_id,
          storage_path: storageData.path,
          size: file.size,
          mime_type: file.type,
        });

        if (dbError) throw dbError;

        // Invalidate queries after successful upload
        await queryClient.invalidateQueries({ queryKey: ["files"] });
        
        toast({
          title: `${file.name} uploaded successfully`,
        });
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: `Error uploading ${file.name}`,
          description: error.message,
        });
      }
    }

    setUploadingFiles([]);
    // Clear the input value to allow uploading the same file again
    event.target.value = '';
  };

  // Handle file download
  const handleFileDownload = async (file: any) => {
    try {
      const { data, error } = await supabase.storage
        .from("files")
        .download(file.storage_path);

      if (error) throw error;

      // Create a new blob URL for each download
      const blob = new Blob([data], { type: file.mime_type });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL after download starts
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error downloading file",
        description: error.message,
      });
    }
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
        .single();
      
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
          <div className="relative">
            <input
              type="file"
              multiple
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileUpload}
              disabled={!profile?.organization_id}
            />
            <Button disabled={!profile?.organization_id}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Files
            </Button>
          </div>
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
