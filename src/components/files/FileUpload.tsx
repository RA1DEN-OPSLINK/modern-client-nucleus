import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface FileUploadProps {
  currentFolderId: string | null;
  organizationId: string;
  onUploadStart: (files: File[]) => void;
  onUploadComplete: () => void;
}

export function FileUpload({ 
  currentFolderId, 
  organizationId, 
  onUploadStart,
  onUploadComplete 
}: FileUploadProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) {
      toast({
        variant: "destructive",
        title: "Error uploading file",
        description: "No files selected",
      });
      return;
    }

    onUploadStart(Array.from(files));

    for (const file of files) {
      try {
        // Upload file to storage
        const { data: storageData, error: storageError } = await supabase.storage
          .from("files")
          .upload(`${organizationId}/${file.name}`, file);

        if (storageError) throw storageError;

        // Create file record in database
        const { error: dbError } = await supabase.from("files").insert({
          name: file.name,
          folder_id: currentFolderId,
          organization_id: organizationId,
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

    onUploadComplete();
    // Clear the input value to allow uploading the same file again
    event.target.value = '';
  };

  return (
    <div className="relative">
      <input
        type="file"
        multiple
        className="absolute inset-0 opacity-0 cursor-pointer"
        onChange={handleFileUpload}
        disabled={!organizationId}
      />
      <Button disabled={!organizationId}>
        <Upload className="mr-2 h-4 w-4" />
        Upload Files
      </Button>
    </div>
  );
}