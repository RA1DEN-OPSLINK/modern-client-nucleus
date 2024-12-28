import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { FolderPath } from "./types";

export const useFileNavigation = () => {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folderPath, setFolderPath] = useState<FolderPath[]>([{ id: null, name: "Files" }]);
  const { toast } = useToast();

  const updateFolderPath = async (folder: any) => {
    try {
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
    } catch (error: any) {
      console.error("Error updating folder path:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update folder path",
      });
    }
  };

  const handleFolderNavigation = async (folderId: string | null) => {
    try {
      setCurrentFolderId(folderId);
      if (!folderId) {
        setFolderPath([{ id: null, name: "Files" }]);
      } else {
        const { data, error } = await supabase
          .from("folders")
          .select("*, parent:parent_id(*)")
          .eq("id", folderId)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          updateFolderPath(data);
        }
      }
    } catch (error: any) {
      console.error("Error navigating to folder:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to navigate to folder",
      });
    }
  };

  return {
    currentFolderId,
    setCurrentFolderId,
    folderPath,
    setFolderPath,
    handleFolderNavigation,
  };
};