import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ProfileFormData } from "./types";
import { AvatarSection } from "./form-sections/AvatarSection";
import { PersonalInfoSection } from "./form-sections/PersonalInfoSection";
import { AddressSection } from "./form-sections/AddressSection";
import { TeamSection } from "./form-sections/TeamSection";

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
    <form onSubmit={onSubmit} className="space-y-6 w-full max-w-3xl mx-auto max-h-[calc(100vh-200px)] overflow-y-auto">
      <div className="space-y-8 px-6">
        <AvatarSection formData={formData} setFormData={setFormData} />
        
        <div className="space-y-8">
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <PersonalInfoSection formData={formData} setFormData={setFormData} />
          </div>

          <div className="bg-card rounded-lg border shadow-sm p-6">
            <AddressSection formData={formData} setFormData={setFormData} />
          </div>

          <div className="bg-card rounded-lg border shadow-sm p-6">
            <TeamSection 
              formData={formData} 
              setFormData={setFormData} 
              organizationId={organizationId} 
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 px-6 py-4 bg-muted/10 border-t sticky bottom-0">
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