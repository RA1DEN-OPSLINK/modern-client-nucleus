import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CreateFolderParams {
  name: string;
  organizationId: string;
  parentId: string | null;
}

interface EditFolderParams {
  id: string;
  name: string;
  organizationId: string;
}

export const useFileMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createFolder = useMutation({
    mutationFn: async ({ name, organizationId, parentId }: CreateFolderParams) => {
      const { data, error } = await supabase.from("folders").insert({
        name,
        parent_id: parentId,
        organization_id: organizationId,
      }).select().single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      toast({
        title: "Folder created successfully",
      });
    },
    onError: (error: any) => {
      console.error("Error creating folder:", error);
      toast({
        variant: "destructive",
        title: "Error creating folder",
        description: error.message,
      });
    },
  });

  const editFolder = useMutation({
    mutationFn: async ({ id, name, organizationId }: EditFolderParams) => {
      const { data, error } = await supabase
        .from("folders")
        .update({ name })
        .eq("id", id)
        .eq("organization_id", organizationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      toast({
        title: "Folder updated successfully",
      });
    },
    onError: (error: any) => {
      console.error("Error updating folder:", error);
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
      console.error("Error deleting folder:", error);
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
      console.error("Error deleting file:", error);
      toast({
        variant: "destructive",
        title: "Error deleting file",
        description: error.message,
      });
    },
  });

  return {
    createFolder: (params: CreateFolderParams) => createFolder.mutate(params),
    editFolder: (params: EditFolderParams) => editFolder.mutate(params),
    deleteFolder: (id: string) => deleteFolder.mutate(id),
    deleteFile: (id: string) => deleteFile.mutate(id),
  };
};