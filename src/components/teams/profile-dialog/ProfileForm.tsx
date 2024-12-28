import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ProfileFormData } from "./types";
import { AvatarSection } from "./form-sections/AvatarSection";
import { PersonalInfoSection } from "./form-sections/PersonalInfoSection";
import { AddressSection } from "./form-sections/AddressSection";
import { TeamSection } from "./form-sections/TeamSection";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProfileFormProps {
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
  formData: ProfileFormData;
  setFormData: (data: Partial<ProfileFormData>) => void;
  organizationId: string;
}

export function ProfileForm({
  isLoading,
  onSubmit,
  onCancel,
  formData,
  setFormData,
  organizationId,
}: ProfileFormProps) {
  return (
    <form onSubmit={onSubmit} className="h-full flex flex-col">
      <ScrollArea className="flex-1">
        <div className="px-6 py-4 space-y-8">
          <AvatarSection formData={formData} setFormData={setFormData} />
          
          <div className="grid gap-8">
            <div className="bg-card rounded-lg border p-6">
              <PersonalInfoSection formData={formData} setFormData={setFormData} />
            </div>

            <div className="bg-card rounded-lg border p-6">
              <AddressSection formData={formData} setFormData={setFormData} />
            </div>

            <div className="bg-card rounded-lg border p-6">
              <TeamSection 
                formData={formData} 
                setFormData={setFormData} 
                organizationId={organizationId} 
              />
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="flex items-center justify-end gap-4 px-6 py-4 border-t bg-muted/5">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Add Team Member'
          )}
        </Button>
      </div>
    </form>
  );
}