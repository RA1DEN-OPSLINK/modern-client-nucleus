import { useSessionContext } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { UserCircle } from "lucide-react";

export const Header = () => {
  const { session } = useSessionContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "Please try again later",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 flex h-[60px] w-full items-center border-b bg-background px-4 md:px-6">
      <div className="ml-auto flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/profile")}
        >
          <UserCircle className="h-5 w-5" />
        </Button>
        <span className="text-sm text-muted-foreground">
          {session?.user.email}
        </span>
        <Button variant="ghost" onClick={handleSignOut}>
          Sign out
        </Button>
      </div>
    </header>
  );
};