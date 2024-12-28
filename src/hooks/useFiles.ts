import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useSessionContext } from "@supabase/auth-helpers-react";

export const useFiles = () => {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folderPath, setFolderPath] = useState([{ id: null, name: "Files" }]);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { session } = useSessionContext();
  const [editingFolder, setEditingFolder] = useState<{ id: string; name: string } | null>(null);

  // Get user's organization_id
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", session?.user.id)
        .maybeSingle();

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
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  // Fetch folders
  const { data: folders, isLoading: isLoadingFolders } = useQuery({
    queryKey: ["folders", currentFolderId, profile?.organization_id],
    enabled: !!profile?.organization_id,
    queryFn: async () => {
      let query = supabase
        .from("folders")
        .select("*")
        .eq("organization_id", profile.organization_id);
      
      if (currentFolderId) {
        query = query.eq("parent_id", currentFolderId);
      } else {
        query = query.is("parent_id", null);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Fetch files
  const { data: files, isLoading: isLoadingFiles } = useQuery({
    queryKey: ["files", currentFolderId, profile?.organization_id],
    enabled: !!profile?.organization_id,
    queryFn: async () => {
      let query = supabase
        .from("files")
        .select("*")
        .eq("organization_id", profile.organization_id);
      
      if (currentFolderId) {
        query = query.eq("folder_id", currentFolderId);
      } else {
        query = query.is("folder_id", null);
      }

      const { data, error } = await query;
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

  const editFolder = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      if (!profile?.organization_id) {
        throw new Error("No organization found");
      }

      const { data, error } = await supabase
        .from("folders")
        .update({ name })
        .eq("id", id)
        .eq("organization_id", profile.organization_id);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      setEditingFolder(null);
      toast({
        title: "Folder updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error updating folder",
        description: error.message,
      });
    },
  });

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

  return {
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
    currentFolder,
    folders,
    files,
    isLoadingFolders,
    isLoadingFiles,
    createFolder,
    editFolder,
    deleteFolder,
    deleteFile,
    editingFolder,
    setEditingFolder,
  };
};
