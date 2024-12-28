import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { AvatarSection } from "./form-sections/AvatarSection";
import { PersonalInfoSection } from "./form-sections/PersonalInfoSection";
import { AddressSection } from "./form-sections/AddressSection";
import { TeamSection } from "./form-sections/TeamSection";
import { ProfileFormData } from "./types";

interface ProfileFormProps {
  formData: ProfileFormData;
  setFormData: (data: Partial<ProfileFormData>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isLoading: boolean;
  organizationId: string;
}

export function ProfileForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isLoading,
  organizationId,
}: ProfileFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col h-[calc(100vh-200px)] max-h-[800px]">
      <ScrollArea className="flex-1">
        <div className="px-6 py-4 space-y-8">
          <AvatarSection formData={formData} setFormData={setFormData} />
          <PersonalInfoSection formData={formData} setFormData={setFormData} />
          <AddressSection formData={formData} setFormData={setFormData} />
          <TeamSection 
            formData={formData} 
            setFormData={setFormData} 
            organizationId={organizationId}
          />
        </div>
      </ScrollArea>

      <div className="flex justify-end gap-4 px-6 py-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Team Member"}
        </Button>
      </div>
    </form>
  );
}