import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Folder, File, Upload, FolderPlus, ArrowLeft, Trash2, Download } from "lucide-react";
import { useSessionContext } from "@supabase/auth-helpers-react";

export default function Files() {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { session } = useSessionContext();

  // Get user's organization_id
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", session?.user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Fetch folders
  const { data: folders } = useQuery({
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
  const { data: files } = useQuery({
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

  // Create folder mutation
  const createFolder = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.from("folders").insert({
        name: newFolderName,
        parent_id: currentFolderId,
        organization_id: profile?.organization_id,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      setIsCreateFolderOpen(false);
      setNewFolderName("");
      toast({
        title: "Folder created successfully",
      });
    },
    onError: (error) => {
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
    onError: (error) => {
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
    onError: (error) => {
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
    if (!files) return;

    setUploadingFiles(Array.from(files));

    for (const file of files) {
      try {
        // Upload file to storage
        const { data: storageData, error: storageError } = await supabase.storage
          .from("files")
          .upload(`${profile?.organization_id}/${file.name}`, file);

        if (storageError) throw storageError;

        // Create file record in database
        const { error: dbError } = await supabase.from("files").insert({
          name: file.name,
          folder_id: currentFolderId,
          organization_id: profile?.organization_id,
          storage_path: storageData.path,
          size: file.size,
          mime_type: file.type,
        });

        if (dbError) throw dbError;

        queryClient.invalidateQueries({ queryKey: ["files"] });
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
  };

  // Handle file download
  const handleFileDownload = async (file: any) => {
    try {
      const { data, error } = await supabase.storage
        .from("files")
        .download(file.storage_path);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error downloading file",
        description: error.message,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {currentFolderId && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentFolderId(null)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h1 className="text-3xl font-bold tracking-tight">Files</h1>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
            <DialogTrigger asChild>
              <Button>
                <FolderPlus className="mr-2 h-4 w-4" />
                New Folder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Folder name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                />
                <Button
                  onClick={() => createFolder.mutate()}
                  disabled={!newFolderName}
                >
                  Create
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <div className="relative">
            <input
              type="file"
              multiple
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileUpload}
            />
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Files
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {folders?.map((folder) => (
          <div
            key={folder.id}
            className="p-4 border rounded-lg hover:bg-accent cursor-pointer relative group"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                deleteFolder.mutate(folder.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <div
              className="flex items-center gap-2"
              onClick={() => setCurrentFolderId(folder.id)}
            >
              <Folder className="h-6 w-6" />
              <span>{folder.name}</span>
            </div>
          </div>
        ))}

        {files?.map((file) => (
          <div
            key={file.id}
            className="p-4 border rounded-lg relative group"
          >
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleFileDownload(file)}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteFile.mutate(file.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <File className="h-6 w-6" />
              <span>{file.name}</span>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </div>
          </div>
        ))}
      </div>

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