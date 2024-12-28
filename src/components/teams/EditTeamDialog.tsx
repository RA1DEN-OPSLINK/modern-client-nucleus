import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface EditTeamDialogProps {
  team?: {
    id: string;
    name: string;
    description: string | null;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTeamDialog({ team, open, onOpenChange }: EditTeamDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      name: team?.name || "",
      description: team?.description || "",
    },
  });

  const onSubmit = async (data: { name: string; description: string }) => {
    try {
      const { error } = await supabase
        .from("teams")
        .update({
          name: data.name,
          description: data.description,
        })
        .eq("id", team?.id);

      if (error) throw error;

      toast({
        title: "Team updated successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["teams"] });
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating team",
        description: error.message,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Team</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Team Name</Label>
            <Input
              id="name"
              {...register("name", { required: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}