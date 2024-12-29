import { useSessionContext } from "@supabase/auth-helpers-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ClientTeamManagement from "./ClientTeamManagement";
import { useToast } from "@/hooks/use-toast";

export const CreateDialog = () => {
  const { session } = useSessionContext();
  const { toast } = useToast();

  const handleOpen = (open: boolean) => {
    if (open && !session) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to create new items.",
      });
      return false;
    }
    return true;
  };

  return (
    <Dialog onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Plus className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <ClientTeamManagement />
      </DialogContent>
    </Dialog>
  );
};