import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ClientAvatarProps {
  clientId: string;
  name: string;
  onUploadComplete: (url: string) => void;
}

export function ClientAvatar({ clientId, name, onUploadComplete }: ClientAvatarProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${clientId}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setAvatarUrl(publicUrl.publicUrl);
      onUploadComplete(publicUrl.publicUrl);

      toast({
        title: "Avatar uploaded",
        description: "Client avatar has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload avatar. Please try again.",
      });
      console.error("Error uploading avatar:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center space-x-4 mb-6">
      <Avatar className="h-20 w-20">
        <AvatarImage src={avatarUrl || undefined} />
        <AvatarFallback>
          {name.split(' ').map(n => n[0]).join('').toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div>
        <Label htmlFor="avatar">Profile Picture</Label>
        <Input
          id="avatar"
          type="file"
          accept="image/*"
          onChange={handleAvatarUpload}
          disabled={isUploading}
          className="max-w-xs"
        />
        {isUploading && (
          <div className="flex items-center mt-2 text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </div>
        )}
      </div>
    </div>
  );
}