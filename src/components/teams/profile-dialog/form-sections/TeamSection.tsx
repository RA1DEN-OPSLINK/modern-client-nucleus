import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProfileFormData } from "../types";

interface TeamSectionProps {
  formData: ProfileFormData;
  setFormData: (data: Partial<ProfileFormData>) => void;
  organizationId: string;
}

export function TeamSection({ formData, setFormData, organizationId }: TeamSectionProps) {
  const { data: teams } = useQuery({
    queryKey: ["teams", organizationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teams")
        .select("id, name")
        .eq("organization_id", organizationId);

      if (error) throw error;
      return data;
    },
    enabled: !!organizationId,
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Team Assignment</h3>
      
      <div className="space-y-2">
        <Label htmlFor="teams">Assign to Teams</Label>
        <Select
          value={formData.teamIds[0]}
          onValueChange={(value) => setFormData({ teamIds: [value] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a team" />
          </SelectTrigger>
          <SelectContent>
            {teams?.map((team) => (
              <SelectItem key={team.id} value={team.id}>
                {team.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}