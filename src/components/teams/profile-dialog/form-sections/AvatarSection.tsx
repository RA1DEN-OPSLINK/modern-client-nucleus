import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProfileFormData } from "../types";

interface AvatarSectionProps {
  formData: ProfileFormData;
  setFormData: (data: Partial<ProfileFormData>) => void;
}

export function AvatarSection({ formData, setFormData }: AvatarSectionProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setFormData({ avatarUrl: publicUrl.publicUrl });
      
      toast({
        title: "Success",
        description: "Profile picture uploaded successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload profile picture",
      });
      console.error("Error uploading avatar:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex justify-center mb-8">
      <div className="text-center space-y-4">
        <Avatar className="w-24 h-24 mx-auto">
          <AvatarImage src={formData.avatarUrl || undefined} />
          <AvatarFallback>
            {formData.firstName && formData.lastName
              ? `${formData.firstName[0]}${formData.lastName[0]}`
              : "?"}
          </AvatarFallback>
        </Avatar>
        <div className="flex items-center gap-2 justify-center">
          <Input
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            disabled={isUploading}
            className="max-w-[200px]"
          />
          {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
        </div>
      </div>
    </div>
  );
}