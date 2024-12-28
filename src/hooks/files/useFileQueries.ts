import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";

export const useFileQueries = (currentFolderId: string | null) => {
  const { session } = useSessionContext();
  const { toast } = useToast();

  // Get user's organization_id
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile", session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", session?.user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch profile data",
        });
        throw error;
      }
      
      if (!data?.organization_id) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No organization found",
        });
        throw new Error("No organization found");
      }
      
      return data;
    },
  });

  // Fetch current folder details
  const { data: currentFolder } = useQuery({
    queryKey: ["folder", currentFolderId, profile?.organization_id],
    enabled: !!currentFolderId && !!profile?.organization_id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("folders")
        .select("*, parent:parent_id(*)")
        .eq("id", currentFolderId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching folder:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch folder details",
        });
        throw error;
      }
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
      
      if (error) {
        console.error("Error fetching folders:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch folders",
        });
        throw error;
      }
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
      
      if (error) {
        console.error("Error fetching files:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch files",
        });
        throw error;
      }
      return data;
    },
  });

  return {
    profile,
    isLoadingProfile,
    currentFolder,
    folders,
    files,
    isLoadingFolders,
    isLoadingFiles,
  };
};